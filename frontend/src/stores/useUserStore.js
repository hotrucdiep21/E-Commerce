import { create } from "zustand";
import axios from "../lib/axios.js";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
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
            console.log(email, "appp")
            const res = await axios.post('/auth/login', {
                email,
                password,
            })

            set({ user: res.data.user, loading: false });
            toast.success("Logged in successfully");
        } catch (error) {
            set({ loading: false });
            toast.error("Something went wrong");
        }
    },

    logout: async () => {
        try {
            await axios.post('/auth/logout');
            set({ user: null });
        } catch (error) {
            set({ user: null });
            toast.error(error.response?.data?.message || "An error occurred during logout");
        }
    },

    checkAuth: async () => {
        set({ checkingAuth: true });
        try {
            const response = await axios.get("/auth/profile");
            set({ user: response.data, checkingAuth: false });
        } catch (error) {
            console.log(error.message);
            set({ checkingAuth: false, user: null });
        }
    },

    refreshToken: async () => {
        // Prevent multiple simultaneous refresh attempts
        if (get().checkingAuth) return;

        set({ checkingAuth: true });
        try {
            const response = await axios.post("/auth/refresh-token");
            set({ checkingAuth: false });
            return response.data;
        } catch (error) {
            set({ user: null, checkingAuth: false });
            throw error;
        }
    }


}))


let refreshToken = null;
axios.interceptors.response.use(
    (response) => response,
    async (err) => {
        const originalRequest = err.config;
        if (err.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                //if refresh is already in the process, wait for it to complete
                if (refreshToken) {
                    await refreshToken;
                    return axios(originalRequest)
                }

                //start a new refresh progress
                refreshToken = useUserStore.getState().refreshToken();
                await refreshToken;
                refreshToken = null;

                return axios(originalRequest)
            } catch (error) {
                //if refresh fail redirect to login and handle needed
                useUserStore.getState().logout();
                return Promise.reject(error)
            }
        }
        return Promise.reject(err)
    }
)