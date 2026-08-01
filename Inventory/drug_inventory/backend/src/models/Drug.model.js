const mongoose = require('mongoose');

const drugSchema = new mongoose.Schema({
    name: String,
    batch_no: { type: String, unique: true },
    manufacturer: String,
    mfg_date: Date,
    expiry_date: Date,
    qr_code: { type: String, unique: true },
    unit_price: Number
});

module.exports = mongoose.model('Drug', drugSchema);
