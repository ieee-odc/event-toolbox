const express = require('express');
const router = express.Router();
const {SignIn,Register,signupWithGoogle,loginWithGoogle} = require('../controllers/authController')


router.post('/login',SignIn);
router.post('/signup',Register);
router.post('/signupwithgoogle', signupWithGoogle);
router.post('/loginwithgoogle', loginWithGoogle);


module.exports = router;
