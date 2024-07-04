const express = require('express');
const router = express.Router();
const {SignIn,Register} = require('../controllers/authController')


router.post('/login',SignIn);
router.post('/signUp',Register);


module.exports = router;
