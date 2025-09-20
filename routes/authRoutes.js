import express from 'express';
import { register, login, generateOtp, checkOtp, checkOtpAndResetPass, getOtp } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);


router.post('/forget', generateOtp);
router.post('/checkOtp', checkOtp);
router.post('/reset', checkOtpAndResetPass);


// FOR TESTING PURPOSE ONLY
router.post('/otp', getOtp); 

export default router;
