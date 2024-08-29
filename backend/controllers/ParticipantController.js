const Counter = require("../models/CounterModel");
const Participant = require("../models/ParticipantModel");
const Workshop = require("../models/WorkshopModel");
const Event = require("../models/EventModel");
const Notification = require("../models/NotificationModel");
const Email = require("../controllers/sendEmailController");
const { base64UrlEncode } = require("../utils/helpers");

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

    // Send email notification
    const object = {
      participantId: participant._id,
      eventId,
    };

    const cancelationToken = base64UrlEncode(JSON.stringify(object));
    const subject = `Registration Confirmation for ${event.name}`;
    // await Email.sendEventEmail(
    //   email,
    //   subject,
    //   participantData.fullName || "Participant",
    //   event.name,
    //   event.description,
    //   event.location,
    //   event.startDate,
    //   event.endDate,
    //   cancelationToken
    // );
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

    const participants = await Participant.find({ eventId });

    const emailToParticipant = {};

    for (const participant of participants) {
      const { email, workshopId, responses = [] } = participant;

      if (!emailToParticipant[email]) {
        const event = await Event.findOne({ id: eventId }).select("name");

        emailToParticipant[email] = {
          ...participant.toObject(),
          eventName: event ? event.name : null,
          eventResponses: responses,
          workshops: [],
        };
      }

      if (workshopId) {
        const workshop = await Workshop.findOne({ id: workshopId }).select(
          "name"
        );
        emailToParticipant[email].workshops.push({
          workshopId,
          workshopName: workshop ? workshop.name : null,
          responses,
        });
      }
    }

    const groupedParticipants = Object.values(emailToParticipant);

    return res.status(200).json({
      status: "success",
      message: "Participants retrieved",
      participants: groupedParticipants,
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

    const object = {
      participantId: participant._id,
      eventId,
    };
    const cancelationToken = base64UrlEncode(JSON.stringify(object));
    const subject = `Registration Confirmation for ${workshop.name} session`;
    // await Email.sendWorkshopEmail(
    //   email,
    //   subject,
    //   participantData.fullName || "Participant",
    //   workshop.name,
    //   workshop.description,
    //   workshop.startTime,
    //   workshop.endTime,
    //   cancelationToken
    // );

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

const cancelWorkshopRegistration = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const participant = await Participant.findOne({ _id: participantId });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

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

const cancelEventRegistration = async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const { participantEmail } = req.body;

    const participants = await Participant.find({
      eventId: eventId,
      email: participantEmail,
    });

    if (participants.length === 0) {
      return res
        .status(404)
        .json({ message: "No participants found for this event" });
    }

    for (const participant of participants) {
      await Workshop.findOneAndUpdate(
        { id: participant.workshopId },
        { $inc: { currentParticipants: -1 } }
      );

      await Participant.findOneAndDelete({ _id: participant._id });
    }

    res.status(200).json({
      status: "success",
      message: "Event registration cancelled, and all participants removed",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const checkInWorkshopParticipant = async (req, res) => {
  try {
    const participantId = req.params.participantId;

    const participant = await Participant.findOne({ _id: participantId });
    const workshop = await Workshop.findOne({ id: participant.workshopId });
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    if (!workshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    participant.attendance = "Present"; // Update attendance status
    await participant.save();

    res.status(200).json({
      status: "success",
      message: "Participant checked in",
      participant: participant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const checkInEventParticipants = async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { participantEmail } = req.body;

    const participants = await Participant.find({
      eventId: eventId,
      email: participantEmail,
    });

    if (participants.length === 0) {
      return res
        .status(404)
        .json({ message: "No participants found for this event" });
    }

    for (const participant of participants) {
      participant.attendance = "Present"; // Update attendance status
      await participant.save();
    }

    res.status(200).json({
      status: "success",
      message: "All participants checked in for the event",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getCancelationData = async (req, res) => {
  try {
    const { participantId, eventId } = req.body;

    const participant = await Participant.findOne({ _id: participantId });

    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    const allParticipations = await Participant.find({
      email: participant.email,
      eventId,
    });

    const participationWithWorkshops = await Promise.all(
      allParticipations.map(async (participation) => {
        const participationObj = participation.toObject();
        const workshop = await Workshop.findOne({
          id: participation.workshopId,
        });
        return {
          ...participationObj,
          workshop,
        };
      })
    );
    res.status(200).json({
      status: "success",
      message: "Cancellation data retrieved",
      participants: participationWithWorkshops,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!", error });
  }
};

const retrieveParticipantBasedOnEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const participant = await Participant.findOne({
      email: { $regex: email, $options: "i" }, // 'i' for case-insensitive search
    });
    if (!participant) {
      return res.status(404).json({ message: "Participant not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Participant retrieved",
      participant: {
        email: participant.email,
        fullName: participant.fullName,
        phoneNumber: participant.phoneNumber,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error!", error });
  }
};

module.exports = {
  addParticipant,
  deleteParticipant,
  getCancelationData,
  editParticipant,
  getEventParticipants,
  register,
  getWorkshopParticipants,
  cancelEventRegistration,
  cancelWorkshopRegistration,
  checkInWorkshopParticipant,
  checkInEventParticipants,
  retrieveParticipantBasedOnEmail,
};
