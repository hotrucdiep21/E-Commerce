import { generateToken, storeRefreshTokenToRedis, setCookie } from "../utils/auth.utils.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
export const signup = async (req, res) => {

    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const user = await User.create({ name, email, password });

        //authentication
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshTokenToRedis(user._id, refreshToken); //save token to redis

        setCookie(res, accessToken, refreshToken);

        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: "User created successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateToken(user._id);
            await storeRefreshTokenToRedis(user._id, refreshToken);
            setCookie(res, accessToken, refreshToken);
        }
        else {
            return res.status(401).json({
                message: "Email or password is incorrect"
            })
        }
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            message: "Login successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}
export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            try {
                const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                await redis.del(`refreshToken:${decoded.user_id}`);
            } catch (error) {
                return res.status(401).json({
                    message: "Invalid refresh token"
                })
            }

        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        res.status(200).json({
            message: "Logout successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "no refresh token provided"
            })
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const storedToken = await redis.get(`refreshToken:${decoded.user_id}`);

        if (storedToken !== refreshToken) {
            return res.status(401).json({
                message: "Invalid refresh token"
            })
        }

        const accessToken = jwt.sign({ userId: decoded.user_id }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "15m"
        })

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        })
        res.json({
            message: "Refresh token successfully"
        })
    } catch (error) {
        console.log("Error refreshing token", error.message);
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error getting profile", error.message);
        res.status(500).json({
            message: "Server error", error: error.message
        })
    }
}