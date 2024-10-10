import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { analyticsData } from "../controller/analytics.controller.js";

const router = express.Router();
router.get("/", protectRoute, adminRoute, analyticsData);
export default router