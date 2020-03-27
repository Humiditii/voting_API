import express from 'express';
const router = express.Router();

import { GetHomePage,postSignUp,Signin} from '../controller/auth.js';


const pg = new GetHomePage;
const signUp = new postSignUp;
const sn = new Signin;


router.get('/', pg.getHomepage);

router.post('/signup',signUp.verify);

router.post('/login', sn.login)

export default router ;

