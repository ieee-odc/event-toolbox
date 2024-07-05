const Counter = require("../models/CounterModel");
const Workshop = require("../models/WorkshopModel");

const addWorkshop = async (req, res) => {
  try {
    const { startTime, endTime, ...rest } = req.body;

    const today = new Date();
    const startTimeDate = new Date(today);
    const endTimeDate = new Date(today);

    // Assuming startTime and endTime are provided in 'HH:mm' format
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);

    startTimeDate.setHours(startHours, startMinutes, 0, 0);
    endTimeDate.setHours(endHours, endMinutes, 0, 0);

    // Adjust for local time zone offset
    const timeZoneOffset = today.getTimezoneOffset() * 60000; // offset in milliseconds
    startTimeDate.setTime(startTimeDate.getTime() - timeZoneOffset);
    endTimeDate.setTime(endTimeDate.getTime() - timeZoneOffset);

    const counter = await Counter.findOneAndUpdate(
      { id: "autovalWorkshop" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const workshop = new Workshop({
      id: counter.seq,
      status: "Pending",
      startTime: startTimeDate,
      endTime: endTimeDate,
      ...rest,
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
    const workshops = await Workshop.find({ spaceId });

    const workshopsWithCapacity = workshops.map(workshop => {
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
      const workshops = await Workshop.find({
        eventId,
      });
      const workshopsWithCapacity = workshops.map(workshop => {
        const workshopObj = workshop.toObject(); // Convert Mongoose document to plain object
        return {
          ...workshopObj,
          capacity: 50,
        };
      });
  
      return res.status(200).json({
        status: "success",
        message: "Workshop retrieved",
        workshops: workshopsWithCapacity,
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
