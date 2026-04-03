import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { toast } from "react-hot-toast";

export const useWishlistStore = create(
    persist(
        (set, get) => ({
            wishlist: [],

            toggleWishlist: (product) => {
                const { wishlist } = get();
                const isExists = wishlist.find((item) => item._id === product._id);

                if (isExists) {
                    set({ wishlist: wishlist.filter((item) => item._id !== product._id) });
                    toast.success("Видалено зі списку бажань");
                } else {
                    set({ wishlist: [...wishlist, product] });
                    toast.success("Додано до списку бажань");
                }
            },

            isInWishlist: (productId) => {
                return get().wishlist.some((item) => item._id === productId);
            },

            removeFromWishlist: (productId) => {
                set({ wishlist: get().wishlist.filter((item) => item._id !== productId) });
            },

            clearWishlist: () => set({ wishlist: [] }),
        }),
        {
            name: "wishlist-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);