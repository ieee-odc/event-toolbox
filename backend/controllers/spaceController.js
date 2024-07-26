const Space = require('../models/SpaceModel');
const Counter = require("../models/CounterModel");
const Organizer = require('../models/OrganizerModel');
const Workshop = require('../models/WorkshopModel');

// Create a new Space
const createSpace = async (req, res) => {
    try {
        const organizer = await Organizer.findOne({id:req.body.organizerId});
        if (!organizer) {
            res.status(400).json({ message: "Organizer not found" });
        }

        const counter = await Counter.findOneAndUpdate(
            { id: "autovalSpaces" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const newSpace = new Space({ id: counter.seq, ...req.body });
        await newSpace.save();
        res.status(201).json({
            status: "success",
            message: "Added Space",
            space:newSpace
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};;


// get space By Organizer Id
const getSpaceByOrgId = async (req, res) => {
    const { organizerId } = req.params;
    try {

        const spaces = await Space.find({ organizerId });

        res.status(200).json({
            message: "Spaces retrieved successfully",
            status:"success",
            spaces
        });
    } catch (error) {
        console.error('Error fetching spaces:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
// Update a Space by ID
const updateSpaceById = async (req, res) => {
    const { spaceId } = req.params;
    try {
        const updatedSpace = await Space.findOneAndUpdate(
            {id:spaceId},
            { ...req.body},
            { new: true }
        );
        if (!updatedSpace) {
            return res.status(404).json({ error: 'Space not found' });
        }
        res.status(200).json({
            status:"success",
            message:"Space updated successfully",
            space:updatedSpace
        });
    } catch (error) {
        console.error('Error in updateSpaceById controller:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete a Space by ID
const deleteSpaceById = async (req, res) => {
    const { spaceId } = req.params;
    try {
      // Find and delete the space
      const deletedSpace = await Space.findOneAndDelete({ id: spaceId });
      if (!deletedSpace) {
        return res.status(404).json({ error: 'Space not found' });
      }
  
      // Update Workshops with the deleted spaceId
      await Workshop.updateMany({ spaceId: spaceId }, { $set: { spaceId: null } });
  
      res.status(200).json({
        space: deletedSpace,
        message: "Space deleted successfully and related workshops updated",
        status: "success"
      });
    } catch (error) {
      console.error('Error in deleteSpaceById controller:', error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const getEventSpaces = async (req, res) => {
    try {
      const eventId = req.params.eventId;
      const spaces = await Space.find({
        eventId,
      });
  
      return res.status(200).json({
        status: "success",
        message: "Participant retrieved",
        spaces
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({
        message: "Server Error!",
      });
    }
  };


module.exports = {
    createSpace,
    getSpaceByOrgId,
    updateSpaceById,
    deleteSpaceById,
    getEventSpaces
}


