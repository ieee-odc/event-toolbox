const Counter = require("../models/CounterModel");
const Workshop = require("../models/WorkshopModel");
const Space = require("../models/SpaceModel");

const addWorkshop = async (req, res) => {
  try {
    let { startTime, endTime,spaceId, ...rest } = req.body;

    if (!(startTime instanceof Date)) {
      startTime = new Date(startTime);
    }
    if (!(endTime instanceof Date)) {
      endTime = new Date(endTime); 
    }
    

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalWorkshop" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const space=await Space.findOne({id:spaceId});

    console.log({
      id: counter.seq,
      status: "Pending",
      startTime,
      endTime,
      space,
      spaceId,
      ...rest,
    })
    const workshop = new Workshop({
      id: counter.seq,
      status: "Pending",
      startTime,
      endTime,
      space,
      spaceId,
      ...rest,
    });

    await workshop.save();

    res.status(201).json({
      status: "success",
      message: "Added Workshop",
      workshop,
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

    const space=await Space.findOne({id:req.body.spaceId});


    if (!updatedWorkshop) {
      return res.status(404).json({ message: "Workshop not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Workshop updated",
      workshop: {
        ...updatedWorkshop,
        space
      },
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
    const workshops = await Workshop.find({ spaceId });

    const workshopsWithCapacity = workshops.map((workshop) => {
      const workshopObj = workshop.toObject(); // Convert Mongoose document to plain object
      return {
        ...workshopObj,
        capacity: 50,
      };
    });

    return res.status(200).json({
      status: "success",
      message: "Workshops retrieved",
      workshops: workshopsWithCapacity,
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
    const workshops = await Workshop.find({ eventId });
    
    const workshopsWithCapacity = await Promise.all(workshops.map(async (workshop) => {
      const workshopObj = workshop.toObject();
      const workshopSpace = await Space.findOne({ id: workshop.spaceId });
      return {
        ...workshopObj,
        space: workshopSpace
      };
    }));

    console.log(workshopsWithCapacity)
    res.status(200).json({
      status:"success",
      message:"Retrieved workshops",
      workshops:workshopsWithCapacity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching workshops', error });
  }
};


const getOrganizerWorkshops = async (req, res) => {
  try {
    const organizerId = req.params.organizerId;
    const workshops = await Workshop.find({
      organizerId,
    });
    const workshopsWithCapacity = await Promise.all(workshops.map(async (workshop) => {
      const workshopObj = workshop.toObject();
      const workshopSpace = await Space.findOne({ id: workshop.spaceId });
      return {
        ...workshopObj,
        space: workshopSpace
      };
    }));

    console.log(workshopsWithCapacity)
    res.status(200).json({
      status:"success",
      message:"Retrieved workshops",
      workshops:workshopsWithCapacity
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getOneWorkshop = async (req, res) => {
  try {
    const workshopId = req.params.workshopId;
    const workshop = await Workshop.findOne({ id: workshopId });
    if (!workshop) {
      return res.status(400).json({
        message: "Workshop doesn't exist!",
      });
    }
    return res.status(200).json({
      status: "success",
      message: "Workshop retrieved",
      workshop,
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
  getOrganizerWorkshops,
  getOneWorkshop,
};
