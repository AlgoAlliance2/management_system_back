const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const JWT_SECRET = process.env.JWT_SECRET || 'PlEaSe_SeTuP_tHe_EnV_fIlE!';//SETEAZA FISIERUL ENV!!!!

const createToken = (id, role) => { 
    return jwt.sign({ userId: id, role: role }, JWT_SECRET, { expiresIn: '3d' });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            role 
        });
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

        const user = await User.findOne({ email }); 

        if (!user) {
            return res.status(401).json({ message: "Email sau parolă incorectă" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Email sau parolă incorectă" });
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
        const user = await User.findById(req.userId).select('-password');
        
        if (!user) return res.status(404).json({ message: "User not found" });

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