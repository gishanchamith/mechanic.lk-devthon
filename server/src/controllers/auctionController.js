const Auction = require('../models/Auction');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const path = require('path');

// Configure Multer for image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed'));
    }
}).fields([
    { name: 'photos', maxCount: 5 },
    { name: 'images', maxCount: 5 }
]);

// @desc    Create new auction
// @route   POST /api/auctions
// @access  Private (Driver)
const createAuction = asyncHandler(async (req, res) => {
    console.log('Request to create auction received');
    upload(req, res, async function (err) {
        if (err) {
            console.log('Multer error:', err);
            return res.status(400).json({ message: err.message });
        }
        console.log('Multer processing complete. Files:', req.files?.length);
        console.log('Auction data:', req.body);

        const make = req.body.make || req.body['vehicle[make]'] || req.body['vehicle.make'];
        const model = req.body.model || req.body['vehicle[model]'] || req.body['vehicle.model'] || 'Unknown';
        const year = req.body.year || req.body['vehicle[year]'] || req.body['vehicle.year'];
        const description = req.body.description || req.body['vehicle[description]'];
        const rawDrivable = req.body.drivable ?? req.body.isDrivable ?? req.body['vehicle[drivable]'];

        // Ensure user is authorized (check middleware if needed, here Assuming req.user exists)
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const uploadedPhotos = []
            .concat(req.files?.photos || [])
            .concat(req.files?.images || []);
        const photoPaths = uploadedPhotos.map(file => `/uploads/${file.filename}`);

        // Set endsAt to 7 days from now by default if not provided
        const endsAt = new Date();
        endsAt.setDate(endsAt.getDate() + 7);

        const auction = await Auction.create({
            user: req.user._id,
            vehicle: {
                make,
                model,
                year,
                drivable: rawDrivable === 'true' || rawDrivable === true
            },
            description,
            photos: photoPaths,
            endsAt
        });

        res.status(201).json(auction);
    });
});

// @desc    Get all auctions
// @route   GET /api/auctions
// @access  Private
const getAuctions = asyncHandler(async (req, res) => {
    const auctions = await Auction.find({ status: 'Active' })
        .populate('user', 'name avatarUrl')
        .sort('-createdAt');
    res.json(auctions);
});

// @desc    Get single auction
// @route   GET /api/auctions/:id
// @access  Private
const getAuctionById = asyncHandler(async (req, res) => {
    const auction = await Auction.findById(req.params.id)
        .populate('user', 'name avatarUrl phone')
        .populate('bids.bidder', 'name avatarUrl phone');

    if (auction) {
        res.json(auction);
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

// @desc    Place a bid
// @route   POST /api/auctions/:id/bid
// @access  Private (Garage/Mechanic)
const placeBid = asyncHandler(async (req, res) => {
    console.log(`Bid request for ${req.params.id}`, req.body);
    const { amount, estimatedTime, note } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (auction) {
        if (req.user._id.toString() === auction.user.toString()) {
            res.status(400);
            throw new Error('You cannot bid on your own auction');
        }

        const bid = {
            bidder: req.user._id,
            amount: Number(amount),
            estimatedTime,
            note
        };

        auction.bids.push(bid);
        await auction.save();
        res.status(201).json(auction);
    } else {
        res.status(404);
        throw new Error('Auction not found');
    }
});

// @desc    Get logged-in driver's auctions
// @route   GET /api/auctions/driver
// @access  Private (Driver)
const getDriverAuctions = asyncHandler(async (req, res) => {
    const auctions = await Auction.find({ user: req.user._id })
        .sort('-createdAt');
    res.json(auctions);
});

// @desc    Accept a bid for an auction
// @route   PUT /api/auctions/:id/accept-bid
// @access  Private (Driver)
const acceptBid = asyncHandler(async (req, res) => {
    const { bidId } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
        res.status(404);
        throw new Error('Auction not found');
    }

    if (auction.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to accept bids for this auction');
    }

    const bidExists = auction.bids.some((bid) => bid._id.toString() === bidId);
    if (!bidExists) {
        res.status(400);
        throw new Error('Bid not found');
    }

    auction.acceptedBid = bidId;
    auction.status = 'Accepted';
    const updated = await auction.save();

    res.json(updated);
});

// @desc    Update auction status
// @route   PUT /api/auctions/:id/status
// @access  Private (Driver)
const updateAuctionStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const auction = await Auction.findById(req.params.id);

    if (!auction) {
        res.status(404);
        throw new Error('Auction not found');
    }

    if (auction.user.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to update this auction');
    }

    const allowedStatuses = ['Active', 'Accepted', 'Completed', 'Expired', 'Cancelled'];
    if (!allowedStatuses.includes(status)) {
        res.status(400);
        throw new Error('Invalid status');
    }

    auction.status = status;
    const updated = await auction.save();
    res.json(updated);
});

module.exports = {
    createAuction,
    getAuctions,
    getAuctionById,
    placeBid,
    getDriverAuctions,
    acceptBid,
    updateAuctionStatus
};
