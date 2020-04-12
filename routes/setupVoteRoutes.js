import express from 'express';
import {IsAuth} from '../middleware/isAuth';
import { GetSetupVote, PostVoteSetup , postPinGeneration, GetGeneratedPin, ViewVote} from '../controller/setupVote';

const auth = new IsAuth();



const router = express.Router();

/**
 * These are the application routes to setup up voting platform and view them 
 * also generate voting pins 
 */

//<<<< GET request to /api/setupVote 
router.get('/setupVote',auth.verifyAuth, new GetSetupVote().getFirstPage);

// <<<<< POST request to the api/setupVote to generate the voting environment
router.post('/setupVote', auth.verifyAuth, new PostVoteSetup().postVote);

// <<<<< POST request to api/setpin to generate a voting pin for a particular user to vote with for authenticated user
router.post('/setpin', auth.verifyAuth, new postPinGeneration().setPin);

/** <<<<< GET request to api/getpins to view the list of generated pins 
    << for authenticated user >>
*/ 
router.get('/getpins', auth.verifyAuth, new GetGeneratedPin().getpins);

/**
 * GET requesrt to api/viewSetups to view the voting platform created
 * <<< for authenticated user only
 */
router.get('/viewSetups', auth.verifyAuth, new ViewVote().view );

export default router;

