import jwt from 'jsonwebtoken';
import User from '../model/users.js';
import env from 'dotenv';
import fs from 'fs';
import path from 'path';
import Toonz from '../model/webtoonz.js';
import ftp from "basic-ftp"
import uploadFileToFtp, { deleteFileFromFtp } from './ftpupload.js';

env.config();

let {JWT_SECRET} = process.env;


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
    const filesArray = Object.values(files);
    let epCoverImg = filesArray.slice(0,1);
    let epPages = filesArray.slice(1);
    if(!epCoverImg || epCoverImg === 0) res.status(400).json({E: 'Episode must have aleast 4 pages'});
    if(!epPages || epPages > 4) res.status(400).json({E: 'Episode must have aleast 4 pages'});
    let mimetype = epCoverImg[0].mimetype.split('/')[1];
    
    let epFolder =  `/webtoonz/${filename}/${eptitle}`; 

    let coverUrl = await uploadFileToFtp(epCoverImg[0], epFolder, `coverImage.${mimetype}`)

    if(coverUrl.includes('Error uploading file to FTP server')) res.status(500).json({E: 'file upload failed pls retry'});

    uploads.coverImage = coverUrl;
    for(const page of epPages) {
        let index = epPages.indexOf(page)
        const mimetype = page.mimetype.split('/')[1];
        const pgFolder =  `/webtoonz/${filename}/${eptitle}/pages`;
    
        uploads.pages.push({url: `${pgFolder}/pg${index + 1}.${mimetype}`, temp: page.tempFilePath});
    }
    
    let pageUrlArr = await uploadFileToFtp('', `${epFolder}/pages`, uploads.pages)
    if(pageUrlArr.includes('Error uploading file to FTP server')) res.status(500).json({E: 'file upload failed pls retry'});
    uploads.pages = pageUrlArr
    return uploads;
}

export async function dltEp(ep){
    const coverLink = ep.coverImage
    let stringArr = coverLink.split('/').slice(3, 6)
    let joinPath = `/${stringArr[0]}/${stringArr[1]}/${stringArr[2]}`

   await deleteFileFromFtp(path)
}

export async function checkAccont(req,res){
    let token = req.cookies.twpAccount;
    let u = {id: '', type: ''}
    if(!token) return false;

    let decodedToken = await jwt.verify(token,JWT_SECRET);
    if(!decodedToken) return false;

    let user = await User.findById(decodedToken.id);
        if(user.status === 'banned' || user.status === 'disabled') return false;
        if(user.type === 'admin1' || user.type === 'admin2'){
            u.id = user.id;
            u.type = 'admin';
        };
        if(user.type === 'regular'){
            u.id = user.id;
            u.type = 'regular';
        };

        return u
}

export function tokenChecker(req,res,next){
    let token = req.cookies.twpAccount;
    if(!token){
        res.locals.user = null;
        next()
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
 
export function pageAuth(req,res,next){
    let token = req.cookies.twpAccount;
    if(!token){
        res.redirect('/twp');
        next()
    };
    if(token){
        jwt.verify(token,JWT_SECRET, async (err, decodedToken) => {
            if(err){
                res.redirect('/twp');
                next()
            }else{
                let user = await User.findById(decodedToken.id);
                if(!user) res.redirect('/twp');
               next()
            }
        });
    } 
}

export function routeAuth(req,res,next){
    let token = req.cookies.twpAccount;
    if(!token){
        res.status(400).send('u dont acces to this functionality');
    };
    if(token){
        jwt.verify(token,JWT_SECRET, async (err, decodedToken) => {
            if(err){
                res.status(400).send('u dont acces to this functionality');
            }
            next()
        });
    } 
}

export function authenticateAdmin(req,res,next){
    let token = req.cookies.twpAccount;
    if(!token){
        return res.redirect('/twp/auth/login')
    }

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if(err) {
           return res.redirect('/twp/auth/login')
        }
        let user = await User.findById(decodedToken.id);

        if(user === null) return res.redirect('/twp/auth/login')

        if(user?.type === 'regular') return res.redirect('/twp/auth/login')
    })

    next()
}

export function authAuthor(req,res, next){
    let token = req.cookies.twpAccount;
    if(!token) return res.redirect('/twp');

    jwt.verify(token, JWT_SECRET, async (err, decodedToken) => {
        if(err) return res.redirect('/twp');

        let user = await User.findById(decodedToken.id)
        if(!user) return res.redirect('/twp');
        let toonz = await Toonz.find({uploadAcc: decodedToken.id})
        toonz = toonz ? toonz : null;

        if(!user.isAuthor) return res.redirect('/twp');

        res.locals.author = {toonz};
        next()
    })
    return;
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