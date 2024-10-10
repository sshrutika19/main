// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const esgRoutes = require('./routes/esgRoutes'); // Import the route handlers

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());
app.use(express.static('uploads')); // Serve uploaded files statically

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/esgDB')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('MongoDB connection error:', err));


// Define a Mongoose schema and model for ESG data
const esgSchema = new mongoose.Schema({
    energyUsage: Number,
    carbonEmissions: Number,
    wasteManagement: Number,
    employeeDiversity: Number,
    governanceScore: Number,
});

// Ensure the model is defined only once
const EsgData = mongoose.models.EsgData || mongoose.model('EsgData', esgSchema);

// Route to handle manual input
app.post('/api/esg-data', async (req, res) => {
    try {
        const newEsgData = new EsgData(req.body);
        await newEsgData.save();
        res.status(201).json({ message: 'ESG data submitted successfully!' });
    } catch (error) {
        console.error('Error saving ESG data:', error);
        res.status(500).json({ message: 'Error saving ESG data.' });
    }
});

// Route to handle file upload
app.post('/api/upload', async (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({ message: 'No files were uploaded.' });
    }

    const uploadedFile = req.files.file;

    // Move the uploaded file to the uploads directory
    uploadedFile.mv(`uploads/${uploadedFile.name}`, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error moving the file.' });
        }
        res.json({ message: 'File uploaded successfully!', fileName: uploadedFile.name });
    });
});

// Use the ESG routes
app.use('/api', esgRoutes);

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


