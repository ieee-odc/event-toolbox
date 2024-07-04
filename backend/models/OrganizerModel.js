const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
  id:{
    type:Number,
    required: true
},
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', OrganizerSchema);
