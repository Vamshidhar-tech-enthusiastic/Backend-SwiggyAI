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
const PORT = 9000;
dotenv.config();

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((error) => console.error('MongoDB connection error:', error));


app.use(cors());
app.use(bodyParser.json());
app.use('uploads/', express.static(path.join(__dirname, 'uploads')));
app.use('/vendor', vendorRoutes);
app.use('/firm', firmRoutes);
app.use('/product', productRoutes);

app.get('/home', (req, res) => {
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2></center>");
});

app.options('*', cors());

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
