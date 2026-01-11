const jwt = require('jsonwebtoken');


const JWT_SECRET = process.env.JWT_SECRET || 'PlEaSe_SeTuP_tHe_EnV_fIlE';//SETEAZA FISIERUL ENV!!!!

exports.requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        req.role = decoded.role;
        next(); 
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

exports.optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            req.userId = decoded.userId;
        } catch (error) {
            console.log("Optional auth failed:", error.message);
        }
    }
    next();
};