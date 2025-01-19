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
const mime=require('mime')
const app = express();

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));


    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization', 'token'],
        preflightContinue: true, // Allow preflight to continue
        optionsSuccessStatus: 204 // For legacy browser support
    }));
app.use(bodyParser.json());
app.get('/uploads/:imageName', (req, res) => {
    const imgName = req.params.imageName;
    const contentType = mime.lookup(imgName) || 'application/octet-stream';

    // Log headers for debugging
    console.log(res.getHeaders());

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.sendFile(path.join(__dirname, 'uploads', imgName), (err) => {
        if (err) {
            res.status(404).send('Image not found');
        }
    });
});

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.get('/home', (req, res) => {
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2></center>");
});

app.options('*', cors());
const PORT = process.env.PORT || 9000; // Default to 3000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
