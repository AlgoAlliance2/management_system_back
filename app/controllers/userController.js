const User = require('../models/User');
const mongoose = require('mongoose'); // Adaugam importul mongoose

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error); // Log error
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

        // 1. Validare ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid User ID format' });
        }

        // 2. Validare Rol
        const validRoles = ['student', 'professor', 'organizer', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error updating role:", error); // Log error in terminal
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};