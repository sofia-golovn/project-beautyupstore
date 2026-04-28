import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios";

export const useProductStore = create((set, get) => ({
    products: [],
    featuredProducts: [],
    categories: ["All"],
    loading: false,
    
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    maxPriceInDb: 0,

    setPage: (page) => set({ currentPage: page }),
    setProducts: (products) => set({ products }),

    fetchMaxPrice: async () => {
        try {
            const response = await axios.get("/products/max-price");
            const price = response.data.maxPrice;
            set({ maxPriceInDb: price });
            return price; 
        } catch (error) {
            console.error("Error fetching max price", error);
            set({ maxPriceInDb: 500 });
            return 500;
        }
    },

    fetchAllProducts: async (page = 1, filters = {}, isPagination = false) => {
        if (!isPagination) set({ loading: true });
        try {
            const { minPrice, maxPrice, sort, search } = filters;
            const params = new URLSearchParams({
                page,
                limit: 12,
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice }),
                ...(sort && { sort }),
                ...(search && { search }) 
            });

            const response = await axios.get(`/products?${params.toString()}`);
            set({ 
                products: response.data.products, 
                totalPages: response.data.totalPages,
                currentPage: response.data.currentPage,
                loading: false 
            });
        } catch (error) {
            set({ loading: false });
            toast.error("Error fetching products");
        }
    },

    fetchProductsByCategory: async (category, page = 1, filters = {}) => {
        set({ loading: true });

        try {
            const formattedCategory = category.toLowerCase();
            const { minPrice, maxPrice, sort, search } = filters;
            
            const params = new URLSearchParams({
                page: page, 
                limit: 12,
                ...(minPrice && { minPrice }),
                ...(maxPrice && { maxPrice }),
                ...(sort && { sort }),
                ...(search && { search })
            });

            const response = await axios.get(`/products/category/${formattedCategory}?${params.toString()}`);
            
            const { products, totalPages, currentPage, totalProducts } = response.data;
            
            set({ 
                products: Array.isArray(products) ? products : [], 
                totalPages,
                currentPage,
                totalProducts,
                page: currentPage, 
                loading: false 
            });
        } catch (error) {
            set({ loading: false });
            console.error("Fetch category error:", error);
            toast.error("Failed to fetch products for this category");
        }
    },

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
        const response = await axios.get("/categories"); 
        const categoryNames = response.data.map(cat => cat.name);
        
        set({ categories: ["All", ...categoryNames] });
    } catch (error) {
        console.error("Error fetching categories:", error);
        set({ categories: ["All"] });
    }
    },

    createCategory: async (categoryName) => {
        set({ loading: true });
        try {
        const res = await axios.post("/categories", { name: categoryName });
        
        set((state) => ({
            categories: [...state.categories, res.data.name],
            loading: false,
        }));
        toast.success("Category created successfully");
    } catch (error) {
        set({ loading: false });
        toast.error(error.response?.data?.message || "Error creating category");
    }
    },

    deleteCategory: async (categoryName) => {
        try {
            await axios.delete(`/categories/${categoryName}`);
            
            set((state) => ({
                categories: state.categories.filter((cat) => cat !== categoryName),
            }));
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete category");
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