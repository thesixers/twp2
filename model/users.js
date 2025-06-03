import { Schema, model } from "mongoose";
import { isEmail, isName, isPassword } from "../middlewares/formcheckers.js";
import bcrypt from 'bcrypt'
import { sendEmails } from "../middlewares/mailSender.js";

const newTwpUser = new Schema({
    name: {
        type: String,
        required: [true, 'Your full name is required'],
        validate: [isName, 'You must enter at least two names']
    },
    password:{
        type: String,
        required: [true, 'Your password is required'],      
        validate: [isPassword], 
    },
    email: {
        type: String,
        required: [true, 'Your email is required'], 
        lowercase: true,
        validate: [isEmail, 'This email is not a valid email format'],
        unique: [true, 'This email is already linked an account'],
    }, 
    picture:{
        type: String,
    },
    type:{
        type: String,
        enum: [, 'admin1', 'regular', 'admin2'],
        default: 'regular'
    },
    favourites: {
        type: Array,
    },
    status:{
        type: String, 
        enum: ['disabled', 'banned','active'],
        default: 'active'
    },
    verifyStatus: {
        type: Boolean,
        default: false
    },
    isAuthor:{
        type: Boolean,
        default: false
    },
    subcriptions:{
        type: Array
    },
    otpcode:{
        type: String
    },
    otptime:{
        type: Date,
    },
    dob:{
        type: String
    },
    likesArray: Array
});


newTwpUser.pre('save',  async function(next){
    let salt = await bcrypt.genSalt();
    this.password = await  bcrypt.hash(this.password, salt); 
    next();
})


newTwpUser.statics.login = async function({email,password}){
   
    if(email === '') throw Error('Please enter your email');

    let user = await User.findOne({email});

    if(!user)  throw Error('there is no user with this email');

    if(!user.verifyStatus){
        sendEmails(user);
        throw Error('Email not verified please check your email for your verification link')
    };

    if(user.status === 'banned') throw Error('Your Account has been banned');

    if(password === '') throw Error('Please enter your password');

    let userPassword = user.password;

    let isMatch = await bcrypt.compare(password, userPassword);

    if(!isMatch) throw Error('incorrect password');  
 
    return user
}
   

const User = model('twpUser', newTwpUser);
      
export default User;     