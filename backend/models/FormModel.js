const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for the objects in the data array
const DataItemSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["input", "checkbox", "radio", "file", "dropdown", "date", "time"], 
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
    },
  },
  { _id: false }
); // No need for _id in subdocuments

const FormSchema = new Schema({
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
  data: {
    type: [DataItemSchema],
    required: true, // Set to true if data is mandatory
  },
  deadline: {
    type: Date,
    required: false,
  },
  organizerId: {
    type: Number,
    required: true,
  },
  eventId: {
    type: Number,
    required: false,
  },
});

module.exports = mongoose.model("Form", FormSchema);
