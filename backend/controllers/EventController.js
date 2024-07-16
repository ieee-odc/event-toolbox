const Counter = require("../models/CounterModel");
const Event = require("../models/EventModel");
const User = require("../models/OrganizerModel");


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
      ...req.body
    });
    res.status(200).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try{
    const { eventId } = req.params;

  const updatedEvent = await Event.findOneAndUpdate(
    { id:eventId },
    {
      ...req.body,
    },
    { new: true }

  );
  if (!updatedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json({
    message:"Event successfully updated",
    event:updatedEvent
  });
  }catch(e){
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Event.findOneAndDelete({ id:eventId });
    if (!deletedEvent) {
      return res.status(400).json({ error: "No such item" });
    }
    res.status(200).json(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const searchedEvent = await Event.findOne({ id:eventId });
    if (!searchedEvent) {
      return res.status(404).json({ error: "No such Event" });
    }
    res.status(200).json(searchedEvent);
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getOrganizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const organizer = await User.findOne({id:organizerId});
    if(!organizer){
      return res.status(400).json({
        message: "Organizer doesn't exist!",
      });
    }
    const events = await Event.find({ organizerId });

    return res.status(200).json({
      status: "success",
      message: "Events retrieved successfully",
      events
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

module.exports = {
  createEvent,
  deleteEvent,
  updateEvent,
  getEvents,
  getEvent,
  getOrganizerEvents,
};
