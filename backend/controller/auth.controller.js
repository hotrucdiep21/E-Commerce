import { redis } from "../lib/redis.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

console.log(process.env.REFRESH_TOKEN_SECRET);
console.log(process.env.ACCESS_TOKEN_SECRET);

const generateToken = (user_id) => {
    const accessToken = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
    return { accessToken, refreshToken }
}

const storeRefreshToken = async (user_id, refreshToken) => {
    await redis.set(`refreshToken:${user_id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

const setCookie = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        httpOnly: true, // Chỉ cho phép truy cập cookie qua HTTP, bảo vệ chống XSS.
        secure: process.env.NODE_ENV === "production", //Chỉ gửi cookie qua HTTPS khi ứng dụng đang chạy trong môi trường production.
        sameSite: "strict", //Bảo vệ chống lại các tấn công Cross-Site Request Forgery (CSRF).
        maxAge: 15 * 60 * 1000
    })

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const signup = async (req, res) => {

    const { name, email, password } = req.body;
    try {

        console.log(name, email, password)
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const user = await User.create({ name, email, password });

        //authentication
        const { accessToken, refreshToken } = generateToken(user._id);
        await storeRefreshToken(user._id, refreshToken);

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
    res.send("Login is called");
}
export const logout = async (req, res) => {
    res.send("Logout is called");
}