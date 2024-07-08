const express=require("express")
const router=express.Router();
const { addParticipant, deleteParticipant, editParticipant, getEventParticipants } = require("../controllers/ParticipantController");



router.get("/get-event/:eventId",getEventParticipants)
router.post("/add",  addParticipant);
router.post("/edit/:participantId",editParticipant)
router.post("/delete/:participantId",deleteParticipant);



module.exports=router