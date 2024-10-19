import axios from "../lib/axios.js";
import { create } from "zustand";

export const usePaymentStore = create((set) => ({
    handlePayment: null,
    
}))