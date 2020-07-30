import SetupModel from '../models/setupVote';
import PinModel from '../models/pin';
import Util from '../utils/Utility';



class SetupController {
    static async voteConfig(req, res, next){

        const {userId, userRole} = req;

        console.log(userRole)

        if( userId && userRole ==='Admin'){
            /**
             * Blueprint
             * electionName = nammes Election;
             * Election = {
             *      position: 'Governor'
             *      options : ['Mr Ayo', 'Mr Ola', 'Mr Ade']
             *      count: [0,0,0]
             * }
             */
            const { voteName, options, position } = req.body;

            const checkVoteName = await SetupModel.find({electionName: voteName})
            
            try {
                
                if(checkVoteName.length >= 1 ){
                    const err = Object()
                    err.message = 'Election Name taken';
                    err.statusCode = 400;
                    return Util.appError(err, next)
                }else{
                        const Election = Object();

                        Election.position = position;

                        Election.options = options;

                        const countCandidates = []

                        for (const i of options) {
                            countCandidates.push(0)
                        }

                        Election.count = countCandidates;


                        const newElection = new SetupModel();
                        
                        
                        newElection.adminId = userId;
                        newElection.electionName = voteName;
                        newElection.election = Election;

                        newElection.save().then( saved => {
                            return res.status(201).json({
                                data: saved,
                                message: 'Election configured successfully',
                                statusCode: 201
                            })
                        }).catch( err => {
                            return Util.appError(err, next);
                        })
                    }    
            } catch (error) {
                return Util.appError(error, next)
            }
        }else{
            const Err = Object();
            Err.message = 'Not an Admin';
            Err.statusCode = 401;
            return Util.appError(Err, next)
        }


    }

    static async getSetups(req, res, next){
        const {userId} = req;

        const escavate = await SetupModel.find({adminId: userId});

        try {

            if(escavate.length == 0){
                return res.status(404).json({
                    message: 'No Election Found',
                    statusCode: 404
                });
            }else{
                return res.status(200).json({
                    data: escavate,
                    statusCode: 200
                })
            }
            
        } catch (error) {
            return Util.appError(error,next)
        }
    }


    static electionResult(req, res, next){
        const {userId, userRole} = req;

    }
}

// export class GetSetupVote {
//     constructor(){
//         this.getFirstPage;
//     }

//     getFirstPage(req, res, next){
//         const {userId} = req;
//         //console.log(userId)

//         SetupModel.find({adminId: userId}).then( result => {
//             PinModel.find({adminId : userId}).then( pinResult => {
//                 return res.status(200).json({
//                     data: {
//                         pin: pinResult,
//                         setup: result
//                     }
//                 })
//             }).catch( err => {
//                 if(!err.statusCode){
//                     err.statusCode = 500;
//                 }
//             })
//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//         })

//         // SetupModel.find({adminId : userId}).then( result => {
//         //     const summary = result.optionPost;
//         //     const length = summary.length;
//         //     PinModel.find({adminId : userId}).then( result => { 
//         //         const pinLength = result.voter_pin;
//         //         const dashboardData = {
//         //             votesNum: length,
//         //             activeVotes: summary,
//         //             pinNum: pinLength.length 
//         //         }
//         //         return res.status(200).json({
//         //             data: dashboardData
//         //         })
//         //     }).catch( err=>{
//         //         if(!err.statusCode){
                    
//         //             err.statusCode = 500;
//         //         }
//         //     });
//         // }).catch( err=> {
//         //     if(!err.statusCode){
//         //         err.statusCode = 500;
//         //     }
//         // })
//     }
// }

// /**
//  * THis class helps to setup the vote categories
//  * and the options of each post to be voted for
//  */

// export class PostVoteSetup {
//     constructor(){
//         this.postVote;
//     }

//    async postVote(req, res, next){
//         let VoteSetObject = {
//             position: req.body.position,
//             options: req. body.options,
//             votename: req.body.votename
//         }

        
//     if( typeof VoteSetObject.options == 'string' ){
//         const Candidates = VoteSetObject.options.split(' ');
//         const voteCounts = [];
//         for (let index = 0; index < Candidates.length; index++) {
//             voteCounts.push(0)
            
//         }
//         VoteSetObject.options =[ {...Candidates},
//                                 { ...voteCounts} ]
        
//     }

//     console.log(VoteSetObject.options)
//     const newSetup = new SetupModel();
//     newSetup.adminId = req.userId;

