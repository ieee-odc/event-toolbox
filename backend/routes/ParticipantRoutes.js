const express=require("express")
const router=express.Router();
const { addParticipant, deleteParticipant, editParticipant, getEventParticipants, register } = require("../controllers/ParticipantController");



router.post("/add",  addParticipant);
router.post("/edit/:participantId",editParticipant)
router.post("/delete/:participantId",deleteParticipant);
router.post("/submit",  register);
router.get("/get-event/:eventId",getEventParticipants)




module.exports=router