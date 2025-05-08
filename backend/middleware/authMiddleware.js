const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path

exports.protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ message: "Not authorized, invalid token" });
        }

        console.log("Decoded token:", decoded); // Debugging

        // Ensure User is correctly imported and found
        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found, unauthorized" });
        }

        console.log("User found:", user); // Debugging

        req.user = user;
        next();
    } catch (err) {
        console.error("Auth Middleware Error:", err);
        return res.status(401).json({ message: "Not authorized, token failed", error: err.message });
    }
};
