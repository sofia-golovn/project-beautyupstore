import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useWishlistStore } from "./useWishlistStore"; 
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup } from "firebase/auth";

export const useUserStore = create((set, get) => ({
    user: null,
    allUsers: [], 
    loading: false,
    checkingAuth: true,
    currentPage: 1,
    totalPages: 1,

    signup: async ({ name, email, phone, password, confirmPassword }) => {
    set({ loading: true });

    if (password !== confirmPassword) {
        set({ loading: false });
        return toast.error("Passwords do not match");
    }

    try {
        const res = await axios.post("/auth/signup", { name, email, phone, password });
        set({ user: res.data, loading: false });
        toast.success("Account created successfully");
    } catch (error) {
        set({ loading: false });
        toast.error(error.response.data.message || "An error occurred");
    }
},

    login: async (email, password) => {
        set({ loading: true });
        try {
            const res = await axios.post("/auth/login", { email, password });
            set({ user: res.data, loading: false });
            
            useWishlistStore.getState().getWishlist();
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "An error occurred");
        }
    },

    logout: async () => {
        try {
            await axios.post("/auth/logout");
            set({ user: null, allUsers: [], currentPage: 1, totalPages: 1 });
            
            useWishlistStore.getState().clearWishlist();
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

    fetchAllUsers: async (page = 1) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/users?page=${page}`); 
            if (response.data.users) {
                set({ 
                    allUsers: response.data.users, 
                    totalPages: response.data.totalPages, 
                    currentPage: response.data.currentPage,
                    loading: false 
                });
            } else {
                set({ allUsers: response.data, loading: false, totalPages: 1 });
            }
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

    forgotPassword: async (email) => {
        set({ loading: true });
        try {
            await axios.post("/auth/forgot-password", { email });
            set({ loading: false });
            toast.success("Code sent to your email!");
            return true;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error sending code");
            return false;
        }
    },

    resetPassword: async (email, code, newPassword) => {
        set({ loading: true });
        try {
            await axios.post("/auth/reset-password", { email, code, newPassword });
            set({ loading: false });
            toast.success("Password changed! You can now log in.");
            return true;
        } catch (error) {
            set({ loading: false });
            toast.error(error.response?.data?.message || "Error resetting password");
            return false;
        }
    },
    
    loginWithGoogle: async () => {
        set({ loading: true });
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const firebaseUser = result.user;

            const res = await axios.post("/auth/google", {
                name: firebaseUser.displayName,
                email: firebaseUser.email,
                image: firebaseUser.photoURL,
            });

            set({ user: res.data, loading: false });
            
            useWishlistStore.getState().getWishlist();
            
        } catch (error) {
            set({ loading: false });
            console.error("Google Auth Error:", error);
            toast.error(error.response?.data?.message || "Google login failed");
        }
    },

}));