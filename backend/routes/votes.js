const express = require('express');
const router = express.Router();
const { votePost } = require('../controllers/voteController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, votePost);

module.exports = router;
