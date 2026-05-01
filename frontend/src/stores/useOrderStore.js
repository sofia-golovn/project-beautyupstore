import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,
    totalPages: 1,
    currentPage: 1,

    fetchAllOrders: async (page = 1, status = "All") => {
    set({ loading: true });
    try {
        const res = await axios.get(`/orders/all?page=${page}&status=${status}`);
        set({ 
            orders: res.data.orders, 
            totalPages: res.data.totalPages, 
            currentPage: res.data.currentPage,
            loading: false 
        });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to fetch orders");
        }
    },

    updateStatus: async (orderId, newStatus) => {
        try {
            const res = await axios.patch(`/orders/${orderId}/status`, { status: newStatus });
            
            set((state) => ({
                orders: state.orders.map((o) => (o._id === orderId ? res.data : o)),
            }));
            
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    },

    getUserOrders: async (page = 1) => {
    set({ loading: true });
    try {
        const res = await axios.get(`/orders/my-orders?page=${page}`);
        
        set({ 
            orders: res.data.orders, 
            totalPages: res.data.totalPages, 
            currentPage: res.data.currentPage, 
            loading: false 
        });
    } catch (error) {
        set({ loading: false });
        toast.error("Failed to load your orders");
    }
    },
}));