import SetupModel from '../models/setupVote';
import PinModel from '../models/pin';
import { randomBytes } from 'crypto'
import Catch from '../middleware/catchBlock';
import { isNullOrUndefined } from 'util';

export class GetSetupVote {
    constructor(){
        this.getFirstPage;
    }

    getFirstPage(req, res, next){
        return res.status(200).json({
            message: 'Welcome set up votes'
        });
    }
}

/**
 * THis class helps to setup the vote categories
 * and the options of each post to be voted for
 */

export class PostVoteSetup {
    constructor(){
        this.postVote;
    }

   async postVote(req, res, next){
        let VoteSetObject = {
            position: req.body.position,
            options: req. body.options
        }

        
    if( typeof VoteSetObject.options == 'string' ){
        const Candidates = VoteSetObject.options.split(' ');
        const voteCounts = [];
        for (let index = 0; index < Candidates.length; index++) {
            voteCounts.push(0)
            
        }
        VoteSetObject.options =[ {...Candidates},
                                { ...voteCounts} ]
        
    }

    console.log(VoteSetObject.options)
    const newSetup = new SetupModel();
    newSetup.adminId = req.userId;

    const newPost = {
        position: VoteSetObject.position,
        options: VoteSetObject.options
    }

    


    /** The Getdocumet const receives an object from an async
     * function and return null to the constant if the promise
     * founds no object
     */

    const GetDocument = await SetupModel.findOne({adminId:req.userId }) || null;
    /**
     * If no object is passed the GetDocument const the
     *  new Document would be created in the database
     */
    if (GetDocument == null) {
        newSetup.optionPost.push(newPost);

        newSetup.save().then( result => {
            return res.status(201).json({
                message: 'Voting platform configured successfully, can continue to add more', 
                data: result
            })
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
           
        })
        
    }else{

       // console.log([...GetDocument.optionPost])

        /** This block of codes take the GetDocument value and extract the
         * optionpost from the result object then push the new object field 
         * to the object and save
         */

        GetDocument.optionPost.push(VoteSetObject)
        
        GetDocument.save().then( result => {
            return res.status(201).json({
                message: 'New field added successfully',
                data: result
            })
        }).catch( err => {
            // if(!err.statusCode){
            //     err.statusCode = 500;
            // }
            // next(err);
            Catch( err, next)
        })

    }

    // SetupModel.find({adminId : req.userId }).then(result => {
    //     result.forEach(element => {
    //         console.log(element.optionPost)
    //         element.optionPost.forEach(item => {
    //             console.log(item.options, item.position )
    //         });
    //     });

    // }).catch( err => {
    //     if(err.statusCode){
    //         err.statusCode = 500;
    //     }
    //     next(err);
    // })

    // newSetup.optionPost.push(newPost);

    // newSetup.save().then( result => {
    //     return res.status(201).json({
    //         message: 'Voting platform configured successfully, can continue to add more', 
    //         data: result
    //     })
    // }).catch( err => {
    //     if(!err.statusCode){
    //         err.statusCode = 500;
    //     }
    //     next(err)
    // })
    

        //console.log(VoteSetObject)

    }
}

/**  THis class allows authenticated admin to 
 * set pin for a particular voter with the voter's name 
 * Admin needs to receive the request body votername to be able to generate pin for the user */

export class postPinGeneration {
    constructor(){
        this.setPin
    }

    setPin(req, res, next){
        const voterDetails = {
            votername: req.body.votername,
            voterpin: randomBytes(5).toString('hex')
        }

        const initPinModel = new PinModel();
        initPinModel.adminId = req.userId;
        initPinModel.voter_name = voterDetails.votername;
        initPinModel.voter_pin = voterDetails.voterpin;

        initPinModel.save().then( result => {
            return res.status(201).json({
                message: 'Voting pin created for the ' + result.voter_name,
                data: result
            })

        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    }
}


export class GetGeneratedPin{
    constructor(){
        this.getpins;
    }
    getpins( req, res, next){
        const reqAdminId = req.userId;
        
        PinModel.find({adminId: reqAdminId}).then( generatedPIns => {

            if(!generatedPIns){
                return res.status(404).json({
                    message: 'sorry, NO Pins generated yet, proceed to Pin generation!!!'
                });
            }else{
                const lists = [...generatedPIns]
                const pinArray = []
                lists.forEach(element => {
                    const userpin = {
                        voterPin: element.voter_pin,
                        voterName: element.voter_name
                    }
                    pinArray.push(userpin);
                    
                });
                //console.log(pinArray)
                return res.status(200).json({
                    message: 'These are the lists of generated pins by you',
                    data: [...pinArray]
                })
            }
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err)
        });
    }
}

export class ViewVote {
    constructor(){
        this.view;
    }
    view( req, res, next){
        const reqAdminId = req.userId;
        SetupModel.findOne({adminId:reqAdminId}).then( setupVotesDocuments => {
           return res.status(200).json({
                data: setupVotesDocuments.optionPost
            })
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

    }
}

export class EditVoteModel {
    constructor(){
        this.editVote;
    }

    editVote( req, res, next){

        const editObject = {
            option: req.body.option,
            position: req.body.position 
        }

        const reqAdminId = req.userId;
        SetupModel.findOne({adminId: reqAdminId}).then( result =>{   
            // dbPosition = result.optionPost[0].position;
            // dbOption = result.optionPost[0].options;
            
            const { option, position } = editObject;
            result.optionPost[0].position = position;
            result.optionPost[0].options = option;

            result.save().then( editedSaveDocument => {
                return res.status(201).json({
                    data: editedSaveDocument
                })
            }).catch( err => {
                if(!err.statusCode){
                    err.statusCode = 500
                }
                next(err);
            })
            // console.log(editObject)
            // console.log( result.optionPost[0].options, result.optionPost[0].position )

        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

    }
}

