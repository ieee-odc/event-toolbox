const express = require('express');
const router = express.Router();
const {createSpace,getSpaceByOrgId,updateSpaceById,deleteSpaceById} = require('../controllers/spaceController');

router.post('/add', createSpace);

router.get('/get-organizer/:organizerId', getSpaceByOrgId);

router.post('/edit/:spaceId', updateSpaceById);

router.delete('/delete/:spaceId', deleteSpaceById);

module.exports = router;
