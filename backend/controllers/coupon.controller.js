import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

export const getCoupon = async (req, res) => {
    try {
        const coupons = await Coupon.find({ 
            $or: [ { userId: req.user._id }, { userId: null } ], 
            isActive: true, 
            expirationDate: { $gt: new Date() } 
            
        }).sort({ discountPercentage: -1 }); // sort from highest discount to lowest

        res.json(coupons[0] || null); 
    } catch (error) {
        console.log("Error in getCoupon controller:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const validateCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;
        
        const coupon = await Coupon.findOne({ code: code, isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }

        if (coupon.expirationDate < new Date()) {
            coupon.isActive = false;
            await coupon.save();
            return res.status(404).json({ message: "Coupon expired" });
        }

        if (cartTotal < coupon.minimumPurchaseAmount) {
            return res.status(400).json({ 
                message: `Minimum purchase amount for this coupon is $${coupon.minimumPurchaseAmount}` 
            });
        }

        if (coupon.isFirstOrderOnly) {
            const existingOrder = await Order.findOne({ userId: req.user._id });
            if (existingOrder) {
                return res.status(400).json({ message: "This coupon is only for your first order" });
            }
        }

        if (coupon.userId && coupon.userId.toString() !== req.user._id.toString()) {
            return res.status(404).json({ message: "This coupon is not valid for your account" });
        }

        res.json({
            message: "Coupon is valid",
            code: coupon.code,
            discountPercentage: coupon.discountPercentage,
        });
    } catch (error) {
        console.log("Error in validateCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const createCoupon = async (req, res) => {
    try {
        const { code, discountPercentage, expirationDate, minimumPurchaseAmount, isFirstOrderOnly } = req.body;

        if (discountPercentage < 1) {
            return res.status(400).json({ message: "Minimum discount percentage must be at least 1%" });
        }
        if (discountPercentage > 100) {
            return res.status(400).json({ message: "Maximum discount percentage cannot exceed 100%" });
        }

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: "Coupon code already exists" });
        }

        const newCoupon = new Coupon({
            code: code.toUpperCase(),
            discountPercentage,
            expirationDate,
            minimumPurchaseAmount: minimumPurchaseAmount || 0,
            isFirstOrderOnly: isFirstOrderOnly || false,
            isActive: true,
        });

        await newCoupon.save();
        res.status(201).json(newCoupon);
    } catch (error) {
        console.log("Error in createCoupon controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.log("Error in getAllCoupons controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found" });
        }
        res.json({ message: "Coupon deleted successfully" });
    } catch (error) {
        console.log("Error in deleteCoupon controller", error.message);
        res.status(500).json({ message: "Server error" });
    }
};