const express = require("express");
const router = express.Router();
const {
  getOneWorkshop,
  addWorkshop,
  deleteWorkshop,
  editWorkshop,
  getSpaceWorkshops,
  getEventWorkshops,
  getOrganizerWorkshops,
} = require("../controllers/WorkshopController");

router.get("/get-space/:spaceId", getSpaceWorkshops);
router.get("/get-event/:eventId", getEventWorkshops);
router.get("/get-organizer/:organizerId", getOrganizerWorkshops);

router.get("/:workshopId", getOneWorkshop);
router.post("/add", addWorkshop);
router.post("/edit/:workshopId", editWorkshop);
router.post("/delete/:workshopId", deleteWorkshop);

module.exports = router;
