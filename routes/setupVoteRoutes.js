import express from 'express';
import {IsAuth} from '../middleware/isAuth';
import { GetSetupVote, PostVoteSetup , postPinGeneration, GetGeneratedPin} from '../controller/setupVote';

const auth = new IsAuth();



const router = express.Router();

router.get('/setupVote',auth.verifyAuth, new GetSetupVote().getFirstPage);

router.post('/setupVote', auth.verifyAuth, new PostVoteSetup().postVote);

router.post('/setpin', auth.verifyAuth, new postPinGeneration().setPin);

router.get('/getpins', auth.verifyAuth, new GetGeneratedPin().getpins);

export default router;

