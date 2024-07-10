const express = require("express");
const {
  createForm,
  deleteForm,
  updateForm,
  getForms,
  getForm,
  getOrganizerForms,
} = require("../controllers/formController");
const router = express.Router();

router.get("/", getForms);
router.post("/add", createForm);
router.get("/:formId", getForm);
router.put("/edit/:formId", updateForm);
router.delete("/delete/:formId", deleteForm);
router.get("/get-organizer/:organizerId", getOrganizerForms);

module.exports = router;
