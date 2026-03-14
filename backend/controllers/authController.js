const User = require('../models/User');
const College = require('../models/College');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { realName, email, phone, password, alias, collegeId: providedCollegeId, collegeName } = req.body;

    if (!realName || !password || !alias || (!providedCollegeId && !collegeName) || (!email && !phone)) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const normalizedEmail = email ? email.trim().toLowerCase() : undefined;
        const normalizedAlias = alias ? alias.trim() : alias;
        let collegeId = providedCollegeId;
        if (!collegeId && collegeName) {
            const trimmedName = collegeName.trim();
            if (!trimmedName) {
                return res.status(400).json({ message: 'College name is required' });
            }

            const existingCollege = await College.findOne({
                name: new RegExp(`^${escapeRegex(trimmedName)}$`, 'i')
            });

            if (existingCollege) {
                collegeId = existingCollege._id;
            } else {
                const createdCollege = await College.create({
                    name: trimmedName,
                    city: 'Unknown',
                    state: 'Unknown'
                });
                collegeId = createdCollege._id;
            }
        }

        // Check if email/alias/phone already exists
        if (normalizedAlias) {
            const aliasExists = await User.findOne({ alias: normalizedAlias });
            if (aliasExists) {
                return res.status(400).json({ message: 'Alias already taken' });
            }
        }

        if (normalizedEmail) {
            const emailExists = await User.findOne({ email: normalizedEmail });
            if (emailExists) {
                return res.status(400).json({ message: 'Email already used' });
            }
        }

        if (phone) {
            const phoneExists = await User.findOne({ phone });
            if (phoneExists) {
                return res.status(400).json({ message: 'Phone already used' });
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            realName,
            email: normalizedEmail,
            phone,
            passwordHash,
            alias: normalizedAlias,
            collegeId
        });

        if (user) {
            res.status(201).json({
                _id: user.id,
                alias: user.alias,
                collegeId: user.collegeId,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        if (error && error.code === 11000) {
            const field = Object.keys(error.keyPattern || {})[0] || 'field';
            const message = field === 'email'
                ? 'Email already used'
                : field === 'alias'
                    ? 'Alias already taken'
                    : 'User already exists';
            return res.status(400).json({ message });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
        return res.status(400).json({ message: 'Please provide credentials' });
    }

    try {
        // Find user by email or phone
        let query = {};
        if (email) query.email = email;
        else if (phone) query.phone = phone;

        const user = await User.findOne(query);

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            if (user.isBanned) {
                return res.status(403).json({ message: 'Account is banned' });
            }

            res.json({
                _id: user.id,
                alias: user.alias,
                collegeId: user.collegeId,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
    // req.user is populated by protect middleware
    // Due to the toJSON transform in schema, sensitive data is removed automatically
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe
};
