import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json()) //allow json data to be sent to the server
app.use("/api/auth", authRoutes)


app.listen(PORT, () => {
    console.log("Server is running on ", PORT)

    connectDB();
})