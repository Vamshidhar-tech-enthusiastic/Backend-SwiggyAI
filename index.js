// Import required packages
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));


    app.use(cors({
        origin: '*',  // Replace with your actual frontend domain
        methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allowed methods
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    }));
    
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.get('/home', (req, res) => {
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2></center>");
});

app.options('*', cors());
