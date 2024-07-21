const express = require('express');
const router = express.Router();
const { createLink, getFormByLink } = require('../controllers/linkController');

router.post('/create', createLink);
router.get('/:link', getFormByLink);

module.exports = router;
