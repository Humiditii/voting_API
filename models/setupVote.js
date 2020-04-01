import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const setupVoteMOdel = new Schema({

    adminId : {
        type: Schema.Types.ObjectId,
        ref: 'auth',
        required: true
    },
    
    optionPost: [
            { 
                position: {
                    type: String, 
                    required: true
                }, 
                options: {
                    type: String,        
                    required: true
                } 
            } 
        ]
});

export default mongoose.model('VoteSetup', setupVoteMOdel);