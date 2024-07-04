const express =require ('express');
const mongoose =require('mongoose');
const Form= require('../models/FormModel');
const Event= require('../models/EventModel');

// Create a new Form
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

 const createForm = async (eventId, price, data) => {
    try{
        // Check if the event exists
        const event = await Event.findById(eventId);
        if (!event) {
            throw new Error('Event not found');
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
        console.error('Error in the CreateForm controller:', error.message);
        throw error;
    }
}; 
//Get form By Id
const getFormById = async (req, res) => {
    const { formId } = req.params;
    try {
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }
        res.json(form);
    } catch (error) {
        console.error('Error in getFormById controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
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
const updateFormById =async (formId, price, date) =>{
    try{
        const updateForm =await Form.findByIdAndUpdate(
            formId,
            {price,date},
            {new : true}
        );
        if(!updateForm){
            return res.status(400).json({error: "Form not found"});
        }

    }catch(error){
        console.log("Error in the updateForm controller")
        res.status(500).json({error:"Internal Server Error"})
    }
};
const deleteFormById = async (formId) =>{
    try{
        const deletedForm =await Form.findByIdAndDelete(formId);
        if(!deletedForm){
            return res.status(400).json({error: "Form not found"});
        }

    }catch(error){
        console.log("Error in the deleteForm controller")
        res.status(500).json({error:"Internal Server Error"})
    }
};
module.exports={
    createForm,
    getFormById,
    updateFormById,
    deleteFormById
}


