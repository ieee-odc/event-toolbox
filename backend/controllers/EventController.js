const Counter = require("../models/CounterModel");
const Event = require("../models/EventModel");
const User = require("../models/OrganizerModel");
const Space = require("../models/SpaceModel");
const Workshop = require("../models/WorkshopModel");
const Form = require("../models/FormModel");
const Participant = require("../models/ParticipantModel");
const mongoose = require("mongoose");

const getEvents = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  res.status(200).json(events);
};

const createEvent = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalEvents" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const newEvent = await Event.create({
      id: counter.seq,
      ...req.body,
    });
    res.status(200).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const updatedEvent = await Event.findOneAndUpdate(
      { id: eventId },
      {
        ...req.body,
      },
      { new: true }
    );
    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({
      message: "Event successfully updated",
      event: updatedEvent,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};
const deleteEvent = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { eventId } = req.params;
    
    const deletedEvent = await Event.findOneAndDelete({ id: eventId }).session(session);
    if (!deletedEvent) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ error: "No such item" });
    }

    await Promise.all([
      Workshop.deleteMany({ eventId }).session(session),
      Space.deleteMany({ eventId }).session(session),
      Participant.deleteMany({ eventId }).session(session),
      Form.deleteMany({ eventId }).session(session)
    ]);

    await session.commitTransaction();
    session.endSession();
    
    res.status(200).json({
      message:"Deleted event successfully",
      status:"success",
      event:deletedEvent
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ message: "Server Error!" });
  }
};


const getOrganizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const organizer = await User.findOne({ id: organizerId });
    if (!organizer) {
      return res.status(400).json({
        message: "Organizer doesn't exist!",
      });
    }
    const events = await Event.find({ organizerId });

    return res.status(200).json({
      status: "success",
      message: "Events retrieved successfully",
      events,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getOneEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(400).json({
        message: "Event doesn't exist!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Event retrieved successfully",
      event,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

const duplicateEvent = async (req, res) => {
  const { eventId } = req.params;

  try {
    const originalEvent = await Event.findOne({ id: eventId });
    if (!originalEvent) {
      return res.status(404).send({ message: "Event not found" });
    }
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalEvents" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const duplicatedEvent = new Event({
      ...originalEvent.toObject(),
      name:`${originalEvent.name} Duplicate`,
      id: counter.seq,
      _id: new mongoose.Types.ObjectId(),
    });
    await duplicatedEvent.save();

    // Duplicate associated spaces
    const spaces = await Space.find({ eventId });
    const duplicatedSpaces = await Promise.all(
      spaces.map(async (space) => {
        const spacesCounter = await Counter.findOneAndUpdate(
          { id: "autovalSpaces" },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const duplicatedSpace = new Space({
          ...space.toObject(),
          id: spacesCounter.seq,
          eventId: counter.seq,
          _id: new mongoose.Types.ObjectId(),
        });
        await duplicatedSpace.save();
        return duplicatedSpace;
      })
    );

    // Duplicate associated workshops
    const workshops = await Workshop.find({ eventId });
    const duplicatedWorkshops = await Promise.all(
      workshops.map(async (workshop) => {
        const workshopsCounter = await Counter.findOneAndUpdate(
          { id: "autovalWorkshops" },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const duplicatedWorkshop = new Workshop({
          ...workshop.toObject(),
          id: workshopsCounter.seq,
          eventId: counter.seq,
          _id: new mongoose.Types.ObjectId(),

        });
        await duplicatedWorkshop.save();
        return duplicatedWorkshop;
      })
    );

    // Duplicate associated forms
    const forms = await Form.find({ eventId });
    const duplicatedForms = await Promise.all(
      forms.map(async (form) => {
        const FormsCounter = await Counter.findOneAndUpdate(
          { id: "autovalForms" },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
        const duplicatedForm = new Form({
          ...form.toObject(),
          id: FormsCounter.seq,
          eventId: counter.seq,
          _id: new mongoose.Types.ObjectId(),
        });
        await duplicatedForm.save();
        return duplicatedForm;
      })
    );

    res.status(201).send({
      message: "Event duplicated successfully",
      event: duplicatedEvent,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getOrganizerEvents,
  duplicateEvent,
  getOneEvent
};
