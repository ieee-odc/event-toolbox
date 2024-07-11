const express = require('express');
const router = express.Router();
const {createSpace,getSpaceByOrgId,updateSpaceById,deleteSpaceById,filterByOrgId} = require('../controllers/spaceController');

router.post('/add', createSpace);

router.get('/get-organizer/:organizerId', getSpaceByOrgId);

router.put('/edit/:spaceId', updateSpaceById);

router.delete('/delete/:spaceId', deleteSpaceById);

router.get('/filter/:orgId',filterByOrgId);

module.exports = router;
