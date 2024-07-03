const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    eventDescription: {
      type: String,
      required: true,
    },
    currentParticipants: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
