const bcrypt = require("bcryptjs");
const Admin = require("../backend/models/AdminModel");

const createInitialAdmin = async () => {
    const username = "admin";
    const password = "admin"; // You should change this to a more secure password in production
    const role = "superadmin";

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            username,
            password: hashedPassword,
            role,
        });

        await admin.save();

        console.log("Initial admin user created successfully");
    } catch (err) {
        console.error("Error creating initial admin user:", err);
    }
};

createInitialAdmin();