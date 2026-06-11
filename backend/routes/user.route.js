import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { getAllUsers, updateUserRole, deleteUser } from "../controller/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllUsers);
router.put("/:id/role", protectRoute, adminRoute, updateUserRole);
router.delete("/:id", protectRoute, adminRoute, deleteUser);

export default router;
