import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { toggleWishlist, getWishlist } from "../controllers/wishlist.controller.js";

const router = express.Router();

router.get("/", protectRoute, getWishlist);

router.post("/", protectRoute, toggleWishlist);

export default router;