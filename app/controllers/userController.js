const User = require('../models/User');
const jwt = require('jsonwebtoken');

// for token generation
const createToken = (id, role) => {
    return jwt.sign({ userId: id, role: role }, 'temp_secret_key(o_o)', { expiresIn: '3d' });//inprove THIS!!!!!!
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Password inprovement!!!!!
        const user = new User({ name, email, password, role });
        await user.save();
        
        const token = createToken(user._id, user.role);
        
        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password }); // Password inprovement!!!!!

        if (!user) {
            return res.status(401).json({
                message: "Email sau parola incorecta"
            });
        }

        const token = createToken(user._id, user.role);

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ 
            message: "User not found" 
        });

        res.status(200).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};