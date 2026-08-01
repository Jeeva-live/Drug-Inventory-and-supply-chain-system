const mongoose = require('mongoose');

const stockLogSchema = new mongoose.Schema({
  drug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory',
    required: true
  },
  action: {
    type: String,
    enum: ['IN', 'OUT', 'ADJUST', 'RETURN'],
    required: true
  },
  quantity: Number,
  role: String, // pharmacy, vendor, admin
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StockLog', stockLogSchema);
