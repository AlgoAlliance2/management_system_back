const jwt = require('jsonwebtoken');

// User MUST be logged in
exports.requireAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        
        const decoded = jwt.verify(token, 'temp_secret_key(o_o)');
        req.userId = decoded.userId;
        req.role = decoded.role;
        next(); 
    } catch (error) {
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// If user has a token, we identify them. If not, they are a guest.
exports.optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
        try {
            const decoded = jwt.verify(token, 'temp_secret_key(o_o)');
            req.userId = decoded.userId;
        } catch (error) {
            console.log("Optional auth failed:", error.message);
        }
    }
    next();
};