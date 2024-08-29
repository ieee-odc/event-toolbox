const mongoose = require('mongoose');

const OrganizerSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  googleId: { type: String, unique: true },
  provider: {
    type: String,
    required: true
  },
  role:{
    type: String,
    default: 'user',
  },
  status:{
    type: String,
    default: 'pending',
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  lastLoginAt: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('User', OrganizerSchema);
