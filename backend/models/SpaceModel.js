const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const SpaceSchema = new Schema(
    {
        id:{
            type: Number,
            required: true,
        },
        organizerId: {
            type: Number,
            required: true,
        },

        capacity: {
            type: Number,
            default: 0
        },
        name: {
            type: String,
            required: true,
        },

    },
    { timestamps: true }

);
module.exports = mongoose.model('Space', SpaceSchema);

