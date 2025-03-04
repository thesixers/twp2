import jwt from 'jsonwebtoken';
import User from '../model/users.js';
import uploadFileToFtp, { deleteFileFromFtp } from './ftpupload.js';

let { JWT_SECRET } = process.env;

export const createJwt = (id) => {
    const time = 1 * 24 * 60 * 60;
    return jwt.sign({id}, JWT_SECRET, {expiresIn: time});
}

export const errHandler = (err) => {
    let errs = { name: '', email: '', password: ''};

    if(err.code === 11000){
        if(err.message.includes('email_1 dup key')) errs.email = 'This email is already linked to an account';
    }

    if(err.message.includes('twpUser validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errs[properties.path] = properties.message
        })
    }

    if(err.message === 'Please enter your email') errs.email = err.message;

    if(err.message === 'there is no user with this email') errs.email = err.message;

    if(err.message === 'Please enter your password') errs.password = err.message;
    
    if(err.message === 'incorrect password') errs.password = err.message;

    if(err.message === 'Email not verified please check your email for your verification link') errs.email = err.message;

    if(err.message === 'Your Account has been banned') errs.email = err.message;

    return errs
} 

export function generateOTP() {
    const min = 10000;
    const max = 99999; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function localSeriesUpload(file,title){
    const values = { url: '', code: '' };
    let unique = generateOTP();
    values.code = unique;

    let mimetype = file?.mimetype?.split('/')[1];

    const remotePath = `/webtoonz/${title}-${unique}`;
    let path = await uploadFileToFtp(file, remotePath, `coverImage.${mimetype}`);
    if(path.includes('Error uploading file to FTP server')) throw new Error("file upload failed pls retry");
    values.url = path;

    return values;
}

export async function uploadEp(files,filename,eptitle,res){
    const  uploads = {coverImage: '', pages: []}
    let epFolder =  `/webtoonz/${filename}/${eptitle}`; 

    let epCoverImg = files['epcover']
    if(!epCoverImg) res.status(400).json({E: 'Episode must have a cover image'});
    let mimetype = epCoverImg.mimetype.split('/')[1];

    let epPages = Object.entries(files)
    .filter(([key]) => key.includes('page') )
    .map(([_,value]) => value)
    .forEach((page, index) => {
        const mimetype = page.mimetype.split('/')[1];
        const pgFolder =  `/webtoonz/${filename}/${eptitle}/pages`;
        uploads.pages.push({url: `${pgFolder}/pg${index + 1}.${mimetype}`, temp: page.tempFilePath});
    });
    if(epPages.length < 3) res.status(400).json({E: 'Episode must have aleast 3 pages'});

    uploads.coverImage = await uploadFileToFtp(epCoverImg, epFolder, `coverImage.${mimetype}`)
    if(uploads['coverImage'].toString().includes('Error')) res.status(500).json({E: 'file upload failed pls retry'});

    uploads.pages = await uploadFileToFtp('', `${epFolder}/pages`, uploads.pages)
    if(uploads["pages"].includes('Error uploading file to FTP server')) res.status(500).json({E: 'file upload failed pls retry'});
    return uploads;
}

export async function dltEp(ep){
    const coverLink = ep.coverImage
    let stringArr = coverLink.split('/').slice(3, 6)
    let joinPath = `/${stringArr[0]}/${stringArr[1]}/${stringArr[2]}`

   await deleteFileFromFtp(joinPath)
}

export function tokenChecker(req,res,next){
    let token = req.cookies.twpAccount;
    if(!token){
      return res.locals.user = {};
    };
    if(token){
        jwt.verify(token,JWT_SECRET, async (err, decodedToken) => {
            if(err){
                res.locals.user = null;
                console.log(err);
                next()
            }else{
                let user = await User.findById(decodedToken.id);
                
                res.locals.user =  user ? user : null;
               next()
            }
        });
    } 
}

export function calculateAge(dob){
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth() + 1;
    let currentDate = new Date().getDate();
    let year = dob.split('-')[0];
    let month = dob.split('-')[1];
    let date = dob.split('-')[2]

    let age = currentYear - year;
    let months = 0;

    if(year >= currentYear) return[age, months];

    if(currentMonth < month || currentMonth === month && currentDate < date) age -= 1;

       let calcMonth = currentMonth - month

       months = calcMonth < 0 ? 12 + calcMonth : 12 - calcMonth;

    return [age, months];
}

/*this is a fresh script for the new twp server middleware*/
export function authRoute(req,res,next){
    let token = req.cookies.twpAccount
    if(!token) return res.sendStatus(403);

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if(err) return res.sendStatus(403);
        let user = await User.findById(decodedToken.id)
        if(user.status === 'banned'){
            res.cookie('twpAccount', '', {httpOnly: true, maxAge: 1});
            return res.status(403).json({E: 'ur account has been banned'})
        }
        req.user = {id: user.id, type: user.type}
        next()
    })
}

export function authPage(req,res,next){
    let token = req.cookies.twpAccount
    if(!token) return res.redirect('/twp');

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if(err) return res.redirect('/twp');
        let user = await User.findById(decodedToken.id)
        if(user.status === 'banned'){
            res.cookie('twpAccount', '', {httpOnly: true, maxAge: 1});
            res.redirect('/twp')
            return
        }
        req.user = user 
        next()
    })
}