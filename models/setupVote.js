import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const setupVoteMOdel = new Schema({

    adminId : {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },

    electionName: {
        type: String,
        required: true
    },

    election: {
        required: true,
        type: Object
    },
    
    // optionPost: [
    //         {   vote_name:{
    //             type: String,
    //             required: true
    //         } ,
    //             position: {
    //                 type: String, 
    //                 required: true
    //             }, 
    //             options: {
    //                 type: Object,        
    //                 required: true
    //             }
    //         } 
    //     ]
});

export default mongoose.model('VoteSetup', setupVoteMOdel);