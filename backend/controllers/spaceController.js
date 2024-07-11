const Space = require('../models/SpaceModel');
const Counter = require("../models/CounterModel");
const Organizer = require('../models/OrganizerModel');

// Create a new Space
const createSpace = async (req, res) => {
    const { capacity, name, organizerId } = req.body;
    try {
        const organizer = await Organizer.findOne({id:organizerId});
        if (!organizer) {
            res.status(400).json({ message: "Organizer not found" });
        }

        const counter = await Counter.findOneAndUpdate(
            { id: "autovalSpaces" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        const newSpace = new Space({ id: counter.seq, organizerId, capacity, name });
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
            spaces,
            message: "Spaces retrieved successfully",
            status:"success"
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
        const updatedSpace = await Space.findByIdAndUpdate(
            spaceId,
            { ...req.body},
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

// // Filter spaces by organizer ID
// const filterByOrgId = async (req, res) => {
//     const { orgId } = req.params;
//     const filter = req.query; // Additional filters can be passed as query parameters

//     try {
//         const spaces = await Space.find({ orgId, ...filter });
//         if (!spaces.length) {
//             return res.status(404).json({ error: 'No spaces found matching the criteria' });
//         }
//         res.status(200).json(spaces);
//     } catch (error) {
//         console.error('Error in filterByOrgId controller:', error.message);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// };

module.exports = {
    createSpace,
    getSpaceByOrgId,
    updateSpaceById,
    deleteSpaceById,
    // filterByOrgId
}


