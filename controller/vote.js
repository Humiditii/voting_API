import PinModel from '../models/pin';
import SetupModel from '../models/setupVote';
import jwt from 'jsonwebtoken';


export class GetVote {
    constructor(){
        this.getvote;
    }

    getvote(req, res, next){
        return res.status(200).json({
            message:`Welcome to the voting platform, login to the platform with your surname and the pin provided to you`
        });
    }
}

/**
 * Authenticate the Voter with the Pin generated by the admin of 
 * the voter and the voter name, if the authentication process is successful,
 * then the user can be redirected to the voting page
 */
export class AuthVoter {
    constructor(){
        this.loginVoter;
    }

    loginVoter(req, res,next){
        const VoterDetails = {
            pin: req.body.pin,
            name: req.body.name
        }

        PinModel.findOne({voter_pin: VoterDetails.pin}).then( result => {
            if(!result){
                return res.status(404).json({
                    message: 'Pin supplied not found, please input the correct pin or contact your provider'
                })
            }else{
                if( result.voter_name === VoterDetails.name && result.status == 0){
                    result.status = 1;
                    result.save().then( procedDocument => {
                        const token = jwt.sign({
                            pin: procedDocument.voter_pin,
                            voter_pin_id: procedDocument._id.toString()},
                            'easypayapisupersecrete',
                            { expiresIn: '1h'} 
                            );
                            return res.status(200).json({
                                message: procedDocument.voter_name + ' logged in to the voting platform successfully',
                                token: token
                            });
                    }).catch( err => {
                        if(!err.statusCode){
                            err.statusCode = 500;
                        }
                        next(err);
                    })
                }else {
                    return res.status(401).json({
                        message: 'Name supplied does not match the Pin provided or User logged in before'
                    });
                }
            }
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    }
}

/**
 * This class helps to search the database for the available candidates
 * with the user pin and match it to the admin that created it
 *  <<<< NOte that array.length / 2 = the length of the candidatearray
 * <<<<< and the other half consists of the vote count of the candidates in the first half consecutively
 */

export class StartVote {
    constructor(){
        this.vote;
    }

    vote(req, res, next){
        const voterId = req.voter_pin_id;
        PinModel.findById(voterId).then( voterDocument => {
            const admin = voterDocument.adminId;
            SetupModel.findOne({adminId: admin}).then( adminDocument => {
                return res.status(200).json({
                    message: adminDocument.optionPost
                })
            }).catch( err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    }
}

/**i
 * THis class takes the voter result and update in the database 
 */
export class SubmiVote {
    constructor(){
        this.postVote;
    }

    postVote( req, res, next ){
        const voterId = req.voter_pin_id;
        const voter_option_req = Number(req.body.voter_opt);

        PinModel.findById(voterId).then( voterDocument => {

            SetupModel.findOne({adminId: voterDocument.adminId}).then( adminDocument => {
                // adminDocument.update({$inc: {"adminDocument.optionPost[0].options[1][voter_option_req]": 1 }}).then( result => {
                //     res.json({
                //         data: result
                //     })
                // }).catch(err => {
                //     if(!err.statusCode){
                //         err.statusCode = 500;
                //     }
                //     next(err);
                // })
                //console.log( adminDocument.optionPost[0].options[1][voter_option_req] )
                //console.log(adminDocument.optionPost[0].options[1][voter_option_req] += 1);

                adminDocument.optionPost[0].options[1][voter_option_req] += 1
                adminDocument.save().then( voteSubmitted => {
                    console.log(adminDocument.optionPost[0].options[1][voter_option_req] += 1)
                    return res.status(201).json({
                        data: voteSubmitted
                    });
                }).catch( err => {
                    if(!err.statusCode){
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }).catch( err => {
                if(!err.statusCode){
                    err.statusCode = 500;
                }
                next(err);
            })
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
        
    }
}

export class Result {   
    static Getresult(req, res, next){
        const adminId = req.userId;
        SetupModel.findOne({adminId: adminId}).then( documents => {
            res.status(200).json({
                data:{
                    position: documents.optionPost[0].position,
                    options:documents.optionPost[0].options,
                },
                statusCode: 200
            });
        }).catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
    }
}