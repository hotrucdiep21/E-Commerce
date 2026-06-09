import express from "express";
import { getAllProducts, getFeaturedProducts, createProduct, deleteProduct, getRecommendatedProducts, getProductsByCategory, toggleFeaturedProduct, searchProducts, autocompleteProducts, getProductById } from "../controller/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendatedProducts);
router.get("/search", searchProducts);
router.get("/search/autocomplete", autocompleteProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/:id", getProductById);

router.post("/", protectRoute, adminRoute, createProduct);

router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

router.delete("/:id", protectRoute, adminRoute, deleteProduct);

export default router;