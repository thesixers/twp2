import { model, Schema } from "mongoose";

const newEpisode = new Schema({
    title:{
        type: String,
        required: [true, 'please every episode must have a title']
    },
    coverImage:{
        type: String,
    },
    pages:{
        type: Array
    },
    releaseDate: {
        type: String
    },
    likes:{
        type: Number,
        default: 0
    },
    twporiginal:{
        type: Boolean
    },
    isToonVerified:{
        type: Boolean
    }
})

const Episode = model('episode', newEpisode);
export default Episode;