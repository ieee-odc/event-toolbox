const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FormSchema = new Schema({
  //   eventId: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Event",
  //     required: false,
  //   },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  data: {
    type: Map,
    of: Schema.Types.Mixed,
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
