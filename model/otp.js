import { Schema, model } from "mongoose";

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