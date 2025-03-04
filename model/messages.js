import { model, Schema } from "mongoose";

const newMessage = new Schema({
    name:{
        type: String, 
    },
    email:{
        type: String,
    },
    message:{
        type: String,
    },
    status:{
        type: String,
        enum: ['replied', 'unreplied'],
        default: 'unreplied'
    },
    response:{
        type: String,
    },
    createdAt: {
        type: String
    }
     
})

const Message = model('message', newMessage);
export default Message; 