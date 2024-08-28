const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    from: {
      type: Number,
      required: true,
    },
    to: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["EventRegistration", "WorkshopRegistration"],
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
