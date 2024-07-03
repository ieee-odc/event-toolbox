const express = require('express');
const router = express.Router();
const {SignIn,Register} = require('../controllers/authController')


router.post('/Login',SignIn);
router.post('/SignUp',Register);


module.exports = router;
