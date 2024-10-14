import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

export const useCartStore = create((set, get) => ({
    cart: [],
    coupon: null,
    total: 0,
    subtotal: 0,
    loading: false,

    getCartItems: async () => {
        try {
            const res = await axios.get("/cart");
            set({ cart: res.data });

            get().calculateTotal();
        } catch (error) {
            set({ loading: false, cart: [] });
            toast.error(error.response.data.error || "Failed to fetch cart");
        }
    },

    addToCart: async (product) => {
        try {
            await axios.post("/cart", { productId: product._id });
            toast.success("Product added to cart");

            set((prevState) => {
                //check product alreardy exist in cart
                const existingItem = prevState.cart.find(item => item._id === product._id);

                const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }];

                return { cart: newCart };
            });

            get().calculateTotal();
        } catch (error) {
            toast.error(error.response.data.error || "Failed to add product to cart");
        }
    },

    calculateTotal: () => {
        const { cart, coupon } = get();

        const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        let total = subTotal;

        if (coupon) {
            const discount = subTotal * (coupon.discountPercentage / 100);
            total = subTotal - discount;
        }
    }
}));