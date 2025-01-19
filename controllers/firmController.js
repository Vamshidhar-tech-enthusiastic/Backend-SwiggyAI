const Vendor = require('../models/Vendor');
const Firm = require('../models/Firm');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

// Add firm
const addFirm = async (req, res) => {
    try {
        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const vendorId = req.vendorId;

        if (!vendorId) {
            return res.status(400).json({ message: 'Vendor ID is required.' });
        }

        const vendor = await Vendor.findById(vendorId);
        if (!vendor) {
            return res.status(404).json({ message: 'Vendor not found.' });
        }

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id,
        });

        const savedFirm = await firm.save();
        const firmId = savedFirm._id;

        await Vendor.findByIdAndUpdate(
            vendorId,
            { firm: savedFirm._id },
            { new: true }
        );

        return res.status(201).json({
            message: 'Firm added successfully.',
            firmId,
        });
    } catch (error) {
        console.error('Error adding firm:', error);
        return res.status(500).json({ message: 'Error adding firm.', error: error.message });
    }
};

// Delete firm by ID
const deleteFirmById = async (req, res) => {
    const firmid = req.params.id;
    const deletefirm = await Firm.findByIdAndDelete(firmid);

    if (!deletefirm) {
        return res.status(404).json("Firm not found");
    }

    return res.status(200).json({ message: "Firm deleted successfully" });
};

// Get all firms
const getFirm = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        return res.status(200).json(vendors);
    } catch (error) {
        console.error('Error fetching firms:', error);
        return res.status(500).json({ message: 'Error fetching firms.', error: error.message });
    }
};

module.exports = {
    addFirm: [upload.single('image'), addFirm],
    getFirm,
    deleteFirmById,
};
