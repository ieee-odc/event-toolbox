const Form = require("../models/FormModel");
const User = require("../models/OrganizerModel");
const Counter = require("../models/CounterModel");
const Event = require("../models/EventModel");
const Workshop = require("../models/WorkshopModel");

const createForm = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { id: "autovalForms" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const newForm = await Form.create({
      id: counter.seq,
      ...req.body,
    });
    res.status(200).json(newForm);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateForm = async (req, res) => {
  const { formId } = req.params;

  try {
    const updatedForm = await Form.findOneAndUpdate(
      {
        id: formId,
      },
      { $set: { ...req.body } },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.status(200).json({
      form: updatedForm,
      message: "Form updated successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error updating form:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteForm = async (req, res) => {
  const { formId } = req.params;
  try {
    const deletedForm = await Form.findOneAndDelete({ id: formId });
    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.status(200).json({
      form: deletedForm,
      message: "Form deleted successfully",
      status: "success",
    });
  } catch (error) {
    console.error("Error deleting form:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getOrganizerForms = async (req, res) => {
  try {
    const { organizerId } = req.params;

    const organizer = await User.findOne({ id: organizerId });
    if (!organizer) {
      res.status(400).json({
        message: "Organizer doesn't exist!",
      });
    }
    const forms = await Form.find({ organizerId });

    res.status(200).json({
      status: "success",
      message: "Forms retrieved successfully",
      forms,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getEventForms = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ id: eventId });
    if (!event) {
      return res.status(400).json({
        message: "Event doesn't exist!",
      });
    }
    const forms = await Form.find({ eventId });

    return res.status(200).json({
      status: "success",
      message: "Forms retrieved successfully",
      forms,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

const getWorkshopForms = async (req, res) => {
  try {
    const { workshopId } = req.params;

    const workshop = await Workshop.findOne({ id: workshopId });
    if (!workshop) {
      return res.status(400).json({
        message: "Workshop doesn't exist!",
      });
    }
    const forms = await Form.find({ workshopId });

    return res.status(200).json({
      status: "success",
      message: "Forms retrieved successfully",
      forms,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      message: "Server Error!",
    });
  }
};

module.exports = {
  createForm,
  getOrganizerForms,
  updateForm,
  deleteForm,
  getEventForms,
  getWorkshopForms,
};
