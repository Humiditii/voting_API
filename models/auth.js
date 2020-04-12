import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const authModel = new Schema({
    email: {
        type:String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    phone: {
        type:Number,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    }
});


export const AuthModel = mongoose.model('auth', authModel);


