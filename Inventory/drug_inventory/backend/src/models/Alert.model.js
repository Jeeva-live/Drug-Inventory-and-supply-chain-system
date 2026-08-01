const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: String,
  drug: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Inventory'
  },
  message: String,
  severity: {
    type: String,
    enum: ['LOW', 'medium', 'EXPIRING', 'CRITICAL'], // Updated to match pipeline 'medium'
    default: 'LOW'
  },
  status: {
    type: String,
    enum: ['OPEN', 'RESOLVED', 'DISMISSED'],
    default: 'OPEN'
  },
  location: String,
  ai_generated: {
    type: Boolean,
    default: false
  },
  resolved: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Alert', alertSchema);
