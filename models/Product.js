const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        
    },
    price: {
        type: String, 
        
    },
    category:{ 
        type:[{
        type: String,
        enum: ['veg', 'non-veg'],
        }
   ]},
    image: {
        type: String, 
    },
    bestSeller: {
        type: String,
        
    },
    description: {
        type: String,
        trim: true,
    },
    firm:[ {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'firm',
        required: true,
    }],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
