import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCouponStore = create((set) => ({
    coupons: [],
    loading: false,

    fetchAllCoupons: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/coupons/all");
            set({ coupons: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to fetch coupons");
        }
    },

    createCoupon: async (couponData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/coupons", couponData);
            set((state) => ({ 
                coupons: [res.data, ...state.coupons], 
                loading: false 
            }));
            toast.success("Coupon created successfully!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error creating coupon");
        }
    },

    deleteCoupon: async (id) => {
        if (!window.confirm("Are you sure you want to delete this coupon?")) return;
        
        try {
            await axios.delete(`/coupons/${id}`);
            set((state) => ({
                coupons: state.coupons.filter((c) => c._id !== id)
            }));
            toast.success("Coupon deleted");
        } catch (error) {
            toast.error("Failed to delete coupon");
        }
    }
}));