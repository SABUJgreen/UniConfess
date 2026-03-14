const express = require('express');
const router = express.Router();
const { createPost, getFeed, getPostById, deletePost } = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createPost);

router.get('/feed', getFeed);

router.route('/:id')
    .get(getPostById)
    .delete(protect, deletePost);

module.exports = router;
