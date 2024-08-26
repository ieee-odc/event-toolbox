const Organizer = require("../models/OrganizerModel");

const getOrganizerName = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;

    const organizer = await Organizer.findOne({ id: organizerId });

    if (!organizer) {
      return res.status(404).json({
        status: "error",
        message: "Organizer not found",
      });
    }

    res.status(200).json({
      status: "success",
      name: organizer.username,
    });
  } catch (error) {
    console.error("Error fetching organizer's name", error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getOrganizers = async (req, res) => {
  const organizers = await Organizer.find({}).sort({ createdAt: -1 });
  res.status(200).json(organizers);
};



module.exports = {
  getOrganizerName,
  getOrganizers,
};
