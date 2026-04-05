const mongoose = require('mongoose');

const donorSchema = new mongoose.Schema({
  blood_group: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  last_donation: { type: String, required: true },
  name: { type: String, default: 'Anonymous Donor' },
  image: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Donor', donorSchema);
