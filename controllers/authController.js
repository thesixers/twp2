import User from '../model/users.js';
import { calculateAge, createJwt, errHandler, generateOTP } from '../middlewares/tokencheckers.js';
import { otpMail, sendEmails } from '../middlewares/mailSender.js';
import OTP from '../model/otp.js';

export const login_get = (req,res) =>{ res.render('login', {title: 'Login', description: "twps login page "}) }

export const signup_get = (req,res) =>{ res.render('signup', {title: 'Signup', description: "twps signup page "}) }

export const forgotpassword_get = (req,res)=> { res.render('passemail') }

export const otpverify_get = (req,res)=> { res.render('otp') }

export const resetpassword_get = (req,res)=> { res.render('resetpassword') }

export const emailverify_get = async (req,res) =>{ 
    let id = req.params.id;
 
    try {
        let user = await User.findById(id);
        await user.updateOne({verifyStatus: true})
        res.render('verifypage' ,{M: 'Your account has been verified', title: 'verification page'})
    } catch (err) {
        console.log(err);
    }
}

export const logout = (req,res)=>{
    res.cookie('twpAccount', '', {httpOnly: true, maxAge: 1});
    res.redirect('/twp')
}

export const signup_post = async (req,res) =>{
    let {password, name, email, dob} = req.body;
    let [age, month] = calculateAge(dob);

    if(age < 14){
        res.status(400).json({E: 'Users have to be 14yrs and above'})
    }

    try{
        const user = await User.create({password: password.trim(), name: name.trim(), email: email.trim(), dob}); 
        sendEmails(user); 
        res.status(200).json({M: 'Your account has been created, \n you have 24hrs to verify your email check your email for the link'})
    }
    catch(err){
        let errs = errHandler(err)
        let { name, email, password } = errs
        let message = name ? name : email ? email : password;
        res.status(400).json({E: message })
    }
    
}

export const login_post = async (req,res) =>{
    let {email,password} = req.body;
    
    try {
        let user  = await User.login({email,password});
        const id = user.id;
        
        const token = createJwt(id);
        const time = 1 * 24 * 60 * 60 * 1000;
        res.cookie('twpAccount', token, {httpOnly: true, maxAge: time})
        res.status(200).json({M: 'Login Successful !!!'})  
    } catch (err) {
        let errors = errHandler(err);
        if(errors.email) res.status(500).json({E: errors.email});
        if(errors.password) res.status(500).json({E: errors.password});
    }
}

export const forgotpassword_post = async (req,res) =>{
    let {email} = req.body;

    email = email.trim();
    if(email === '') res.json({E:'Please enter an email to help us find your Account'})

    try{

        let user = await User.findOne({email});
        if(!user) res.json({E:'No account with this email'});
        let otp = generateOTP();
        let otptime = new Date(Date.now() + 10 * 60 * 1000);
        let createOtp = await OTP.create({email, otpcode: otp, otptime});
        otpMail(user, otp);
        res.json({M:'Otp has been sent to Your email', id: user.id})
    }
    catch(err){
        console.log(err.message);
        res.json({E:'Oops! Error occured pls resend'})
    }
}

export const otp_post = async (req,res) =>{
    let {otp,id} = req.body;
    let currentTime = new Date(Date.now());

    try { 
        let user = await User.findById(id);
        if(!user) throw Error('invalid user');
        let email = user.email;
        
        let otp$ = await OTP.findOne({email});
        if(!otp) throw Error('OTP not found please request for another');

        if(otp !== otp$.otpcode) throw Error('Incorrect OTP please check the otp that was entered');
        
        
        if(otp$.otptime < currentTime){
            await OTP.deleteOne({email});
            throw Error('OTP has exired please for another one with the resend btn')
        };

        res.json({M:'Otp Confirmed'})
        
    } catch (err) {
        res.status(400).json({E: err.message})
    } 
}

export const resetpassword_post = async (req,res) =>{
    let {password, id} = req.body;

    try{

        let user = await User.findById(id);

        if(!user) throw Error('invalid user');

        let otp = await OTP.findOne({email: user.email});

        if(!otp) throw Error('invalid user');

        user.password = password;

        await user.save();

        await OTP.deleteOne({email: user.email})

        res.json({M:'Password changed'})
    }
    catch(err){
        res.status(500).json({E: err.message})
    }
}