const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    from :{
        type : mongoose.Schema.Types.ObjectId, // Reference to a User document
        ref : 'Participant', // The referenced model is 'Participant'
        required : true
    },
    to :{
        type : Number,
        ref : 'User',
        required : true
    },
    type :{
        type: String,
        required:true,
        enum: ['EventRegistration','WorkshopRegistration']
    },
    read :{
        type: Boolean,
        default :false
    }
    
},{timestamps:true});
const Notification =mongoose.model('Notifiaction',notificationSchema);

module.exports = Notification;

