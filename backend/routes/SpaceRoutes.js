const express = require('express');
const router = express.Router();
const SpaceController = require('../controllers/spaceController');

// Route to create a new space for an organizer
router.post('/create/:orgId', SpaceController.createSpace);

// Route to get spaces by organizer ID
router.get('/:orgId', SpaceController.getSpaceByOrgId);

// Route to update a space by ID
router.put('/update/:spaceId', SpaceController.updateSpaceById);

// Route to delete a space by ID
router.delete('/delete/:spaceId', SpaceController.deleteSpaceById);

// Route to filter By Organizer Id
router.get('/filter/:orgId',SpaceController.filterByOrgId);

module.exports = router;
