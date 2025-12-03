const User = require('../models/User');

exports.createUser = async (req, res) => {
    try {
        // Can create Student, Organizer or Admin
        const user = new User(req.body);// to do encript password!!!!
        await user.save();
        res.status(200).json({ "message": "User created successfully", "id": user._id });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        // For Admin to manage accounts 
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // to do encript password!!!!
        if (!user) return res.status(401).json({ error: "Invalid credentials" });
        
        res.json({ message: "Login successful", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};