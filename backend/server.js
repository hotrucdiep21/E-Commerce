import express from "express"
import dotenv from "dotenv"

import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyricsRoutes from "./routes/analytics.route.js"

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser())
app.use(express.json({limit: "10mb"})) //allow json data to be sent to the server
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/analytics", analyricsRoutes);


app.listen(PORT, () => {
    console.log("Server is running on ", PORT)

    connectDB();
})