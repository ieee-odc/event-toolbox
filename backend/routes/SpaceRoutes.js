const express = require('express');
const router = express.Router();
const {createSpace,getSpaceByOrgId,updateSpaceById,deleteSpaceById,getEventSpaces} = require('../controllers/spaceController');

router.post('/add', createSpace);

router.get('/get-organizer/:organizerId', getSpaceByOrgId);

router.post('/edit/:spaceId', updateSpaceById);

router.delete('/delete/:spaceId', deleteSpaceById);

router.get("/get-event/:eventId", getEventSpaces);


module.exports = router;
