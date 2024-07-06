const express = require('express');
const router = express.Router();
const {SignIn,Register,forgotPassword,resetPassword,googleAuth} = require('../controllers/authController')


router.post('/login',SignIn);
router.post('/signup',Register);
router.post('/forgetpassword', forgotPassword);
router.post('/resetpassword', resetPassword);
router.post('/google-auth', googleAuth);



module.exports = router;
