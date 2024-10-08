import Product from "../model/product.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;

        const existingItem = user.cartItem.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            user.cartItem.push(productId);
        }

        await user.save();
        res.json(user.cartItem);
    } catch (error) {
        console.log("Error adding product to cart ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const removeAllFromCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = req.user;
        if (!productId) {
            user.cartItem = [];
        } else {
            user.cartItem = user.cartItem.filter(item => item.id !== productId);
        }
        await user.save();
        res.json(user.cartItem);
    } catch (error) {
        console.log("Error removing product from cart ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateQuantity = async (req, res) => {
    try {
        const { id: productId } = req.params;
        const { quantity } = req.body;
        const user = req.user;
        const existingItem = user.cartItem.find(item => item.id === productId);

        if (existingItem) {
            if (quantity === 0) {
                user.cartItem = user.cartItem.filter(item => item.id !== productId);
                await user.save();
                return res.json(user.cartItem);


            } else {
                existingItem.quantity = quantity;
                await user.save();
                return res.json(user.cartItem);
            }
        } else {
            return res.status(404).json({ message: "Product not found" });
        }
    } catch (error) {
        console.log("Error updating quantity ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getCartProducts = async (req, res) => {
    try {
        const products = await Product.find({ _id: { $in: req.user.cartItem } });
        //add quantity for each product
        const cartItems = products.map(product => {
            const item = req.user.cartItem.find(item => item.id === product.id);
            return {
                ...product.toJSON(),
                quantity: item.quantity
            }
        })
    } catch (error) {
        console.log("Error getting cart products ", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}