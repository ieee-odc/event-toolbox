const Counter = require("../models/CounterModel");
const Workshop = require("../models/WorkshopModel");

const addWorkshop = async (req, res) => {
  try {

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalWorkshop" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const workshop = new Workshop({
      id: counter.seq,
      status:"Pending",
      ...req.body,
    });

    await workshop.save();

    res.status(201).json({
      status: "success",
      message: "Added Workshop",
      workshop: workshop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const editWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;

    const updatedWorkshop = await Workshop.findOneAndUpdate(
      { id: workshopId },
      req.body,
      { new: true }
    );

    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Workshop updated",
      workshop: updatedWorkshop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const deleteWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;

    const deletedWorkshop = await Workshop.findOneAndDelete({
      id: workshopId,
    });

    if (!deletedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Workshop deleted",
      workshop: deletedWorkshop,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getSpaceWorkshops = async (req, res) => {
  try {
    const spaceId = req.params.spaceId;
    const workshops = await Workshop.find({
      spaceId,
    });

    return res.status(200).json({
      status: "success",
      message: "Workshop retrieved",
      workshops: workshops,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getEventWorkshops = async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const workshops = await Workshop.find({
        eventId,
      });
  
      return res.status(200).json({
        status: "success",
        message: "Workshop retrieved",
        workshops: workshops,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error!",
      });
    }
  };

module.exports = {
  addWorkshop,
  deleteWorkshop,
  editWorkshop,
  getSpaceWorkshops,
  getEventWorkshops,
};
