const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getEvent,
  getOrganizerEvents,
} = require("../controllers/EventController");

router.get("/", getEvents);
router.post("/add", createEvent);
router.get("/:eventId", getEvent);
router.get("/get-event/:organizerId", getOrganizerEvents);

router.delete("/delete/:eventId", deleteEvent);
router.put("/edit/:eventId", updateEvent);

module.exports = router;
