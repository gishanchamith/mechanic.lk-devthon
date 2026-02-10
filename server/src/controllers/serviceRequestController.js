const asyncHandler = require('express-async-handler');
const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create service request
// @route   POST /api/service-requests
// @access  Private (Driver)
const createServiceRequest = asyncHandler(async (req, res) => {
    const { mechanicUser, vehicleDetails, issueDescription, location } = req.body;

    if (!mechanicUser || !issueDescription) {
        res.status(400);
        throw new Error('Mechanic and issue description are required');
    }

    const request = await ServiceRequest.create({
        requester: req.user.id,
        mechanicUser,
        vehicleDetails,
        issueDescription,
        location
    });

    res.status(201).json(request);
});

// @desc    Get logged-in driver's service requests
// @route   GET /api/service-requests/my
// @access  Private (Driver)
const getMyServiceRequests = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({ requester: req.user.id })
        .populate('mechanicUser', 'name phone')
        .sort('-createdAt');
    res.json(requests);
});

// @desc    Get assigned service requests for mechanic
// @route   GET /api/service-requests/assigned
// @access  Private (Garage Owner)
const getAssignedServiceRequests = asyncHandler(async (req, res) => {
    const requests = await ServiceRequest.find({ mechanicUser: req.user.id })
        .populate('requester', 'name phone')
        .sort('-createdAt');
    res.json(requests);
});

// @desc    Accept a service request
// @route   PUT /api/service-requests/:id/accept
// @access  Private (Garage Owner)
const acceptServiceRequest = asyncHandler(async (req, res) => {
    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Service request not found');
    }

    if (request.mechanicUser.toString() !== req.user.id) {
        res.status(403);
        throw new Error('Not authorized to accept this request');
    }

    request.status = 'accepted';
    const updated = await request.save();
    res.json(updated);
});

// @desc    Update service request status
// @route   PUT /api/service-requests/:id/status
// @access  Private (Driver/Mechanic)
const updateServiceRequestStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const allowedStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error(`Invalid status. Allowed: ${allowedStatuses.join(', ')}`);
    }

    const request = await ServiceRequest.findById(req.params.id);

    if (!request) {
        res.status(404);
        throw new Error('Service request not found');
    }

    const isRequester = request.requester.toString() === req.user.id;
    const isMechanic = request.mechanicUser.toString() === req.user.id;

    if (!isRequester && !isMechanic) {
        res.status(403);
        throw new Error('Not authorized');
    }

    request.status = status;
    const updated = await request.save();
    res.json(updated);
});

module.exports = {
    createServiceRequest,
    getMyServiceRequests,
    getAssignedServiceRequests,
    acceptServiceRequest,
    updateServiceRequestStatus
};
