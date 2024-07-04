const mongoose=require("mongoose");

const WorkshopSchema=mongoose.Schema({
    id:{
        type:Number,
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
    currentParticipats:{
        type:Number,
        required:true,
    },
    spaceId:{
        type:Number,
        required:true,
    },
    eventId:{
        type:Number,
        required:true,
    }
    
} ,{ timestamps: true })


const Workshop=mongoose.model("Workshop",WorkshopSchema)

module.exports=Workshop;