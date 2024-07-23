const express=require("express")
const router=express.Router();
const { addParticipant, deleteParticipant, editParticipant, getEventParticipants } = require("../controllers/ParticipantController");



router.post("/add",  addParticipant);
router.post("/edit/:participantId",editParticipant)
router.post("/delete/:participantId",deleteParticipant);
router.get("/get-event/:eventId",getEventParticipants)



module.exports=router