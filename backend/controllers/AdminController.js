const Admin = require("../models/AdminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminLogin = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ msg: "Username and password are required" });
    }

    try {
        const admin = await Admin.findOne({ username });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const payload = { id: admin._id, username: admin.username, role: admin.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        admin.lastLoginAt = new Date();
        await admin.save();

        res.status(200).json({ token, user: { username: admin.username, role: admin.role } });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};
module.exports = {
    adminLogin,
};
