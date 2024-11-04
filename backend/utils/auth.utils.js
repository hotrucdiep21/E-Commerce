import { redis } from "../lib/redis.js";
import jwt from "jsonwebtoken";
export const generateToken = (user_id) => {
    const accessToken = jwt.sign({ user_id }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m"
    })

    const refreshToken = jwt.sign({ user_id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d"
    })
    return { accessToken, refreshToken }
}


export const storeRefreshTokenToRedis = async (user_id, refreshToken) => {
    await redis.set(`refreshToken:${user_id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
}

export const setCookie = (res, accessToken, refreshToken) => {

    console.log("res----", res);
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