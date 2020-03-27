import express from 'express';
import {IsAuth} from '../middleware/isAuth';
import { GetSetupVote } from '../controller/setupVote';

const auth = new IsAuth();
const gSV = new GetSetupVote();

const router = express.Router();

router.get('/setupVote',auth.verifyAuth, gSV.getFirstPage);

export default router;

