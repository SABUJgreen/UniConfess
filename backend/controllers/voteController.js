const Vote = require('../models/Vote');
const Post = require('../models/Post');

// @desc    Vote on a post
// @route   POST /api/votes
// @access  Private
const votePost = async (req, res) => {
    const { postId, voteType } = req.body;

    if (!postId || !voteType || (voteType !== 1 && voteType !== -1)) {
        return res.status(400).json({ message: 'Post ID and valid voteType (1 or -1) are required' });
    }

    try {
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const existingVote = await Vote.findOne({ postId, userId: req.user._id });

        if (existingVote) {
            if (existingVote.voteType === voteType) {
                // User is trying to vote the exact same way again, just ignore or return bad request
                return res.status(400).json({ message: 'You have already voted this way' });
            }

            // User is changing their vote (e.g. from -1 to 1)
            // Reverse the old vote on the post
            if (existingVote.voteType === 1) {
                post.upvotes = Math.max(0, post.upvotes - 1);
            } else {
                post.downvotes = Math.max(0, post.downvotes - 1);
            }

            // Apply new vote
            existingVote.voteType = voteType;
            await existingVote.save();

            if (voteType === 1) {
                post.upvotes += 1;
            } else {
                post.downvotes += 1;
            }

            await post.save();
            return res.status(200).json({ message: 'Vote changed successfully', post });
        }

        // Create new vote
        await Vote.create({
            userId: req.user._id,
            postId,
            voteType
        });

        if (voteType === 1) {
            post.upvotes += 1;
        } else {
            post.downvotes += 1;
        }

        await post.save();
        res.status(201).json({ message: 'Vote added successfully', post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    votePost
};
