import { model, Schema } from "mongoose";

const newComment = new Schema({
    userId:{
        type: String,
        
    },
    username:{
        type: String,
    },
    comment:{
        type: String,
    },
    releaseDate: {
        type: String
    }
     
})

const Comment = model('comment', newComment);
export default Comment;