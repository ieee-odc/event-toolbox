const express = require("express");
const router = express.Router();
const {
  addParticipant,
  deleteParticipant,
  editParticipant,
  getEventParticipants,
  getWorkshopParticipants,
  register,
  getCancelationData,
  cancelEventRegistration,
  cancelWorkshopRegistration,
} = require("../controllers/ParticipantController");

router.post("/add", addParticipant);
router.post("/edit/:participantId", editParticipant);
router.post("/delete/:participantId", deleteParticipant);
router.get("/get-event/:eventId", getEventParticipants);
router.get("/get-workshop/:workshopId", getWorkshopParticipants);
router.post("/submit", register);
router.post("/cancelation-data", getCancelationData);
router.post("/cancel-workshop/:participantId", cancelWorkshopRegistration);
router.post("/cancel-event/:eventId", cancelEventRegistration);

module.exports = router;
