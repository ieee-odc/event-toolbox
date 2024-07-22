const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getOrganizerEvents,
  duplicateEvent,
  getOneEvent,
} = require("../controllers/EventController");

router.get("/", getEvents);
router.post("/add", createEvent);
router.get("/:eventId", getOneEvent);
router.get("/get-organizer/:organizerId", getOrganizerEvents);

router.delete("/delete/:eventId", deleteEvent);
router.post("/edit/:eventId", updateEvent);
router.post("/duplicate/:eventId", duplicateEvent);

module.exports = router;
