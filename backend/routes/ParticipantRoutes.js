const express=require("express")
const router=express.Router();
const { addParticipant, deleteParticipant, editParticipant, getUserParticipant } = require("../controllers/ParticipantController");




router.post("/",getUserParticipant)
router.post("/add",  addParticipant);
router.post("/delete",deleteParticipant);
router.post("/edit",editParticipant)



module.exports=router