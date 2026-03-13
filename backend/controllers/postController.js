const Post = require('../models/Post');
const Vote = require('../models/Vote');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
    const { category, content } = req.body;

    if (!category || !content) {
        return res.status(400).json({ message: 'Category and content are required' });
    }

    try {
        const post = await Post.create({
            authorId: req.user._id,
            alias: req.user.alias,
            collegeId: req.user.collegeId,
            category,
            content
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get feed (all posts from user's college + other colleges based on filter)
// @route   GET /api/posts/feed
// @access  Private
const getFeed = async (req, res) => {
    const { filter = 'hot' } = req.query; // 'hot', 'new', 'top'
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    try {
        let sortQuery = {};

        switch (filter) {
            case 'new':
                sortQuery = { createdAt: -1 };
                break;
            case 'top':
                // simple sort by upvotes
                sortQuery = { upvotes: -1, createdAt: -1 };
                break;
            case 'hot':
            default:
                // very simple pseudo-hot algo: upvotes override time heavily. In a real app you'd calculate a score
                sortQuery = { upvotes: -1, createdAt: -1 };
                break;
        }

        const posts = await Post.find({})
            .populate('collegeId', 'name city state')
            .sort(sortQuery)
            .skip(skip)
            .limit(limit);

        const total = await Post.countDocuments();

        res.status(200).json({
            posts,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('collegeId', 'name city state');
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private (author or admin)
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check user
        if (post.authorId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();

        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getFeed,
    getPostById,
    deletePost
};
