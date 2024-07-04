const express = require('express');
const router = express.Router();
const {SignIn,Register,forgotPassword,resetPassword} = require('../controllers/authController')


router.post('/login',SignIn);
router.post('/signup',Register);
router.post('/forgetpassword', forgotPassword);
router.post('/resetpassword', resetPassword);



module.exports = router;
