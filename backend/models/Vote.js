const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    voteType: { type: Number, enum: [1, -1], required: true }
}, {
    timestamps: true
});

// A user can vote on a post only once
voteSchema.index({ userId: 1, postId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', voteSchema);
