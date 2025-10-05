import { Schema, model } from "mongoose";

const newToonz = new Schema({
    title:{
        type: String,
        required: [true, 'Webtoonz must have a title']
    },
    description:{
        type: String,
        required: [true, 'Webtoonz must have a description']
    },
    author:{
        type: String,
        required: [true, 'Webtoonz must have an author']
    },
    subscription:{
        type: Number,
        default: 0,
    },
    likes:{
        type: Number,
        default: 0,
    },
    likesArray:{
        type: Array
    },
    genre:{
        type: String
    },
    chapters:{
        type: Array,
        ref: 'episode'
    },
    releaseDate:{
        type: String
    },
    illustrator:{
        type: String
    },
    coverImage:{
        type: String
    },
    fileCode:{
        type: String
    },
    uploadAcc:{
        type: String
    },
    uploader:{
        type: String,
        enum: ['admin', 'regular']
    },
    status: {
        type: String,
        enum: ['approved', 'rejected', 'pending']
    },
    twporiginal:{
        type: Boolean
    },
    comments: {
        type: Array,
        ref: 'comment'
    }
});


const Toonz = model('webtoon', newToonz);
export default Toonz;