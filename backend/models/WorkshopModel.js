const mongoose = require("mongoose");

const WorkshopSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    spaceId: {
      type: Number,
    },
    eventId: {
      type: Number,
      required: true,
    },
    formId: {
      type: Number,
    },
    organizerId: {
      type: Number,
      required: true,
    },
    currentParticipants: {
      type: Number,
      required: true,
      default: 0,
    },
    numberOfAttendees: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    
  },
  { timestamps: true }
);

const Workshop = mongoose.model("Workshop", WorkshopSchema);

module.exports = Workshop;
