const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    Name: {
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
    Description: {
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