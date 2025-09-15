const Gym = require('../Models/gym.js');
const jwt = require('jsonwebtoken');


const auth = async (req, res, next) => {
    try {
        const token = req.cookies.cookie_token;

        if (!token) {
            return res.status(401).json({ error: "No token, authorization denied" });
        }

        const decode = jwt.verify(token, process.env.JWT_SecretKey);

        req.gym = await Gym.findById(decode.gym_id).select('-password');

        if (!req.gym) {
            return res.status(401).json({ error: "Gym not found" });
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(401).json({ error: "Token is not valid" });
    }
}

module.exports = auth;