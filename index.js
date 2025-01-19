const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const mime = require('mime');
const fs = require('fs');
const vendorRoutes = require('./routes/vendorRoutes');
const firmRoutes = require('./routes/firmRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));

// CORS configuration
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    preflightContinue: true, // Allow preflight to continue
    optionsSuccessStatus: 204 // For legacy browser support
}));

app.use(bodyParser.json());

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads directory created');
}

// Image serving route
app.get('/uploads/:imageName', (req, res) => {
    const imgName = req.params.imageName;
    
    // Validate image name
    if (!imgName) {
        return res.status(400).send('Image name is required');
    }

    const imagePath = path.join(__dirname, 'uploads', imgName);

    // Log file path for debugging
    console.log('Serving image from:', imagePath);

    // Check if file exists
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }

    // Determine content type
    const contentType = mime.lookup(imgName) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');  // Add this header for images

    // Send the image file
    res.sendFile(imagePath);
});

// Routes
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

// Home route
app.get('/home', (req, res) => {
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2></center>");
});

// Handle preflight CORS requests
app.options('*', cors());

const PORT = process.env.PORT || 9000; // Default to 3000 if PORT is not set
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
