const express = require("express");
const router = express.Router();
const {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getEvent,
} = require("../controllers/EventController");

router.get("/", getEvents);
router.post("/add", createEvent);
router.get("/:id", getEvent);
router.delete("/delete/:id", deleteEvent);
router.patch("/edit/:id", updateEvent);

module.exports = router;
