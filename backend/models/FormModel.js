const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FormSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  //   price: {
  //     type: Number,
  //     default: 0,
  //   },
  description: {
    type: String,
    required: true,
  },

  data: {
    type: Map,
    of: Schema.Types.Mixed, //Allow any type of value in the Map
  },
});
module.exports = mongoose.model("Form", FormSchema);
