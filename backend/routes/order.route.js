import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllOrders, updateDeliveryStatus } from "../controller/order.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllOrders);
router.put("/:id/delivery-status", protectRoute, adminRoute, updateDeliveryStatus);

export default router;
