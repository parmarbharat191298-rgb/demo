import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

/**
 * Ensures a default admin user exists in the database.
 * Credentials: admin123@gmail.com / admin123
 */
export const seedAdmin = async () => {
  try {
    const adminEmail = "admin123@gmail.com";
    const adminPassword = "admin123";
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const hashed = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: "Admin",
        email: adminEmail,
        password: hashed,
        role: "admin",
        phone: "0000000000"
      });
      console.log("🛠️ Default Admin created: admin123@gmail.com / admin123");
    }
  } catch (err) {
    console.error("❌ Admin seeding failed:", err.message);
  }
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, phone });
    console.log(`✅ New User Registered: ${user.email} (${user.role})`);

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wallet: user.wallet, points: user.points },
    });
  } catch (err) {
    console.error("❌ Registration Error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    if (!user.isActive)
      return res.status(403).json({ success: false, message: "Account is blocked" });

    res.json({
      success: true,
      token: generateToken(user._id),
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, wallet: user.wallet, points: user.points, phone: user.phone },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};
