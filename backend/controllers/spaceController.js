const express =require ('express');
const mongoose =require('mongoose');
const Space= require('../models/SpaceModel');
// const Counter = require("../models/CounterModel");
const Organizer = require('../models/OrganizerModel');

// Create a new Space
const createSpace = async (req, res) => {
    const {orgId} = req.params;
    const { capacity, name } = req.body;

    try {
        // Ensure the orgId is valid if necessary
         const organizer = await Organizer.findById(orgId);
         if (!organizer) {
            //  throw new Error('Organizer not found');
             res.status(400).json({message:"Organizer not found"});
         }

        const newSpace = new Space({ orgId, capacity, name });
        await newSpace.save();
        res.status(201).json(newSpace);
    } catch (error) {
        console.error('Error in createSpace controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};;
 

// get space By Organizer Id
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
    const { capacity, name } = req.body;
    try {
        const updatedSpace = await Space.findByIdAndUpdate(
            spaceId,
            { capacity, name },
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

// Filter spaces by organizer ID
const filterByOrgId = async (req, res) => {
    const { orgId } = req.params;
    const filter = req.query; // Additional filters can be passed as query parameters

    try {
        const spaces = await Space.find({ orgId, ...filter });
        if (!spaces.length) {
            return res.status(404).json({ error: 'No spaces found matching the criteria' });
        }
        res.status(200).json(spaces);
    } catch (error) {
        console.error('Error in filterByOrgId controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};



module.exports={
    createSpace,
    getSpaceByOrgId,
    updateSpaceById,
    deleteSpaceById,
    filterByOrgId
}


