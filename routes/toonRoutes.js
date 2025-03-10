import { Router } from "express"
import Toonz from "../model/webtoonz.js";
import Episode from "../model/episode.js";
import { authPage, authRoute, uploadEp, localSeriesUpload } from "../middlewares/tokencheckers.js";
import Comment from "../model/comments.js";
import User from "../model/users.js";
import { deleteFileFromFtp } from "../middlewares/ftpupload.js";

const router = Router()
 

router.get('/upload', authPage, (req, res) => {
    let message = 'Please, in this page you will upload the details of your webtoon and then in the second page you will upload a single chapter of your work for review and please do not close this page until the end of the whole process';
    res.render('seriesUpload', {title: 'Series Upload', message})
})

// get toonz
router.get('/', async (req, res) => {
    let { type } = req.query; 
    let toonz = type === 'twporiginal' ?  await Toonz.find({twporiginal: true, status: 'approved'}) : await Toonz.find({status: 'approved'});
    let episodes = type === 'twporiginal' ?  await Episode.find({twporiginal: true, isToonVerified: true}) : await Episode.find({isToonVerified: true});
    // res.json( {toonz, episodes} )
    res.render('list',{title: "Webtoonz", toonz, episodes, display: 'toonz'});
})

// add toonz
router.post('/', authRoute , async (req, res) => {
    let {title, author, genre, illustrator, description} = req.body;
    let {id, type} = req.user;
    let date = new Date().toDateString();

    if(!req.files || !req.files.coverImage) res.status(400).json({E: 'The cover image is required'})
    
    try{
        let isUpload = await localSeriesUpload(req.files.coverImage,title);
    
        if(!isUpload) throw new Error("Upload failed please retry");
    
        if(Array.isArray(genre)) genre = genre.join(',');

       let isToonz = await Toonz.create({
            title, 
            author, 
            genre, 
            illustrator, 
            description,
            coverImage: isUpload.url,
            fileCode: isUpload.code,
            status: (type.includes('admin')) ? 'approved' : 'pending',
            uploadAcc: id,
            uploader: (type.includes('admin')) ? 'admin' : 'regular',
            releaseDate: date,
            twporiginal: (type.includes('admin')) ? true : false
        });

        res.status(201).json({M: 'file uploaded succesful', toonzId: isToonz.id});
    }
    catch(err){
        res.status(500).json({E: err.message});
    }
})

// get toon
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const toon = await Toonz.findById(id);
        if(!toon) throw Error('to toon found with this id')
        const episodes = await Episode.find({ _id: { $in: toon.chapters } });
        let comments = await Comment.find({_id: { $in: toon.comments}});
        // res.json({toon, episodes, comments})
        res.render('item', {title: 'Twp webtoon',toon, episodes, comments}); 
    } catch (err) {
        res.render('404', {user: res.locals.user, title: '404 Page'})
    }
})

// update toonz
router.put('/sub/:id', authRoute, async (req, res) => {
    let toonId = req.params.id;
    let {id, type} = req.user
    const user = await User.findById(id);
    let toon = await Toonz.findById(toonId);
    if(!toon) return res.sendStatus(404);

    if(!user.subcriptions.includes(id)){
        await user.updateOne({$push: {subcriptions: id}})
        toon.subscription += 1;
        await toon.save();
        return res.status(200).json({M: 'subscribed', subs: toon.subscription})
    }

    await user.updateOne({$pull: {subcriptions: id}}); 
    if(toon.subscription > 0){
        toon.subscription -= 1
        await toon.save();
    };
    res.status(200).json({M: 'unsubcribed', subs: toon.subscription})
})

// delete toonz
router.delete('/:id', authRoute, async (req, res) => {
    const toonId = req.params.id
    const {id, type} = req.user
    if(!toonId) res.sendStatus(400);

    try {
        let toon = await Toonz.findById(toonId);
        if(!toon) res.status(404).send('webtoon not found');
        if(!type.includes('admin') && toon.uploadAcc !== id) res.status(401).send('this user can not delete this webtoonz');
        
        let eps = toon.chapters;
        eps.forEach(async (ep, index) => { await Episode.findByIdAndDelete(ep) });
        
        const coverLink = toon.coverImage 
        let stringArr = coverLink.split('/').slice(3, 5)
        let joinPath = `/${stringArr[0]}/${stringArr[1]}`

        deleteFileFromFtp(joinPath)
        await toon.deleteOne({fileCode: toon.fileCode}) 
        res.status(200).send('Webtoonz has been deleted')
 
    } catch (err) {
        res.status(500).send(err.message)
    }
})

