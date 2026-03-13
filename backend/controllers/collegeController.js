const College = require('../models/College');

// @desc    Get all colleges
// @route   GET /api/colleges
// @access  Public
const getColleges = async (req, res) => {
    try {
        const colleges = await College.find({}).sort({ name: 1 });
        res.status(200).json(colleges);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getColleges
};
