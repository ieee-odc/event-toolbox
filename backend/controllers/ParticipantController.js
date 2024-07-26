const Counter = require("../models/CounterModel");
const Participant = require("../models/ParticipantModel");

const addParticipant = async (req, res) => {
  try {

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const participant = new Participant({
      id: counter.seq,
      status:"Pending",
      ...req.body,
    });

    await participant.save();

    res.status(201).json({
      status: "success",
      message: "Added Participant",
      participant: participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const editParticipant = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const updatedParticipant = await Participant.findOneAndUpdate(
      { id: participantId },
      req.body,
      { new: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Participant updated",
      participant: updatedParticipant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const deleteParticipant = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const deletedParticipant = await Participant.findOneAndDelete({
      id: participantId,
    });

    if (!deletedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Participant deleted",
      participant: deletedParticipant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getEventParticipants = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const participants = await Participant.find({
      eventId,
    });

    return res.status(200).json({
      status: "success",
      message: "Participant retrieved",
      participants: participants,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const register = async (req, res) => {
  try {

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const participant = new Participant({
      id: counter.seq,
      status:"Pending",
      ...req.body,
    });

    await participant.save();

    res.status(201).json({
      status: "success",
      message: "Added Participant",
      participant: participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

module.exports = {
  addParticipant,
  deleteParticipant,
  editParticipant,
  getEventParticipants,
  register
};
