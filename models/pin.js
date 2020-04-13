import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const pinModel = new Schema({
    adminId: {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    voter_name: {
        type: String,
        required: true  
    },
    voter_pin: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0
    }
})

export default mongoose.model('pin', pinModel);