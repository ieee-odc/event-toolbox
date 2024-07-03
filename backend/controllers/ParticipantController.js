const Counter = require("../models/CounterModel");
const Participant = require("../models/ParticipantModel");
const fs = require("fs");

const addParticipant = async (req, res) => {
  try {
    const { noteTitle, noteDescription,noteType,userId } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({message:"No file uploaded!"});
      }

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalParticipant" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const note = new Participant({
      id: counter.seq,
      userId,
      noteTitle,
      noteDescription,
      noteType,
      noteImage: file.path,
      noteStatus: "Active",
    });

    await note.save();

    res.status(201).json({
      status: "success",
      message: "Added Participant",
      note: note,
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
    const { noteId, noteTitle, noteType, noteDescription, noteStatus } = req.body;
    let file;

    if (req.file) {
      const oldParticipant = await Participant.findOne({ id: noteId });
      if (oldParticipant && oldParticipant.noteImage) {
        fs.unlinkSync(oldParticipant.noteImage);
      }
      file = req.file.path;
    }

    const updatedData = {
      noteTitle,
      noteType,
      noteDescription,
      noteStatus,
    };

    if (file) {
      updatedData.noteImage = file;
    }

    const updatedParticipant = await Participant.findOneAndUpdate(
      { id: noteId },
      updatedData,
      { new: true }
    );

    if (!updatedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Participant updated",
      note: updatedParticipant,
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
    const noteId = req.body.noteId;

    const deletedParticipant = await Participant.findOneAndDelete({
      id: noteId,
    });

    if (!deletedParticipant) {
      return res.status(404).json({ message: "Participant not found" });
    }

    if (deletedParticipant.noteImage) {
      fs.unlinkSync(deletedParticipant.noteImage);
    }

    res.status(200).json({
      status: "success",
      message: "Participant deleted",
      note: deletedParticipant,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getUserParticipant = async (req, res) => {
  try {

    const {userId} = req.body;
    const note = await Participant.find({
      userId
    });

    return res.status(200).json({
      status: "success",
      message: "Participant retrieved",
      note: note,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

module.exports = {
  addParticipant,
  deleteParticipant,
  editParticipant,
  getUserParticipant,
};