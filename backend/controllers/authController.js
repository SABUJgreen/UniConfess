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

        // Check if user exists
        const userExists = await User.findOne({
            $or: [
                { email: email || null },
                { phone: phone || null },
                { alias }
            ]
        });

        if (userExists) {
            if (userExists.alias === alias) {
                return res.status(400).json({ message: 'Alias already taken' });
            }
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            realName,
            email,
            phone,
            passwordHash,
            alias,
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
