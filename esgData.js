const mongoose = require('mongoose');

const esgDataSchema = new mongoose.Schema({
    energyUsage: Number,
    carbonEmissions: Number,
    wasteManagement: Number,
    employeeDiversity: Number,
    governanceScore: Number,
});

// Check if the model already exists
const EsgData = mongoose.models.EsgData || mongoose.model('EsgData', esgDataSchema);

module.exports = EsgData;
