const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Middleware to parse JSON data
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/esgReports', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Basic route for testing
app.get('/', (req, res) => {
  res.send('ESG Report Backend API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const ESGReport = require('./models/ESGReport'); // Import the model

// Add a new ESG report (POST request)
app.post('/addReport', async (req, res) => {
  const newReport = new ESGReport(req.body); // Create a new report with the request data
  try {
    await newReport.save(); // Save to MongoDB
    res.status(201).send('ESG report added successfully!');
  } catch (error) {
    res.status(400).send('Error saving report: ' + error.message);
  }
});

// Get all ESG reports (GET request)
app.get('/reports', async (req, res) => {
  try {
    const reports = await ESGReport.find(); // Fetch all reports from MongoDB
    res.json(reports);
  } catch (error) {
    res.status(500).send('Error fetching reports: ' + error.message);
  }
});
