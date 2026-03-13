const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' }
}, {
    timestamps: true
});

module.exports = mongoose.model('College', collegeSchema);
