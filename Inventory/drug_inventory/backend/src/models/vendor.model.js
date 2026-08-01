const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String },
  status: { type: String, default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vendor', vendorSchema);
