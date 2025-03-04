import { Schema, model } from "mongoose";
import { isEmail, isName, isPassword } from "../middlewares/formcheckers.js";
import bcrypt from 'bcrypt'

const newOTP = new Schema({
    email:{
        type: String
    },
    otpcode:{
        type: String
    },
    otptime:{
        type: Date,
    }
});

   

const OTP = model('twpOTP', newOTP);
      
export default OTP;     