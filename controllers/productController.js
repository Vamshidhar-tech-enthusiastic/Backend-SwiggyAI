const Firm = require('../models/Firm');
const Product = require('../models/Product');
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

const uploade = multer({ storage: storage });

// Add Product to a Firm
const addProduct = async (req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmID; // Firm ID passed as a parameter in URL

        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: 'Firm (Restaurant) not found.' });
        }

        const product = new Product({
            productName,
            price,
            category,
            image,
            bestSeller,
            description,
            firm: firm._id,
        });

        const savedProduct = await product.save();

        // Linking the product with the firm
        await Firm.findByIdAndUpdate(
            firmId,
            { $push: { products: savedProduct._id } },
            { new: true }
        );

        return res.status(201).json({
            message: 'Product added successfully.',
            productId: savedProduct._id,
        });
    } catch (error) {
        console.error('Error adding product:', error);
        return res.status(500).json({ message: 'Error adding product.', error: error.message });
    }
};

// Get all products for all firms
const getProduct = async (req, res) => {
    try {
        const firms = await Firm.find().populate('products'); // Populate the products array in Firm
        return res.status(200).json(firms);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};

// Get products by specific firm
const getProductByFirm = async (req, res) => {
    try {
        const firmId = req.params.id;
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ message: 'Firm not found.' });
        }

        const products = await Product.find({ firm: firmId });

        return res.status(200).json({
            firmName: firm.firmName,
            products,
        });
    } catch (error) {
        console.error('Error fetching products by firm:', error);
        return res.status(500).json({ message: 'Error fetching products by firm.', error: error.message });
    }
};

// Delete product by ID
const deleteProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        return res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Error deleting product.', error: error.message });
    }
};

module.exports = {
    addProduct: [uploade.single('image'), addProduct],
    getProduct,
    getProductByFirm,
    deleteProductById,
};