//     const newPost = {
//         position: VoteSetObject.position,
//         options: VoteSetObject.options,
//         vote_name: VoteSetObject.votename
//     }

    


//     /** The Getdocumet const receives an object from an async
//      * function and return null to the constant if the promise
//      * founds no object
//      */

//     const GetDocument = await SetupModel.findOne({adminId:req.userId }) || null;
//     /**
//      * If no object is passed the GetDocument const the
//      *  new Document would be created in the database
//      */
//     if (GetDocument == null) {
//         newSetup.optionPost.push(newPost);

//         newSetup.save().then( result => {
//             return res.status(201).json({
//                 message: 'Voting platform configured successfully, can continue to add more', 
//                 data: result
//             })
//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err)
           
//         })
        
//     }else{

//         /** This block of codes take the GetDocument value and extract the
//          * optionpost from the result object then push the new object field 
//          * to the object and save
//          */

//         GetDocument.optionPost.push(VoteSetObject)
        
//         GetDocument.save().then( result => {
//             return res.status(201).json({
//                 message: 'New field added successfully',
//                 data: result
//             })
//         }).catch( err => {
            
//             Catch( err, next)
//         })

//     }


//     }
// }

// /**  THis class allows authenticated admin to 
//  * set pin for a particular voter with the voter's name 
//  * Admin needs to receive the request body votername to be able to generate pin for the user */

// export class postPinGeneration {
//     constructor(){
//         this.setPin
//     }

//     setPin(req, res, next){
//         const voterDetails = {
//             votername: req.body.votername,
//             voterpin: randomBytes(5).toString('hex')
//         }

//         const initPinModel = new PinModel();
//         initPinModel.adminId = req.userId;
//         initPinModel.voter_name = voterDetails.votername;
//         initPinModel.voter_pin = voterDetails.voterpin;

//         initPinModel.save().then( result => {
//             return res.status(201).json({
//                 message: 'Voting pin created for the ' + result.voter_name,
//                 data: result
//             })

//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//         })
//     }
// }


// export class GetGeneratedPin{
//     constructor(){
//         this.getpins;
//     }
//     getpins( req, res, next){
//         const reqAdminId = req.userId;
        
//         PinModel.find({adminId: reqAdminId}).then( generatedPIns => {

//             if(!generatedPIns){
//                 return res.status(404).json({
//                     message: 'sorry, NO Pins generated yet, proceed to Pin generation!!!'
//                 });
//             }else{
//                 const lists = [...generatedPIns]
//                 const pinArray = []
//                 lists.forEach(element => {
//                     const userpin = {
//                         voterPin: element.voter_pin,
//                         voterName: element.voter_name,
//                         status: element.status
//                     }
//                     pinArray.push(userpin);
                    
//                 });
//                 //console.log(pinArray)
//                 return res.status(200).json({
//                     message: 'These are the lists of generated pins by you',
//                     data: [...pinArray]
//                 })
//             }
//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err)
//         });
//     }
// }

// export class ViewVote {
//     constructor(){
//         this.view;
//     }
//     view( req, res, next){
//         const reqAdminId = req.userId;
//         SetupModel.findOne({adminId:reqAdminId}).then( setupVotesDocuments => {
//            return res.status(200).json({
//                 data: setupVotesDocuments.optionPost
//             })
//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//         })

//     }
// }

// export class EditVoteModel {
//     constructor(){
//         this.editVote;
//     }

//     editVote( req, res, next){

//         const editObject = {
//             option: req.body.option,
//             position: req.body.position 
//         }

//         const reqAdminId = req.userId;
//         SetupModel.findOne({adminId: reqAdminId}).then( result =>{   
//             // dbPosition = result.optionPost[0].position;
//             // dbOption = result.optionPost[0].options;
            
//             const { option, position } = editObject;
//             result.optionPost[0].position = position;
//             result.optionPost[0].options = option;

//             result.save().then( editedSaveDocument => {
//                 return res.status(201).json({
//                     data: editedSaveDocument
//                 })
//             }).catch( err => {
//                 if(!err.statusCode){
//                     err.statusCode = 500
//                 }
//                 next(err);
//             })
//             // console.log(editObject)
//             // console.log( result.optionPost[0].options, result.optionPost[0].position )

//         }).catch( err => {
//             if(!err.statusCode){
//                 err.statusCode = 500;
//             }
//             next(err);
//         })

//     }
// }



export default SetupController;