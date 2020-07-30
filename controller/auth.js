import bcrypt from 'bcryptjs';
import {AuthModel} from '../models/auth';
import jwt from 'jsonwebtoken';

export class postSignUp {
    constructor(){
        this.verify;
    }


    verify(req,res,next){
       // console.log('reached');
    const User  = {
        email : req.body.email,
        username : req.body.username,
        phone: req.body.phone,
        password: req.body.password,
        role: req.body.role
    }  
    //console.log(User)
    AuthModel.find({email:User.email} || {username:User.username}).then( result => {
        if( result.length > 0){
            return res.status(200).json({
                message: 'Email already exist'
            });
        }else {
           
            return bcrypt.hash(User.password, 12).then( hashedPassword => { 
                const newUser = new AuthModel({
                    email: User.email,
                    username: User.username,
                    phone: User.phone,
                    password: hashedPassword,
                    role: User.role
                });
    
                return newUser.save().then( result => {
                    res.status(201).json({
                        message: result
                    })
                }).catch( err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }).catch( err => {
                if (!err.statusCode) {
                    err.statusCode = 500;
                }
                next(err);
            })
        }
    }).catch( err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    });
   }

}

export class Signin {
    constructor(){
            this.login;
    }

    login(req, res, next){
        const loginDetails = { 
            //<<<-----User can sign in with Email or username-------->>>
            username: req.body.username,
            password: req.body.password
        }

        AuthModel.find().then( result => {
            const userArr = [...result]
            const findUserWithEmail = userArr.find(user => user.email == loginDetails.username);
            const findUserWithUsername = userArr.find( user => user.username == loginDetails.username);
            
            if ( findUserWithEmail ) {
                return bcrypt.compare(loginDetails.password, findUserWithEmail.password ).then( authUserConfirmed => {
                    if(!authUserConfirmed ){
                        return res.json({
                            statusCode: 400,
                            message: 'Password not correct, please verify and try again on Email'
                        })
                    }else{
                        const token = jwt.sign({ email: findUserWithEmail.email,
                            userId: findUserWithEmail._id.toString(),
                            userRole: findUserWithEmail.role }, 
                            'easypayapisupersecrete',
                            { expiresIn: '1h'} );
                            res.status(200).json({
                                Message: findUserWithEmail.email +" "+ "logged in",
                                token: token,
                                userId: findUserWithEmail._id.toString(),
                                userRole: findUserWithEmail.role
                            }
                        );
                    }
                }).catch( err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }else if(findUserWithUsername) {
                return bcrypt.compare(loginDetails.password, findUserWithUsername.password ).then( authUserConfirmed => {
                    if(!authUserConfirmed ){
                        return res.json({
                            statusCode: 400,    
                            message: 'Password not correct, please verify and try again  on Username'
                        })
                    }else{
                        const token = jwt.sign({ email: findUserWithUsername.email,
                            userId: findUserWithUsername._id.toString(),
                            userRole: findUserWithUsername.role }, 
                            'easypayapisupersecrete',
                            { expiresIn: '1h'} );
                            res.status(200).json({
                                Message: findUserWithUsername.username +" "+ "logged in",
                                token: token,
                                userId: findUserWithUsername._id.toString(),
                                //userRole: findUserWithUsername.role
                            }
                        );
                    }
                }).catch( err => {
                    if (!err.statusCode) {
                        err.statusCode = 500;
                    }
                    next(err);
                })
            }else{
                return res.status(200).json({
                    message: 'User not found'
                })
            }

        }).catch( err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        })
    }
}

export class ForgotPassword {
    constructor(){
        
    }
}


export class GetHomePage {
    constructor(){
        this.getHomepage
    }
   getHomepage(req,res,next){
    return res.json({
            'Message': 'Welcome to the VoteApi'
        })
   }
}