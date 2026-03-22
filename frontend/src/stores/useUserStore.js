import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    allUsers: [], 
    loading: false,
    checkingAuth: true,


    signup: async ({ name, email, password, confirmPassword }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }
        try {
            const res = await axios.post("/auth/signup", { name, email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null, allUsers: [] });
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            set({ checkingAuth: false, user: null });
        }
    },


    fetchAllUsers: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/users"); 
            set({ allUsers: response.data, loading: false });
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to fetch users");
        }
    },

    deleteUser: async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        set({ loading: true });
        try {
            await axios.delete(`/users/${userId}`);
            set((state) => ({
                allUsers: state.allUsers.filter((u) => u._id !== userId),
                loading: false,
            }));
            toast.success("User deleted");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Failed to delete");
        }
    },

    updateUserRole: async (userId) => {
        try {
            const response = await axios.patch(`/users/${userId}`); 
            set((state) => ({
                allUsers: state.allUsers.map((u) =>
                    u._id === userId ? { ...u, role: response.data.role } : u
                ),
            }));
            toast.success("Status changed");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change role");
        }
    },
}));