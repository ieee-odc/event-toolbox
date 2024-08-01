const Counter = require("../models/CounterModel");
const Participant = require("../models/ParticipantModel");
const Workshop = require("../models/WorkshopModel");
const Event = require("../models/EventModel");
const Notification = require("../models/notificationModel");



const addParticipant = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const participant = new Participant({
      id: counter.seq,
      status: "Pending",
      ...req.body,
    });

    await participant.save();
    // Fetch event details to get the organizerId
    const event = await Event.findOne({ id: participant.eventId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const organizerId = event.organizerId;

    // Create a notification for the organizer
    const newNotification = new Notification({
      from: participant.id, // Participant's ID
      to: organizerId, // Organizer's ID
      type: 'EventRegistration',
      message: `A new participant has registered for your event: ${event.name}`,
      read: false,
    });

    await newNotification.save();


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
    const { workshopId, ...participantData } = req.body;
    console.log(workshopId)
    // Find and update the workshop by incrementing the currentParticipants
    const workshop = await Workshop.findOneAndUpdate(
      { id: workshopId },
      { $inc: { currentParticipants: 1 } },
      { new: true }
    );

    if (!workshop) {
      return res.status(404).json({ message: 'Workshop not found' });
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
      { id: 'autovalParticipant' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const participant = new Participant({
      id: counter.seq,
      workshopId,
      status: 'Pending',
      ...participantData,
    });

    await participant.save();
    console.log(participant);

     // Create a notification for the workshop organizer
     const organizerId = workshop.organizerId; // Assuming organizerId is stored in the workshop document

     const newNotification = new Notification({
       from: participant.id, // Participant's ID
       to: organizerId, // Organizer's ID
       type: 'WorkshopRegistration',
       message: `A new participant has registered for your workshop: ${workshop.name}`,
       read: false,
     });
 
     await newNotification.save();
 
     res.status(201).json({
       status: 'success',
       message: 'Added Participant and created notification',
       participant: participant,
     });
   } catch (error) {
     console.error(error);
     res.status(500).json({
       message: 'Server Error!',
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
};
