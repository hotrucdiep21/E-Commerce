import Order from "../model/order.model.js";
import { clusterOrders, calculateShortestPath } from "../utils/algorithms.js";
import { geocodeAddress } from "../utils/geocoder.js";

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

// WAREHOUSE LOCATION (Center of HCMC for demo)
const WAREHOUSE_LOCATION = { lat: 10.762622, lng: 106.660172 };

export const getDeliveryRoutes = async (req, res) => {
    try {
        // Fetch all pending orders that have locations
        const pendingOrders = await Order.find({ deliveryStatus: "Pending" })
            .populate("user", "name email")
            .lean();

        // Filter out orders without location
        const ordersWithLocation = pendingOrders.filter(o => o.location && o.location.lat && o.location.lng);

        if (ordersWithLocation.length === 0) {
            return res.json({ message: "No pending orders with locations found.", routes: [] });
        }

        // 1. Cluster the orders (max 5 per cluster)
        const clusters = clusterOrders(ordersWithLocation, 5);

        // 2. Find shortest path for each cluster
        const routes = clusters.map((cluster, index) => {
            const { route, totalDistance } = calculateShortestPath(WAREHOUSE_LOCATION, cluster);
            return {
                clusterId: index + 1,
                numOrders: cluster.length,
                totalDistanceKm: totalDistance,
                route: route
            };
        });

        res.json({
            warehouse: WAREHOUSE_LOCATION,
            totalOrders: ordersWithLocation.length,
            totalRoutes: routes.length,
            routes: routes
        });
    } catch (error) {
        console.error("Error in getDeliveryRoutes controller:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const mockCoordinatesForOldOrders = async (req, res) => {
    try {
        // Find orders that don't have a location OR have the default warehouse location (due to previous API rate limits)
        const orders = await Order.find({
            $or: [
                { location: { $exists: false } },
                { 'location.lat': 10.762622, 'location.lng': 106.660172 }
            ]
        });
        let updatedCount = 0;

        for (let order of orders) {
            if (order.shippingAddress && order.shippingAddress !== "Not Provided") {
                const location = await geocodeAddress(order.shippingAddress);
                if (location) {
                    order.location = location;
                } else {
                    order.location = WAREHOUSE_LOCATION;
                }
            } else {
                order.location = WAREHOUSE_LOCATION;
            }
            await order.save();
            updatedCount++;
            
            // Add a 1-second delay to respect OpenStreetMap Nominatim rate limit (1 req/sec)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        res.json({ message: `Successfully updated real coordinates for ${updatedCount} old orders.` });
    } catch (error) {
        console.error("Error mocking coordinates:", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
