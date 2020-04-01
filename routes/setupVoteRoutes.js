import express from 'express';
import {IsAuth} from '../middleware/isAuth';
import { GetSetupVote, PostVoteSetup , postPinGeneration, GetGeneratedPin} from '../controller/setupVote';

const auth = new IsAuth();
const gSV = new GetSetupVote();
const pSv = new PostVoteSetup();

const router = express.Router();

router.get('/setupVote',auth.verifyAuth, gSV.getFirstPage);

router.post('/setupVote', auth.verifyAuth, pSv.postVote);

router.post('/setpin', auth.verifyAuth, new postPinGeneration().setPin);

router.get('/getpins', auth.verifyAuth, new GetGeneratedPin().getpins);

export default router;

