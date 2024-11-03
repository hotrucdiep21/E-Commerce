import axios from "../lib/axios.js";
import { create } from "zustand";

export const useAnalyticStore = create((set) => ({
    analyticsData: {
        users: 0,
		products: 0,
		totalSales: 0,
		totalRevenue: 0,
    },
    dailySalesData: [],
    isLoading: true,

    fetchAnalyticsData: async () => {
        set({ isLoading: true });
        try {
            const response = await axios.get("/analytics");

            console.log(response.data);
            set({
                analyticsData: response.data.exAnalyticsData,
                dailySalesData: response.data.exDailySalesData,
                isLoading: false
            })
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}))