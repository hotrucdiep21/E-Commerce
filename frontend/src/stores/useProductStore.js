import { create } from "zustand";
import toast from "react-hot-toast";
import axios from "../lib/axios.js";

export const useProductStore = create((set, get) => ({
    products: [],
    recomendedProducts: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productForm) => {
        set({ loading: true })
        try {
            const res = await axios.post('/products', productForm);
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
            toast.success("Product created successfully");
        } catch (error) {
            toast.error(error.response.data.message || "Something went wrong");
            set({ loading: false });
        }
    },
    fetchAllProducts: async () => {
		set({ loading: true });
		try {
			const response = await axios.get("/products");

            console.log("response: ", response.data.products);
			set({ products: response.data.products, loading: false });
		} catch (error) {
			set({ error: "Failed to fetch products", loading: false });
			toast.error(error.response.data.error || "Failed to fetch products");
		}
	},

    fetCategoryById: async (categoryId) => {
        set({ loading: true });
        try {
            const response = await axios.get(`/products/category/${categoryId}`);
            set({ products: response.data.products, loading: false });
        } catch (error) {
            console.log(error);
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to fetch Category");
        }
    },
    deleteProduct: async (productId) => { 
        set({ loading: true });
		try {
			await axios.delete(`/products/${productId}`);
			set((prevProducts) => ({
				products: prevProducts.products.filter((product) => product._id !== productId),
				loading: false,
			}));
		} catch (error) {
			set({ loading: false });
			toast.error(error.response.data.error || "Failed to delete product");
		}
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/products/${productId}`);
            // this will update the isFeatured prop of the product
            set((prevProducts) => ({
                products: prevProducts.products.map((product) =>
                    product._id === productId ? { ...product, isFeatured: response.data.isFeatured } : product
                ),
                loading: false,
            }));
        } catch (error) {
            set({ loading: false });
            toast.error(error.response.data.error || "Failed to update product");
        }
    },

    fetchFeaturedProducts: async () => {
        try {
            const reacomendedProducts = await axios.get("/products/recomendations");
            set({ recomendedProducts: reacomendedProducts.data.products });
        } catch (error) {
            console.log(error);
        }
    }
}))