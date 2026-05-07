import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCategoryStore = create((set) => ({
    categories: [],
    loading: false,

    fetchCategories: async () => {
        set({ loading: true });
        try {
            const res = await axios.get("/categories");
            set({ categories: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
        }
    },

    createCategory: async (data) => {
        set({ loading: true });
        try {
            const res = await axios.post("/categories", data);
            set((state) => ({ categories: [...state.categories, res.data], loading: false }));
            toast.success("Category created!");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error");
        }
    },

    deleteCategory: async (id) => {
        try {
            await axios.delete(`/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter((c) => c._id !== id)
            }));
            toast.success("Category deleted");
        } catch (error) {
            toast.error("Failed to delete");
        }
    }
}));