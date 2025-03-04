import express from 'express';
import { emailverify_get, forgotpassword_get, forgotpassword_post, login_get, login_post, logout, otp_post, otpverify_get, resetpassword_get, resetpassword_post, signup_get, signup_post } from '../controllers/authController.js';

const router = express.Router();

router.get('/login', login_get);

router.get('/signup', signup_get );

router.get('/forgotpassword', forgotpassword_get)

router.get('/otpkvpsjnrmwkmwoomw', otpverify_get)

router.get('/resetpassword', resetpassword_get )

router.get('/emailverify/:id', emailverify_get);

router.get('/logout', logout);

router.post('/signup', signup_post);

router.post('/login', login_post);

router.post('/forgotpassword', forgotpassword_post);

router.post('/otp', otp_post);

router.post('/resetpassword', resetpassword_post);


 
export default router;