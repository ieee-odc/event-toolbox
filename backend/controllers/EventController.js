const Counter = require("../models/CounterModel");
const event = require("../models/EventModel");
const fs = require("fs");
const mongoose = require("mongoose");

const getEvents = async (req, res) => {
  const events = await event.find({}).sort({ createdAt: -1 });
  res.status(200).json(events);
};
const createEvent = async (req, res) => {
  const { eventName, startDate, endDate, eventDescription } = req.body;
  try {
    const newEvent = await event.create({
      eventName,
      startDate,
      endDate,
      eventDescription,
    });
    res.status(200).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// const updateEvent = async (req, res) => {
//   try {
//     const { eventName, startDate, endDate, eventDescription } = req.body;
//     const { id } = req.params;
//     let file;
//     // if (req.file) {
//     //   const oldEvent = await Event.findOne({ _id: id });
//     //   if (oldEvent && oldEvent.noteImage) {
//     //     fs.unlinkSync(oldEvent.noteImage);
//     //   }
//     //   file = req.file.path;
//     // }
//     // Constructing the updatedData object with the fields to update
//     const updatedData = {
//       eventName,
//       startDate,
//       endDate,
//       eventDescription,
//     };

//     // If no event was found to update, return an error response
//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }
//     // const updatedData = {};
//     // if (eventName) updatedData.eventName = eventName;
//     // if (startDate) updatedData.startDate = startDate;
//     // if (endDate) updatedData.endDate = endDate;
//     // if (eventDescription) updatedData.eventDescription = eventDescription;
//     // if (file) {
//     //   updatedData.noteImage = file;
//     // }
//     const updatedEvent = await Event.findOneAndUpdate(
//       { _id: id },
//       updatedData,
//       { new: true }
//     );
//     if (!updatedEvent) {
//       return res.status(404).json({ message: "Event not found" });
//     }
//     res.status(200).json({
//       status: "success",
//       message: "Event updated",
//       note: updatedEvent,
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({
//       message: "Server Error!",
//     });
//   }
// };
const updateEvent = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event ID format" });
  }
  const updatedEvent = await event.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  if (!updatedEvent) {
    return res.status(404).json({ message: "Event not found" });
  }

  res.status(200).json(updatedEvent);
};
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    const deletedEvent = await event.findOneAndDelete({ _id: id });
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }
    const searchedEvent = await event.findById(id);
    if (!searchedEvent) {
      return res.status(404).json({ error: "No such event" });
    }
    res.status(200).json(searchedEvent);
  } catch (e) {
    console.error(e);
    res.status(500).json({
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
};
