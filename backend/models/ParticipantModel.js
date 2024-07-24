const mongoose = require("mongoose");

const ParticipationStatus = Object.freeze({
  PAID: "Paid",
  PENDING: "Pending",
  CANCELED: "Canceled",
});
const ParticipantSchema = mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ParticipationStatus),
      required: true,
    },
    eventId: {
      type: Number,
      required: true,
    },
    workshopId: {
      type: Number,
    },
  },
  { timestamps: true }
);

const Participant = mongoose.model("Participant", ParticipantSchema);

module.exports = Participant;
