const express = require("express");
const router = express.Router();
const { getOrganizerName, getOrganizers} = require("../controllers/OrganizerController");

router.get("/get/:organizerId", getOrganizerName);
router.get("/", getOrganizers);

module.exports = router;
