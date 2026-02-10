const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: [true, 'Please provide vehicle make']
    },
    model: {
        type: String,
        required: [true, 'Please provide vehicle model']
    },
    year: {
        type: String,
        required: [true, 'Please provide vehicle year']
    },
    plate: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
