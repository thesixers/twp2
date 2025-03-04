import {mongoose, model, Schema} from "mongoose";

const new_Scripture = new Schema({
    book:{ type: String, required: [true, 'Please enter a book in the bible']},
    word: { type: String, required:[true, 'The word field is empty']}
});

const Scripture = model('twp_scripture', new_Scripture);
export default Scripture