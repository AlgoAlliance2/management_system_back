const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        //GET all users, excluding password for security
        const users = await User.find().select('-password').lean();
        
        // Extra test to ensure users were found
        if (!users) {
             return res.status(404).json({ message: 'No users found' });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};