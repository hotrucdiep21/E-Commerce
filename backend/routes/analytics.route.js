import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData } from "../controller/analytics.controller.js";

const router = express.Router();
router.get("/", protectRoute, adminRoute, getAnalyticsData);
export default router