import Toonz from '../model/webtoonz.js';
import User from '../model/users.js';
import { Emails, sendReply } from '../middlewares/mailSender.js';
import Message from '../model/messages.js';
import Episode from '../model/episode.js';
import Scripture from '../model/scripture.js';

export const home_get = async (req,res)=>{
    if(!req.user.type.includes('admin')) return res.redirect('/twp');
    let toonz = await Toonz.find();
    let users = await User.find();
    let messages = await Message.find();
    res.json({toonz, users, messages})
    // res.render('adminpanel', {toonz: toonz, users, title: 'Admin', messages}) 
}

export const RA_post = async (req, res) => {
    console.log("req came here");
    if(!req.user.type.includes('admin')) 
        return res.status(403).json({E: 'Your account can\'t perform this action'});
    let { status, id } = req.body;

    try {
        let toon = await Toonz.findById(id);
        await toon.updateOne({ status: status });

        let user = await User.findById(toon.uploadAcc);
        toon.chapters.forEach(async (epID) => {
            await Episode.findByIdAndUpdate(epID, {isToonVerified: (status === 'approved' ? true : false)});
        })

        let toons = await Toonz.find();
        if(status === 'approved'){
            await User.findByIdAndUpdate(toon.uploadAcc, {isAuthor: true});
            Emails(user, `Your webtoon titled ${toon.title} has been approved`);
        }else{
            Emails(user,`Your webtoon titled ${toon.title} was not approved `);
        }
        
        return res.status(200).json({ toons });
        
    } catch (err) {
        return res.status(500).json({ E: 'Error occurred performing action pls try it again' });
    }
}

export const BN_post = async (req,res) => {
    if(!req.user.type.includes('admin')) 
        return res.status(403).json({E: 'Your account can\'t perform this action'});
    const accId = req.params.id
    const { status } = req.query
    const { id, type } = req.user
    if(!type.includes('admin')) return res.sendStatus(403)

    try{
        let user = await User.findById(accId);
        if(user.type === 'admin1' || user.id === id) 
            return res.status(403).json({E: 'You can\'t perform this action on this account'});
        
        await user.updateOne({status});
        let userz = await User.find();
        status === 'active' ? 
        Emails(user, 'Your Account has been activated')
        :
        Emails(user, 'Your Account has been banned because u went againt our guidelines');

        res.status(200).json({ userz });
    }
    catch(err){
        return res.status(500).json({E: 'Error occured performing action'})
    }
}

export const mkAdmin_post = async (req,res) => {
    if(!req.user.type.includes('admin')) 
        return res.status(403).json({E: 'Your account can\'t perform this action'});
    const id = req.params.id;
    const type = req.query.type;
    if(!req.user.type.includes('admin1')) return res.status(403).json({E: 'You cant do this'})

    try{
        let user = await User.findById(id);

        if(user.type === 'admin1') return res.status(403).json({E: 'You can\'t perform this action on this account'});
    
        await user.updateOne({ type });

        let userz = await User.find();
        if(type === 'admin2'){
            Emails(user, 'Your Account type has been upgraded to Admin');
            return res.status(200).json({ userz, M: 'Account type updated to an Admin' });
        }
        Emails(user, 'Your Admin Status has been removed');
        return res.status(200).json({ userz, M: 'Admin status has been removed from Account' });
    }
    catch(err){
        return res.status(500).json({E: 'Error occured performing action'})
    }
}

export const scripture_post = async (req,res)=> {
    if(!req.user.type.includes('admin')) 
        return res.status(403).json({E: 'Your account can\'t perform this action'});
    const {book, word} = req.body;
    if(!req.user.type.includes('admin')) res.sendStatus(403)

    try {
        if(!book) throw Error("The Book field is empty");
        if(!word) throw Error("The Word field is empty");
        // check if the a scripture exists in the db;
        const scriptureList = await Scripture.find();
        if(scriptureList.length === 0) await Scripture.create({book, word});

        // if a scripture exist the update it
        if(scriptureList.length > 0) await scriptureList[0].updateOne({book, word});

        res.status(200).json({M: 'Scripture has been saved'})
    } catch (err) {
        res.status(400).json({E: err.message })
    }
}

export const adminsReply_post = async (req,res) => {
    if(!req.user.type.includes('admin')) 
        return res.status(403).json({E: 'Your account can\'t perform this action'});
    const {messageId, reply} = req.body;

    try{

        if(messageId && reply){
            let msg = await Message.findById(messageId)
            let {email, message, name} = msg;
            let user = {email, name, message};
            // console.log(user, reply);
            sendReply(user, reply);
            await msg.updateOne({status: 'replied'});
            let msgs = await Message.find();
            res.status(200).json({M: 'message sent 😁👌', msgs})
        }

    }
    catch(err){
        console.log(err.message);
        res.status(500).json({E: 'an error occured: '+ err.message})
    }
}