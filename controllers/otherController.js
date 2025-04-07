import Toonz from '../model/webtoonz.js';
import Episode from '../model/episode.js';
import Scripture from '../model/scripture.js';
import Message from '../model/messages.js'

export const slash_get = (req,res) => res.redirect('/twp/home')

export const home_get = async (req,res)=>{
    let scripture = await Scripture.find();
    let toonz = await Toonz.find({status: 'approved'});
    toonz = toonz.reverse().slice(0,6);
    let eps = await Episode.find({isToonVerified: true});
    eps = eps.reverse().slice(0,6);
    res.render('landing',{
        title: "Home", 
        toonz, 
        eps, 
        scripture, 
        description: "Explore a vast collection of engaging webtoons on The Webtoon Project. Immerse yourself in captivating stories and unique artwork. Start reading now!"
    }); 
}

// export const home_get = async (req,res)=>{
//     let scripture = await Scripture.find();
//     let toonz = await Toonz.find({status: 'approved'});
//     toonz = toonz.reverse().slice(0,6);
//     let eps = await Episode.find({isToonVerified: true});
//     eps = eps.reverse().slice(0,6);
//     res.render('landing',{
//         title: "Home", 
//         toonz, 
//         eps, 
//         scripture, 
//         description: "Explore a vast collection of engaging webtoons on The Webtoon Project. Immerse yourself in captivating stories and unique artwork. Start reading now!"
//     });
// }

export const aboutus_get = async (req,res) => {
    res.render('aboutus', 
        {
            title: "About us", 
            description: "TWP is a global media brand built to create a platform for Christian webtoon creators to express their talents to the world while entertaining and inspiring webtoon fans at little or no cost."
        })
}

export const author_get = async (req,res)=> {
    if(!req.user.isAuthor) return res.redirect('/twp')
    let toonz = await Toonz.find({uploadAcc: req.user.id})
    res.render('author', { toonz, description: "The twp authors page"})
}

function formatDate(date) {
    const options = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export const complaint_post = async (req,res) => {
    const {name, email, message} = req.body;
    let date = new Date();
    let createdAt = formatDate(date)

    try {
        let createMessage = await Message.create({name, email, message, createdAt})
        res.status(200).json({M: 'Message sent'})
    } catch (err) {
        console.log(err.message);
        res.status(500).json({E: err.message})
    }
}