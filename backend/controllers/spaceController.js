const express =require ('express');
const mongoose =require('mongoose');
const Space= require('../models/SpaceModel');
const Counter = require("../models/CounterModel");

// const Event= require('../models/EventModel');

// Create a new Space
const createSpace = async (req, res) => {
    const {orgId} = req.params;
    const { capacity, name, attitudes } = req.body;

    try {
        // Ensure the orgId is valid if necessary
         const Organizer = await user.findById(orgId);
         if (!Organizer) {
            //  throw new Error('Organizer not found');
             res.status(400).json({message:"Organizer not found"});
         }

        const newSpace = new Space({ orgId, capacity, name, attitudes });
        await newSpace.save();
        res.status(201).json(newSpace);
    } catch (error) {
        console.error('Error in createSpace controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};;
 
// // get space By Id
// const getSpaceById = async (req,res) =>{
//     const {spaceId} = req.params;
//     try{
//         const space = await Space.findById(spaceId);
//         if (!space) {
//             return res.status(404).json({ error: 'Space not found' });
//         }
//         res.status(200).json(space)
//     }catch(error){
//         console.error('Error in getSpaceById controller:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

// get space By Id
const getSpaceByOrgId = async (req,res) =>{
    const {orgId} = req.params;
    try{
        const space = await Space.findById(orgId);
        if (!space) {
            return res.status(404).json({ error: 'Space not found' });
        }
        res.status(200).json(space)
    }catch(error){
        console.error('Error in getSpaceById controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
}
// Update a Space by ID
const updateSpaceById = async (req, res) => {
    const { spaceId } = req.params;
    const { capacity, name, attitudes } = req.body;
    try {
        const updatedSpace = await Space.findByIdAndUpdate(
            spaceId,
            { capacity, name, attitudes },
            { new: true }
        );
        if (!updatedSpace) {
            return res.status(404).json({ error: 'Space not found' });
        }
        res.json(updatedSpace);
    } catch (error) {
        console.error('Error in updateSpaceById controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a Space by ID
const deleteSpaceById = async (req, res) => {
    const { spaceId } = req.params;
    try {
        const deletedSpace = await Space.findByIdAndDelete(spaceId);
        if (!deletedSpace) {
            return res.status(404).json({ error: 'Space not found' });
        }
        res.json(deletedSpace);
    } catch (error) {
        console.error('Error in deleteSpaceById controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


// // Get Form By Event 
// const getFormsByEventId = async (req,res) => {
//     const {eventId} = req.params;
//     try{
//         const forms = await Form.find({ eventId });
//         res.json(forms);
//     }catch(error){
//         console.error('Error in getFormsByEventId controller:', error.message);
//         res.status(500).json({ error: 'Internal server error' });    }
// }



module.exports={
    createSpace,
    // getSpaceById,
    getSpaceByOrgId,
    updateSpaceById,
    deleteSpaceById,
}


