const express = require("express");
const {
  createForm,
  deleteForm,
  updateForm,
  getForms,
  getForm,
  getOrganizerForms,
} = require("../controllers/FormController");
const router = express.Router();

router.post("/add", createForm);
router.post("/edit/:formId", updateForm);
router.delete("/delete/:formId", deleteForm);
router.get("/get-organizer/:organizerId", getOrganizerForms);

module.exports = router;