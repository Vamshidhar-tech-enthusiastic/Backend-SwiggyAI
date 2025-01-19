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

// Cross Origin configuration to accept requests from any origin
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'token'],
    preflightContinue: true, 
    optionsSuccessStatus: 204 
}));

app.use(bodyParser.json());

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log('Uploads directory created');
}

app.get('/uploads/:imageName', (req, res) => {
    const imgName = req.params.imageName;
    if (!imgName) {
        return res.status(400).send('Image name is required');
    }
    const imagePath = path.join(__dirname, 'uploads', imgName);
    console.log('Serving image from:', imagePath);
    if (!fs.existsSync(imagePath)) {
        return res.status(404).send('Image not found');
    }
    const contentType = mime.lookup(imgName) || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*'); 
    res.sendFile(imagePath);
});

app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.get('/home', (req, res) => {
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2></center>");
});

app.options('*', cors());

const PORT = process.env.PORT || 9000; 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
