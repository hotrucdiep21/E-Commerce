import express from "express";
import {getCoupon} from "../controller/coupon.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, getCoupon);

export default router