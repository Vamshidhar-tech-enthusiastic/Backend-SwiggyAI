const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); 
    },
});

const uploade = multer({ storage: storage });

const addProduct = async(req, res) => {
    try {
        const { productName, price, category, bestSeller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;
        const firmId = req.params.firmID;
        console.log(firmId)
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(400).json({ message: 'Firm Resturant not Found.' });
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
        console.log("HAppy")
        await Firm.findByIdAndUpdate(
            firmId,
            { firm: savedProduct._id },
            { new: true }
        );

   
        return res.status(201).json({
            message: 'Product added successfully.',
        });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding Product.', error: error.message });
    }
};

const getProduct = async (req, res) => {
    try {
        const vendors = await Firm.find().populate('products'); // Populate the products array in Firm
        return res.status(200).json(vendors);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};
const getProductByFirm = async (req, res) => {
    try {
        const firmId=req.params.id;
        const firm = await Firm.findById(firmId);
        if(!firm)
        {
            return res.status(401).json("NO firm found.")
        }
        const Restaurant=firm.firmName
        const products= await Product.find({firm:firmId});
        return res.status(200).json({Restaurant,products});
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching products.', error: error.message });
    }
};
const deleteProductById=async(req,res)=>
{
    const productid=req.params.id;
    const deleteproduct=await Product.findByIdAndDelete(productid);
    if(!deleteproduct)
    {
        return res.status(401).json("product not found");
    }
}

module.exports = {
    addProduct: [uploade.single('image'), addProduct],
    getProduct,getProductByFirm,deleteProductById
};
