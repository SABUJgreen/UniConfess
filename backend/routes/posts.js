const express = require('express');
const router = express.Router();
const { createPost, getFeed, getPostById, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPost);

router.get('/feed', protect, getFeed);

router.route('/:id')
    .get(protect, getPostById)
    .delete(protect, deletePost);

module.exports = router;
