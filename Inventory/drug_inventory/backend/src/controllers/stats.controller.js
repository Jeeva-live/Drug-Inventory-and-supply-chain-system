const User = require("../models/User.model");

exports.getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const manufacturers = await User.countDocuments({ role: "manufacturer" });
        const warehouses = await User.countDocuments({ role: "warehouse_manager" });
        const pharmacies = await User.countDocuments({ role: "pharmacist" });
        const vendors = await User.countDocuments({ role: "vendor" });

        res.json({
            users: totalUsers,
            manufacturers,
            warehouses,
            pharmacies,
            vendors
        });
    } catch (err) {
        console.error("Stats Error:", err);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};
