const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// include role in token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// REGISTER
const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        // create user with role
        const user = await User.create({ 
            name, 
            email, 
            password, 
            role: role || 'employee'  // default employee
        });

        res.status(201).json({ 
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role,
            token: generateToken(user.id, user.role) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({ 
                id: user.id, 
                name: user.name, 
                email: user.email, 
                role: user.role,
                token: generateToken(user.id, user.role) 
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET PROFILE
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            description: user.description,
            address: user.address,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// UPDATE PROFILE
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const { name, email, description, address, role } = req.body;

        user.name = name || user.name;
        user.email = email || user.email;
        user.description = description || user.description;
        user.address = address || user.address;

        // Optional: let only admin update roles (or leave as is if users can switch role themselves)
        if (role) user.role = role;

        const updatedUser = await user.save();

        res.json({ 
            id: updatedUser.id, 
            name: updatedUser.name, 
            email: updatedUser.email, 
            description: updatedUser.description, 
            address: updatedUser.address, 
            role: updatedUser.role,
            token: generateToken(updatedUser.id, updatedUser.role) 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, updateUserProfile, getProfile };
