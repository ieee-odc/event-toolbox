const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const FormSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    data: {
        type: Array(String),
    },
    deadline: {
        type: Date,
        required: false,
    },
    organizerId: {
        type: Number,
        required: true,
    },
    eventId: {
        type: Number,
        required: false,
    },
});
module.exports = mongoose.model("Form", FormSchema);