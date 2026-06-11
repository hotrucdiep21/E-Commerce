import Order from "../model/order.model.js";

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("user", "name email") // we only need name and email for the customer
            .sort({ createdAt: -1 });

        res.json({ orders });
    } catch (error) {
        console.error("Error in getAllOrders controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const updateDeliveryStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { deliveryStatus } = req.body;

        if (!["Pending", "Shipped", "Delivered"].includes(deliveryStatus)) {
            return res.status(400).json({ message: "Invalid delivery status" });
        }

        const order = await Order.findByIdAndUpdate(
            id,
            { deliveryStatus },
            { new: true }
        ).populate("user", "name email");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ order });
    } catch (error) {
        console.error("Error in updateDeliveryStatus controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
