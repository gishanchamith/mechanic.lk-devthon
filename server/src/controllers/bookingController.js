const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const ParkingSpot = require('../models/ParkingSpot');

// @desc    Create a parking booking
// @route   POST /api/bookings/parking
// @access  Private (Driver)
const createParkingBooking = asyncHandler(async (req, res) => {
    const { parkingSpot, startTime, endTime } = req.body;

    if (!parkingSpot || !startTime || !endTime) {
        res.status(400);
        throw new Error('Parking spot, start time and end time are required');
    }

    const spot = await ParkingSpot.findById(parkingSpot);
    if (!spot) {
        res.status(404);
        throw new Error('Parking spot not found');
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60)));
    const totalPrice = hours * spot.pricePerHour;

    const booking = await Booking.create({
        user: req.user.id,
        parkingSpot,
        startTime: start,
        endTime: end,
        totalPrice
    });

    spot.bookings.push(booking._id);
    await spot.save();

    res.status(201).json(booking);
});

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my
// @access  Private (Driver)
const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find({ user: req.user.id })
        .populate('parkingSpot', 'title location pricePerHour')
        .sort('-createdAt');
    res.json(bookings);
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Driver)
const updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    if (booking.user.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized');
    }

    booking.status = status;
    const updated = await booking.save();
    res.json(updated);
});

module.exports = {
    createParkingBooking,
    getMyBookings,
    updateBookingStatus
};
