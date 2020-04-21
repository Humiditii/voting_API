import express from 'express';
import {IsAuth} from '../middleware/isAuth'
import {AuthVoter, GetVote, StartVote, SubmiVote, Result} from '../controller/vote';

const router = express.Router();

// GET request to /api/vote to give a welcome message to the voter
router.get('/vote', new GetVote().getvote );

//POST request to /api/vote to request for authorization
router.post('/vote', new AuthVoter().loginVoter);

//GET request to /api/vote_granted to view the voting page for authorized voter only
router.get('/vote_granted', new IsAuth().VoteAuth ,new StartVote().vote );

router.post('/submit_vote', new IsAuth().VoteAuth, new SubmiVote().postVote )

router.get('/result', new IsAuth().verifyAuth, Result.Getresult )

export default router;

