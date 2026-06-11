import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useOrderStore = create((set) => ({
    orders: [],
    loading: false,

    fetchAllOrders: async () => {
        set({ loading: true });
        try {
            const response = await axios.get("/orders");
            set({ orders: response.data.orders, loading: false });
        } catch (error) {
            set({ error: "Failed to fetch orders", loading: false });
            toast.error(error.response?.data?.error || "Failed to fetch orders");
        }
    },

    updateDeliveryStatus: async (orderId, newStatus) => {
        try {
            const response = await axios.put(`/orders/${orderId}/delivery-status`, {
                deliveryStatus: newStatus
            });
            set((state) => ({
                orders: state.orders.map((order) =>
                    order._id === orderId ? { ...order, deliveryStatus: newStatus } : order
                )
            }));
            toast.success("Delivery status updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update delivery status");
        }
    }
}));
