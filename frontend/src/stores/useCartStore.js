import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            coupon: null, 
            coupons: [], 
            total: 0,
            subtotal: 0,
            isCouponApplied: false,

            getCartItems: async () => {
                try {
                    const res = await axios.get("/cart");
                    if (res.data) {
                        set({ cart: res.data });
                        get().calculateTotals();
                    }
                } catch (error) {
                    console.log("Work with local shopping cart data");
                    get().calculateTotals();
                }
            },

            addToCart: async (product) => {
                const user = useUserStore.getState().user;
                if (!user) {
                    toast.error("Please login to add products to your cart");
                    return;
                }

                try {
                    await axios.post("/cart", { productId: product._id });
                    
                    set((prevState) => {
                        const existingItem = prevState.cart.find((item) => item._id === product._id);
                        const newCart = existingItem
                            ? prevState.cart.map((item) =>
                                  item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
                              )
                            : [...prevState.cart, { ...product, quantity: 1 }];
                        return { cart: newCart };
                    });
                    get().calculateTotals();
                    toast.success("Added to cart!");
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to add to cart");
                }
            },

            removeFromCart: async (productId) => {
                try {
                    await axios.delete(`/cart`, { data: { productId } });
                    set((prevState) => ({
                        cart: prevState.cart.filter((item) => item._id !== productId),
                    }));
                    get().calculateTotals();
                    toast.success("Removed from cart");
                } catch (error) {
                    toast.error("Error removing item");
                }
            },

            updateQuantity: async (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                try {
                    await axios.put(`/cart/${productId}`, { quantity });
                    set((prevState) => ({
                        cart: prevState.cart.map((item) =>
                            item._id === productId ? { ...item, quantity } : item
                        ),
                    }));
                    get().calculateTotals();
                } catch (error) {
                    toast.error("Failed to update quantity");
                }
            },

            getMyCoupon: async () => {
                try {
                    const response = await axios.get("/coupons");
                    const couponsData = Array.isArray(response.data) ? response.data : [response.data];
                    set({ coupons: couponsData.filter(Boolean) }); 
                } catch (error) {
                    console.error("Error receiving coupon", error);
                    set({ coupons: [] });
                }
            },

            applyCoupon: async (code, cartTotal) => {
                try {
                    const response = await axios.post("/coupons/validate", { code, cartTotal });
                    set({ coupon: response.data, isCouponApplied: true });
                    get().calculateTotals(); 
                    toast.success("Coupon applied successfully");
                } catch (error) {
                    toast.error(error.response?.data?.message || "Failed to apply coupon");
                }
            },

            removeCoupon: () => {
                set({ coupon: null, isCouponApplied: false });
                get().calculateTotals();
                toast.success("Coupon removed");
            },

            calculateTotals: () => {
                const { cart, coupon } = get();
                const subtotal = cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
                let total = subtotal;

                if (coupon && subtotal > 0) {
                    const discount = subtotal * (coupon.discountPercentage / 100);
                    total = subtotal - discount;
                }

                set({ subtotal, total });
            },

            resetCart: () => {
                set({ cart: [], coupon: null, coupons: [], total: 0, subtotal: 0, isCouponApplied: false });
            },

            clearCart: async () => {
                set({ cart: [], coupon: null, coupons: [], total: 0, subtotal: 0, isCouponApplied: false });
            }
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);