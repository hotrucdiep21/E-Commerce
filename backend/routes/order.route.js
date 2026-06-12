import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllOrders, updateDeliveryStatus, getDeliveryRoutes, mockCoordinatesForOldOrders } from "../controller/order.controller.js";

const router = express.Router();

router.get("/delivery-routes", protectRoute, adminRoute, getDeliveryRoutes);
router.post("/mock-coordinates", protectRoute, adminRoute, mockCoordinatesForOldOrders);
router.get("/", protectRoute, adminRoute, getAllOrders);
router.put("/:id/delivery-status", protectRoute, adminRoute, updateDeliveryStatus);

export default router;
