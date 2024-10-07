import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({
                message: "Unauthorized - No access token provided"
            })
        }

        try {
            const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decoded.user_id).select("-password");

            if (!user) {
                return res.status(401).json({
                    message: "User not found"
                })
            }

            req.user = user;
            console.log('protectRoute', req.user);
            next();
        } catch (error) {
            if (error.name === "TokenExpiredError") {
                return res.status(400).json({
                    message: "Unauthorized - Access token expried"
                })
            }
            throw error;
        }
    } catch (error) {
        console.log("Error in protectRoute middleware ", error.message);
        res.status(401).json({
            message: "Unauthorized - Invalid access token"
        })
    }
}

export const adminRoute = async (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(401).json({
            message: "Unauthorized - You are not an admin"
        })  
    } 
}