const Counter = require("../models/CounterModel");
const Participant = require("../models/ParticipantModel");
const Workshop = require("../models/WorkshopModel");
const Event = require("../models/EventModel");
const Notification = require("../models/NotificationModel");

const addParticipant = async (req, res) => {
  try {
    const { eventId, email, ...participantData } = req.body;

    const existingParticipant = await Participant.findOne({ email, eventId });
    if (existingParticipant) {
      return res.status(400).json({
        status: "error",
        message: "Email is already registered for this event.",
      });
    }
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const event = await Event.findOne({ id: eventId });
    if (event.allowedList) {
      event.allowedList.push(email);
    } else {
      event.allowedList = [email];
    }
    await event.save();

    // Create and save the new participant
    const participant = new Participant({
      id: counter.seq,
      status: "Pending",
      eventId,
      email,
      ...participantData,
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

const getWorkshopParticipants = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;
    const participants = await Participant.find({
      workshopId,
    });

    return res.status(200).json({
      status: "success",
      message: "Participant retrieved",
      participants,
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
    const { workshopId, eventId, email, ...participantData } = req.body;

    const workshop = await Workshop.findOne({ id: workshopId });
    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    const existingParticipant = await Participant.findOne({
      email,
      workshopId,
    });
    if (existingParticipant) {
      return res.status(400).json({
        status: "error",
        message: "Email is already registered for this workshop.",
      });
    }

    // Create the participant with an auto-incremented id
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const participant = new Participant({
      id: counter.seq,
      workshopId,
      email,
      eventId,
      status: "Pending",
      ...participantData,
    });

    await participant.save();

    // Create a notification for the workshop organizer
    const organizerId = workshop.organizerId; // Assuming organizerId is stored in the workshop document
    const Notifcounter = await Counter.findOneAndUpdate(
      { id: "autovalNotification" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const newNotification = new Notification({
      id: Notifcounter.seq, // Auto-generated notification ID:
      from: participant.id, // Participant's ID
      to: organizerId, // Organizer's ID
      type: "WorkshopRegistration",
      message: `A new participant has registered for your workshop: ${workshop.name}`,
      read: false,
    });
    await newNotification.save();
    workshop.currentParticipants += 1;
    await workshop.save();
    res.status(201).json({
      status: "success",
      message: "Added Participant and created notification",
      participant: participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const participant = await Participant.findOne({ _id: participantId });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    // Find and update the workshop by decrementing the currentParticipants
    const workshop = await Workshop.findOneAndUpdate(
      { id: participant.workshopId },
      { $inc: { currentParticipants: -1 } },
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    await Participant.findOneAndDelete({ _id: participantId });

    res.status(200).json({
      status: "success",
      message: "Registration cancelled",
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
  register,
  getWorkshopParticipants,
  cancelRegistration,
};
