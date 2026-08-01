const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

// CREATE USER
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, location, status } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const defaultPassword = password || "Welcome@123";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const user = await User.create({
      name,
      email,
      role,
      location,
      status,
      password: hashedPassword
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      status: user.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, location, status } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role.toLowerCase();
    if (location) query.location = location;
    if (status) query.status = new RegExp(`^${status}$`, 'i');

    // Execute query with pagination
    const users = await User.find(query)
      .select("-password")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // Get total documents
    const count = await User.countDocuments(query);

    // Also get all unique locations for the filter dropdown
    const allUsers = await User.find().select('location');
    const locations = [...new Set(allUsers.map(u => u.location).filter(Boolean))];

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      totalUsers: count,
      locations
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
