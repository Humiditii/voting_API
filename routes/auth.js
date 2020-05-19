import express from 'express';
const router = express.Router();

import { GetHomePage,postSignUp,Signin} from '../controller/auth.js';



router.get('/', new GetHomePage().getHomepage);

router.post('/signup',new postSignUp().verify);

router.post('/login', new Signin().login)

export default router;

