import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
    products: [],
    featuredProducts: [],
    categories: [], 
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true });
        try {
            const res = await axios.post("/products", productData);
            set((state) => ({
                products: [...state.products, res.data],
                loading: false,
            }));
            toast.success("Product created successfully!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.error || "Failed to create product");
            throw error;
        }
    },

    fetchAllCategories: async () => {
        try {
            const response = await axios.get("/products/categories");
            set({ categories: response.data });
        } catch (error) {
            const uniqueCategories = [...new Set(get().products.map(p => p.category))];
            if (uniqueCategories.length > 0) {
                set({ categories: uniqueCategories });
            }
        }
    },

    createCategory: async (categoryName) => {
        try {
            const res = await axios.post("/products/categories", { name: categoryName });
            const newCat = res.data.name || res.data;

            set((state) => ({
                categories: [...state.categories, newCat],
            }));
            toast.success("Category permanently saved");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save category to database");
        }
    },

    deleteCategory: async (categoryName) => {
        try {
            set((state) => ({
                categories: state.categories.filter((c) => c !== categoryName),
            }));
            toast.success(`Category "${categoryName}" removed`);
        } catch (error) {
            toast.error("Failed to delete category");
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/products");
            const productsData = response.data.products || response.data;
            const productsArray = Array.isArray(productsData) ? productsData : [];
            const derivedCategories = [...new Set(productsArray.map(p => p.category))];
            set({ products: productsArray, categories: derivedCategories, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to fetch products");
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${category}`);
            const productsData = response.data.products || response.data;
            set({ products: Array.isArray(productsData) ? productsData : [], loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to fetch products");
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true });
        try {
            await axios.delete(`/products/${productId}`);
            set((prev) => ({
                products: prev.products.filter((p) => p._id !== productId),
                loading: false,
            }));
            toast.success("Product deleted");
        } catch (error) {
            set({ loading: false });
            toast.error("Failed to delete product");
        }
    },

    toggleFeaturedProduct: async (productId) => {
        try {
            const response = await axios.patch(`/products/${productId}`);
            set((prev) => ({
                products: prev.products.map((p) => p._id === productId ? response.data : p),
            }));
        } catch (error) {
            toast.error("Failed to update product");
        }
    },

    fetchFeaturedProducts: async () => {
        try {
            const response = await axios.get("/products/featured");
            set({ featuredProducts: response.data });
        } catch (error) {
            console.log("Error fetching featured:", error);
        }
    },

    updateProduct: async (id, formData) => {
        set({ loading: true });
        try {
            const res = await axios.put(`/products/${id}`, formData);
            set((state) => ({
                products: state.products.map((p) => (p._id === id ? res.data : p)),
                loading: false,
            }));
            return res.data;
        } catch (error) {
            set({ loading: false });
            throw error;
        }
    },
}));