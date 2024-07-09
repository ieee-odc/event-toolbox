const express = require("express");
const mongoose = require("mongoose");
const Form = require("../models/FormModel");
const Event = require("../models/EventModel");

/*const createForm = async (req,res) => {
    try{
     const {eventId, price, data} = req.body;
     const event = await Event.findBy(eventId);
     if (!event) {
        return res.status(400).json({error: "event does not exist"});
     }
      //create Form 
      const newForm =new Form({
        eventId,
        price,
        data
    });
    await newForm.save();
    return newForm;
 
    }catch(error){
        console.log("Error in the login controller")
        res.status(500).json({error:"Internal Server Error"})
     }
    } */
// Create a new Form
const createForm = async (eventId, description, name, data) => {
  try {
    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
      res.status(400).json({ message: "No event found" });
    }
    //create Form
    const newForm = new Form({
      eventId,
      name,
      description,
      // price,
      data,
    });
    await newForm.save();
    return newForm;
  } catch (error) {
    console.error("Error in the CreateForm controller:", error.message);
    throw error;
  }
};
//Get form By Id
const getFormById = async (req, res) => {
  const { formId } = req.params;
  try {
    const form = await Form.findById(formId);
    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(form);
  } catch (error) {
    console.error("Error in getFormById controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
// Get Form By Event
const getFormsByEventId = async (req, res) => {
  const { eventId } = req.params;
  try {
    const forms = await Form.find({ eventId });
    res.json(forms);
  } catch (error) {
    console.error("Error in getFormsByEventId controller:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// const getFormById = async (formId) =>{
//     try{
//         const form =await Form.findById(formId);
//         if(!form){
//             throw new Error('Form does not exist');
//         }
//         return form;

//     }catch(error){
//         console.log("Error in the getForm controller")
//     }
// }
// Update a form by ID
const updateFormById = async (req, res) => {
  const { formId } = req.params;
  const { description, name, data } = req.body;

  console.log("Received data for update:", { description, name, data }); // Log received data

  try {
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      { $set: { description, name, data } }, // Use $set to update the nested data map
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ error: "Form not found" });
    }

    console.log("Updated form:", updatedForm); // Log the updated form
    res.json(updatedForm); // Respond with the updated form
  } catch (error) {
    console.error("Error updating form:", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle any errors
  }
};

const deleteFormById = async (req, res) => {
  const { formId } = req.params;
  try {
    const deletedForm = await Form.findByIdAndDelete(formId);
    if (!deletedForm) {
      return res.status(404).json({ error: "Form not found" });
    }
    res.json(deletedForm); // Respond with the deleted form
  } catch (error) {
    console.error("Error deleting form:", error.message);
    res.status(500).json({ error: "Internal Server Error" }); // Handle any errors
  }
};

// const deleteFormById = async (formId) =>{
//     try{
//         const deletedForm =await Form.findByIdAndDelete(formId);
//         if(!deletedForm){
//             return res.status(400).json({error: "Form not found"});
//         }

//     }catch(error){
//         console.log("Error in the deleteForm controller")
//         res.status(500).json({error:"Internal Server Error"})
//     }
// };
module.exports = {
  createForm,
  getFormById,
  getFormsByEventId,
  updateFormById,
  deleteFormById,
};
