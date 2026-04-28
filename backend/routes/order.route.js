import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { 
    getAllOrders, 
    updateOrderStatus, 
    getUserOrders 
} from "../controllers/order.controller.js";

const router = express.Router();

router.get("/all", protectRoute, adminRoute, getAllOrders);
router.patch("/:id/status", protectRoute, adminRoute, updateOrderStatus);

router.get("/my-orders", protectRoute, getUserOrders);

export default router;