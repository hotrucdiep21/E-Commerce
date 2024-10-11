import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set, get) => ({
    user: null,
    loading: false,
    checkingAuth: true,

    signup: async (name, email, password, confirmPassword) => {
        set({ loading: true });
        if (password !== confirmPassword) {
            set({ loading: false });
            return toast.error("Passwords do not match");
        }

        try {
            const res = await axios.post('/auth/signup', {
                name,
                email,
                password,
            })

            set({ user: res.data.user, loading: false });
            toast.success("Account created successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something went wrong");
        }

    },

    login: async (email, password) => {
        set({ loading: true });
        try {
            if (!email && !password) {
                return toast.error("Please enter email and password");
            }

            const res = await axios.post('/auth/login', {
                email,
                password,
            })
            console.log("user: ", res.data.user);
            set({ user: res.data.user, loading: false });
            toast.success("Logged in successfully");
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.message || "Something went wrong");
        }
    },

    logout : async () => {
        try {
            await axios.post('/auth/logout');
            set({user: null}); 
            toast.success("Logged out successfully");
        } catch (error) {
            set({user: null});
            toast.error(error.response.data.message || "Something went wrong");
        }
    },  

    checkAuth : async () => {
        set({checkingAuth: true})

        try {
            const res = await axios.get('/auth/profile')
            set({user: res.data.user, checkingAuth: false});
        } catch (error) {
            set({checkingAuth: false, user: null});
        }
    }

    
}))