router.post('/comment', async (req,res) => {
    const {seriesId, userId, username, comment} = req.body;
    
    try {
        if(!seriesId) res.status(400).json({E: "An error occured try refreshing the page and try again"});
        
        let createComment = await Comment.create({userId, username, comment});
        const toon = await Toonz.findById(seriesId)
        if(!toon) res.sendStatus(404)
        await toon.updateOne({$push: {comments: createComment.id}})
        const toons = await Toonz.findById(seriesId);
        let commentz = await Comment.find({_id: {$in: toons.comments}});

        res.status(200).json({commentz, M: 'success'})
    } catch (err) {
        console.log(err);
        res.status(500).json({E: err.message});  
    }
});

router.delete('/comment/:id', authRoute, async (req,res) => {
    const commentId = req.params.id;
    const { seriesId } = req.query
    const { id, type} = req.user;
    
    try {
        if(!seriesId) res.status(400).json({E: "Invalid request"});
        
        // delete the comment
        let createComment = await Comment.findByIdAndDelete(commentId);

        // remove the comment from its toon
        const toon = await Toonz.findById(seriesId)
        if(!toon) res.sendStatus(404)
        await toon.updateOne({$pull: {comments: commentId}})

        // fetch all the comment
        const toons = await Toonz.findById(seriesId);
        let commentz = await Comment.find({_id: {$in: toons.comments}});

        res.status(200).json({commentz, M: 'success'})
    } catch (err) {
        res.status(500).json({E: err.message});  
    }
})


/****************** episodes routes *********************/ 
router.get('/episode/upload', authPage, (req, res) => {
    res.render('userEpisodeForm', {title: 'Episode Upload'})
})

// get an episode
router.get('/episode/:id', async (req,res) => {
    let id = req.params.id;
    try {
        const ep = await Episode.findById(id);
        let toon = await Toonz.findOne({chapters: id});
        if(!toon || !ep) throw new Error('file is missing')
        res.render('read', {title: 'Read', pg: ep.pages, toon}); 
        
    } catch (err) {
        res.render('404', {user: res.locals.user, title: '404 Page'})
    }
})

router.post('/episode', authRoute, async (req, res) => {
    let {seriesid, eptitle} = req.body;
    if(!req.files) res.status(400).json({E: 'Please add a cover image and at least 4 pages'});
    let releaseDate = new Date().toDateString();
    let toon = await Toonz.findById(seriesid);
    if(!toon) res.status(404).json({E: 'not webtoon with this id please consider reuploading'})
    let {title, status, fileCode, twporiginal} = toon;
    const filename = `${title}-${fileCode}`;
     
    try {
        let findDuplicate = await Episode.findOne({title: eptitle, _id: { $in: toon.chapters }});
        if(findDuplicate) res.status(400).json({E: 'you already have an episode with this name'});
        
        let ep = await Episode.create({
            title: eptitle,
            releaseDate,
            twporiginal,
            isToonVerified: (status === 'approved') ? true : false 
        });

        const uploads = await uploadEp(req.files,filename,eptitle,res);
        if(!uploads) throw new Error("error occured while uploading this episode pls try again");
        
        await ep.updateOne({coverImage: uploads.coverImage, pages: uploads.pages })
        await toon.updateOne({$push: {chapters: ep.id}})

        if(toon.status === 'pending') {res.status(200).json({M: `Episode uploaded successfully!!🎉🎉. \n Thank You For uploading Your Webtoon. Your webtoon is under review, Please note that this may take up to 3 to 4 working days and You will be notified if it is approved`})}
        else{ res.status(200).json({M: 'Episode uploaded successfully!!🎉🎉'}) }

    } catch (err) {
        console.log(err);
        // res.status(500).json({E: err.message});
    }
})

router.delete('/episode/:id', authRoute, async (req, res) => {
    const epId = req.params.id;
    const { id, type} = req.user

    try {
        if(!epId) return res.sendStatus(400);
        
        let ep = await Episode.findById(epId);
        if(!ep) return res.status(404).send('episode not found')
        const toon = await Toonz.findOne({ chapters: epId });
        if(toon.uploadAcc !== id && type === 'regular'|| ep.twporiginal && type === 'regular') 
            return res.status(403).send('You account cant perform this action');

        dltEp(ep)
        await ep.deleteOne(); 
        await toon.updateOne({$pull: {chapters: epId}});
        res.status(200).send('episode has been deleted') 
    } catch (err) {
        res.status(500).send(err.message)
    }
});


export default router