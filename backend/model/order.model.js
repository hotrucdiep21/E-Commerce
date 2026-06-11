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
    },
    deliveryStatus: {
        type: String,
        enum: ["Pending", "Shipped", "Delivered"],
        default: "Pending"
    },
    paymentStatus: {
        type: String,
        enum: ["Pending", "Paid", "Failed"],
        default: "Pending"
    },
    paymentMethod: {
        type: String,
        default: "Credit Card"
    },
    shippingAddress: {
        type: String,
        required: false
    },
    phoneNumber: {
        type: String,
        required: false
    }
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);