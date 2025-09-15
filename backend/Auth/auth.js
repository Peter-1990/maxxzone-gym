const Gym = require('../Models/gym.js');
const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Check for token in cookies first
        let token = req.cookies.cookie_token;
        
        // If not in cookies, check Authorization header
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ 
                error: "No token provided, authorization denied" 
            });
        }

        // Verify token
        const decode = jwt.verify(token, process.env.JWT_SECRETKEY || process.env.JWT_SecretKey);
        
        // Find gym and exclude password
        const gym = await Gym.findById(decode.gym_id).select('-password');
        
        if (!gym) {
            return res.status(401).json({ 
                error: "Gym account not found" 
            });
        }

        req.gym = gym;
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                error: "Invalid token" 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                error: "Token expired" 
            });
        }

        res.status(500).json({ 
            error: "Server authentication error" 
        });
    }
}

module.exports = auth;