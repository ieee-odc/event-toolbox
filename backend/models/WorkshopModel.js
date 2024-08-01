const mongoose=require("mongoose");

const WorkshopSchema=mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    startTime:{
        type:Date,
        required:true,
    },
    endTime:{
        type:Date,
        required:true,
    },
    currentParticipants:{
        type:Number,
        required:true,
        default:0
    },
    spaceId:{
        type:Number,
    },
    eventId:{
        type:Number,
        required:true,
    },
    formId:{
        type:Number,
    },
    organizerId:{
        type:Number,
        required:true,
    },
    currentParticipants: {
        type: Number,
        required: true,
        default: 0,
    },
    
} ,{ timestamps: true })


const Workshop=mongoose.model("Workshop",WorkshopSchema)

module.exports=Workshop;