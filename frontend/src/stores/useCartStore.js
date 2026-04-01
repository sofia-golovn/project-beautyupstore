import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            coupon: null,
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
                try {
                    await axios.post("/cart", { productId: product._id });
                    toast.success("The product has been added to the cart");
                } catch (error) {
                    console.log("Added locally (user not authorized)");
                }

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
            },

            removeFromCart: async (productId) => {
                try {
                    await axios.delete(`/cart`, { data: { productId } });
                } catch (error) {
                    console.log("Deleted locally");
                }

                set((prevState) => ({
                    cart: prevState.cart.filter((item) => item._id !== productId),
                }));
                get().calculateTotals();
            },

            updateQuantity: async (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }

                try {
                    await axios.put(`/cart/${productId}`, { quantity });
                } catch (error) {
                    console.log("Quantity updated locally");
                }

                set((prevState) => ({
                    cart: prevState.cart.map((item) =>
                        item._id === productId ? { ...item, quantity } : item
                    ),
                }));
                get().calculateTotals();
            },

            getMyCoupon: async () => {
                try {
                    const response = await axios.get("/coupons");
                    set({ coupon: response.data });
                } catch (error) {
                    console.error("An error occurred when receiving the coupon", error);
                }
            },

            applyCoupon: async (code) => {
                try {
                    const response = await axios.post("/coupons/validate", { code });
                    set({ coupon: response.data, isCouponApplied: true });
                    get().calculateTotals();
                    toast.success("Coupon applied!");
                } catch (error) {
                    toast.error(error.response?.data?.message || "Invalid coupon");
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
                set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
            },

            clearCart: async () => {
                set({ cart: [], coupon: null, total: 0, subtotal: 0, isCouponApplied: false });
            }
        }),
        {
            name: "cart-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({ cart: state.cart }),
        }
    )
);