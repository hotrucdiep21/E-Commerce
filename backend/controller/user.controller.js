import User from "../model/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select("-password");
        res.json({ users });
    } catch (error) {
        console.error("Error in getAllUsers controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!["admin", "customer"].includes(role)) {
            return res.status(400).json({ message: "Invalid role" });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { role },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error("Error in updateUserRole controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error in deleteUser controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
