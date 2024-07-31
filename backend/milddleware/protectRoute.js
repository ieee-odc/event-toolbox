const User = require('../models/OrganizerModel.js');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");


 const protectRoute = async (req, res, next) => {
    try {
        // Get the token from the cookies
        console.log("here we go",req.cookies.jwt);
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized: Invalid token" });
        }
        console.log("test1");

        // Convert the decoded ID to a MongoDB ObjectId
        // const userId = new mongoose.Types.ObjectId(decoded.id);
        // console.log(userId);
        console.log(decoded.id);

        // Find the user by the ID in the decoded token, excluding the password field
        const user = await User.findOne({id : decoded.id}).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("test2");

        // Attach the user ID and user object to the request object
        req.user_id = decoded.id;
        req.user = user;

        next();
    } catch (error) {
        console.log("Error in protectRoute middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};
module.exports = { protectRoute };
