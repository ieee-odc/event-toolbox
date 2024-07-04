const express=require("express")
const router=express.Router();
const { addWorkshop, deleteWorkshop, editWorkshop, getSpaceWorkshops } = require("../controllers/WorkshopController");



router.get("/get-event/:eventId",getSpaceWorkshops)
router.post("/add",  addWorkshop);
router.post("/edit/:participantId",editWorkshop)
router.post("/delete/:participantId",deleteWorkshop);



module.exports=router