import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const useWishlistStore = create((set, get) => ({
    wishlist: [],
    loading: false,

    getWishlist: async () => {
        const user = useUserStore.getState().user;
        if (!user) return;

        set({ loading: true });
        try {
            const res = await axios.get("/wishlist");
            set({ wishlist: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.error("Error fetching wishlist:", error);
        }
    },

    toggleWishlist: async (product) => {
        const user = useUserStore.getState().user;
        if (!user) {
            toast.error("Please login to add products to your wishlist");
            return;
        }

        try {
            await axios.post("/wishlist", { productId: product._id });
            
            const { wishlist } = get();
            const isExists = wishlist.find((item) => item._id === product._id);

            if (isExists) {
                set({ wishlist: wishlist.filter((item) => item._id !== product._id) });
                toast.success("Removed from wishlist");
            } else {
                set({ wishlist: [...wishlist, product] });
                toast.success("Added to wishlist");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    },

    isInWishlist: (productId) => {
        return get().wishlist.some((item) => item._id === productId);
    },

    removeFromWishlist: async (productId) => {
        try {
            await axios.post("/wishlist", { productId });
            set({ wishlist: get().wishlist.filter((item) => item._id !== productId) });
            toast.success("Removed from wishlist");
        } catch (error) {
            toast.error("Failed to remove product");
        }
    },

    clearWishlist: () => set({ wishlist: [] }),
}));