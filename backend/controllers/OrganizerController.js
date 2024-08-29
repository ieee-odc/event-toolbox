const Organizer = require("../models/OrganizerModel");

const getOrganizerName = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    const organizer = await Organizer.findOne({ id: organizerId });

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.status(200).json({ name: organizer.username });
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

const getOrganizers = async (req, res) => {
  try {
    const organizers = await Organizer.find({ status: "pending" }).sort({ createdAt: -1 });
    res.status(200).json(organizers);
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

const approveOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    const organizer = await Organizer.findOneAndUpdate(
      { id: organizerId },
      { status: "approved" },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

const declineOrganizer = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    const organizer = await Organizer.findOneAndUpdate(
      { id: organizerId },
      { status: "declined" },
      { new: true }
    );

    if (!organizer) {
      return res.status(404).json({ message: "Organizer not found" });
    }

    res.status(200).json(organizer);
  } catch (error) {
    res.status(500).json({ message: "Server Error!" });
  }
};

module.exports = {
  getOrganizerName,
  getOrganizers,
  approveOrganizer,
  declineOrganizer,
};
