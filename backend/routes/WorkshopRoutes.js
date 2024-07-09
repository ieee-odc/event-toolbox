const express=require("express")
const router=express.Router();
const { addWorkshop, deleteWorkshop, editWorkshop, getSpaceWorkshops, getEventWorkshops } = require("../controllers/WorkshopController");



router.get("/get-space/:spaceId",getSpaceWorkshops)
router.get("/get-event/:eventId",getEventWorkshops)
router.post("/add",  addWorkshop);
router.post("/edit/:workshopId",editWorkshop)
router.post("/delete/:workshopId",deleteWorkshop);



module.exports=router