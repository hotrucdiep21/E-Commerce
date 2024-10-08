import express from "express";
import { addToCart, updateQuantity, removeAllFromCart, getCartProducts } from "../controller/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.delete("/:id", protectRoute, removeAllFromCart);
router.put("/", protectRoute, updateQuantity);
export default router