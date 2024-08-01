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
  getMultipleWorkshops,
  selectForm,
  selectSpace,
} = require("../controllers/WorkshopController");

router.get("/get-space/:spaceId", getSpaceWorkshops);
router.get("/get-event/:eventId", getEventWorkshops);
router.get("/get-organizer/:organizerId", getOrganizerWorkshops);

router.get("/:workshopId", getOneWorkshop);
router.post("/add", addWorkshop);
router.post("/get-many", getMultipleWorkshops);
router.post("/edit/:workshopId", editWorkshop);
router.post("/delete/:workshopId", deleteWorkshop);
router.post("/select-form", selectForm);
router.post("/select-space", selectSpace);

module.exports = router;
