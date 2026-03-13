const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    realName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    passwordHash: { type: String, required: true },
    alias: { type: String, required: true, unique: true },
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isBanned: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Custom transformation to exclude sensitive data when converting to JSON
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.passwordHash;
        delete ret.realName;
        delete ret.email;
        delete ret.phone;
        return ret;
    }
});

module.exports = mongoose.model('User', userSchema);
