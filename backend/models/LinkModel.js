const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true
  },
  expirationDate: {
    type: Date,
    required: true
  },
  link: {
    type: String,
    required: true,
    unique: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Link', linkSchema);
