const { User, Runner } = require('../models');

// 1. Get Admin Dashboard Data
const getAdminDashboard = async (req, res) => {
    try {
        const totalRunners = await Runner.count();
        const totalUsers = await User.count();

        res.status(200).json({
            message: "Dashboard data retrieved",
            data: {
                totalRunners,
                totalUsers
            }
        });

    } catch (error) {
        console.error("❌ Dashboard error:", error);
        res.status(500).json({ message: "Server error fetching dashboard data" });
    }
};

// 2. Penalize a Runner
const penalizeRunner = async (req, res) => {
    try {
        const { runnerId } = req.params;
        const runner = await Runner.findByPk(runnerId);

        if (!runner) {
            return res.status(404).json({ message: "Runner not found" });
        }

        runner.isPenalized = true;
        await runner.save();

        res.status(200).json({ message: "Runner penalized successfully" });

    } catch (error) {
        console.error("❌ Penalty error:", error);
        res.status(500).json({ message: "Server error during penalty" });
    }
};

// 3. Get All Runners
const getAllRunners = async (req, res) => {
    try {
        const runners = await Runner.findAll();

        res.status(200).json({
            message: "Runners retrieved successfully",
            data: runners
        });

    } catch (error) {
        console.error("❌ Error fetching runners:", error);
        res.status(500).json({ message: "Server error fetching runners" });
    }
};

module.exports = {
    getAdminDashboard,
    penalizeRunner,
    getAllRunners
};