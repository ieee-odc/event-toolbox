const express = require("express");
const {
  createForm,
  deleteForm,
  updateForm,
  getForms,
  getForm,
  getOrganizerForms,
  getEventForms,
  getWorkshopForms
} = require("../controllers/FormController");
const router = express.Router();

router.post("/add", createForm);
router.post("/edit/:formId", updateForm);
router.delete("/delete/:formId", deleteForm);
router.get("/get-organizer/:organizerId", getOrganizerForms);
router.get("/get-event/:eventId", getEventForms);
router.get("/get-workshop/:workshopId",getWorkshopForms)

module.exports = router;