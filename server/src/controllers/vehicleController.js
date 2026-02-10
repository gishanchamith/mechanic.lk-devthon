const asyncHandler = require('express-async-handler');
const Vehicle = require('../models/Vehicle');

// @desc    Get user's vehicles
// @route   GET /api/vehicles
// @access  Private
const getVehicles = asyncHandler(async (req, res) => {
    const vehicles = await Vehicle.find({ user: req.user.id }).sort('-createdAt');
    res.json(vehicles);
});

// @desc    Add a vehicle
// @route   POST /api/vehicles
// @access  Private
const addVehicle = asyncHandler(async (req, res) => {
    const { make, model, year, plate } = req.body;

    if (!make || !model || !year) {
        res.status(400);
        throw new Error('Make, model and year are required');
    }

    const vehicle = await Vehicle.create({
        user: req.user.id,
        make,
        model,
        year,
        plate: plate || ''
    });

    res.status(201).json(vehicle);
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user.id });

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    const { make, model, year, plate } = req.body;
    vehicle.make = make || vehicle.make;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;
    vehicle.plate = plate !== undefined ? plate : vehicle.plate;

    const updated = await vehicle.save();
    res.json(updated);
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, user: req.user.id });

    if (!vehicle) {
        res.status(404);
        throw new Error('Vehicle not found');
    }

    await vehicle.deleteOne();
    res.json({ message: 'Vehicle removed' });
});

module.exports = {
    getVehicles,
    addVehicle,
    updateVehicle,
    deleteVehicle
};
