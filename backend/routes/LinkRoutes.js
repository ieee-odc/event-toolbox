const express = require('express');
const router = express.Router();
const { createLink, getFormByLink, getLinkByFormId,getAllLinks } = require('../controllers/linkController');

router.post('/create', createLink);
router.get('/link/form/:formId', getLinkByFormId);
router.get('/link/:link', getFormByLink);
router.get('/links', getAllLinks);

module.exports = router;
