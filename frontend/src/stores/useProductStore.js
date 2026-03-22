import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set) => ({
    products: [],
    featuredProducts: [], 
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false,
            }));
            toast.success("Product created successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create product");
            set({ loading: false });
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch products");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prev) => ({
                products: prev.products.filter((product) => product._id !== productId),
                // Також видаляємо зі слайдера, якщо він там був
                featuredProducts: prev.featuredProducts.filter((product) => product._id !== productId),
                loading: false,
            }));
            toast.success("Product deleted");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to delete product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            const updatedProduct = response.data;

            set((prev) => ({
                // Оновлюємо в загальному списку
                products: prev.products.map((product) =>
                    product._id === productId ? updatedProduct : product
                ),
                loading: false,
            }));
            
            // Якщо ми зняли зірочку або поставили — краще просто перерахувати слайдер
            // або вручну додати/видалити з featuredProducts
            toast.success(updatedProduct.isFeatured ? "Added to featured" : "Removed from featured");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to update product");
        }
    },

    fetchFeaturedProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products/featured");
            // Зберігаємо в окремий масив featuredProducts!
            set({ featuredProducts: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            console.log("Error fetching featured products:", error);
        }
    },
}));