import express from "express";
import {
    createProduct,
    deleteProduct,
    updateProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getRecommendedProducts,
    toggleFeaturedProduct,
    getUniqueCategories, 
    getMaxProductPrice,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getAllProducts); 
router.get("/featured", getFeaturedProducts);
router.get("/recommendations", getRecommendedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/categories", getUniqueCategories);
router.get("/max-price", getMaxProductPrice);

router.post("/categories", protectRoute, adminRoute, getUniqueCategories); 
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);

export default router;