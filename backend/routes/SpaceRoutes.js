const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');

//create Space 
router.post('/create', SpaceController.createSpace);

//get Post by Id
// router.get("/:spaceId",SpaceController.getSpaceById);

//get space By Organizer Id
router.get("/:orgId",SpaceController.getSpaceByOrgId);

// Route to update a space by ID
router.put('update/:spaceId', SpaceController.updateSpaceById);

// Route to delete a space by ID
router.delete('delete/:spaceId', SpaceController.deleteSpaceById);

module.exports = router;
