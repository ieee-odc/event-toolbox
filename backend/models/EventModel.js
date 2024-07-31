const mongoose = require("mongoose");

const EventSchema = mongoose.Schema(
  {
    id:{
      type:Number,
      required:true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    location: {
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
    organizerId:{
      type: Number,
      required: true,
    },
    formId:{
      type:Number,
    }
  },
  { timestamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
