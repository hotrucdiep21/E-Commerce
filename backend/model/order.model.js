import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"]
    },
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: [true, "Product ID is required"]
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                min: [1, "Quantity must be at least 1"]
            },
            price: {
                type: Number,
                required: [true, "Price is required"],
                min: [0, "Price must be at least 0"]
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    stripeSessionId: {
        type: String,
        unique: true
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);