const express = require("express");
const router = express.Router();
const { adminLogin } = require("../controllers/AdminController");



router.post("/adminlogin", adminLogin);

module.exports = router;