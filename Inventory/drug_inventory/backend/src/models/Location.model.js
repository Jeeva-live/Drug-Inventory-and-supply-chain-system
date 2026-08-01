const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String, // 'pharmacy', 'warehouse'
        required: true
    },
    vendor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User' // Assuming vendor is a User or separate Vendor model
    },
    address: String
});

module.exports = mongoose.model('Location', locationSchema);
