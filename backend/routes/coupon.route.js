import express from "express";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import { 
    getCoupon, 
    validateCoupon, 
    createCoupon, 
    getAllCoupons, 
    deleteCoupon 
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCoupon);

router.get("/all", protectRoute, getAllCoupons);

router.post("/validate", protectRoute, validateCoupon);

router.post("/", protectRoute, adminRoute, createCoupon);
router.delete("/:id", protectRoute, adminRoute, deleteCoupon);

export default router;