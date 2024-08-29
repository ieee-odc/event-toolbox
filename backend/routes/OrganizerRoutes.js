const express = require("express");
const router = express.Router();
const { getOrganizerName, getOrganizers, approveOrganizer, declineOrganizer } = require("../controllers/OrganizerController");

router.get("/get/:organizerId", getOrganizerName);
router.get("/", getOrganizers);
router.patch("/:organizerId/approve", approveOrganizer);
router.patch("/:organizerId/decline", declineOrganizer);

module.exports = router;
