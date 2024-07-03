const mongoose=require("mongoose");

const ParticipantSchema=mongoose.Schema({
    id:{
        type:Number,
        required:true,
    },
    userId:{
        type:Number,
        required:true,
    },
    participantTitle:{
        type:String,
        required:true,
    },
    participantType:{
        type:String,
        required:true,
    },
    participantDescription:{
        type:String,
        required:true,
    },
    participantImage:{
        type:String,
        required:true,
    },
    participantStatus:{
        type:String,
        required: true
    },
    
} ,{ timestamps: true })


const Participant=mongoose.model("Participant",ParticipantSchema)

module.exports=Participant;