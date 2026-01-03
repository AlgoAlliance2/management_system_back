const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { role } = req.body;
        const { id } = req.params;

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
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};