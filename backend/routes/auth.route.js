import express from "express"
import {signup, login, logout, refreshToken} from "../controller/auth.controller.js"

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
// router.get("/profile", protected, getProfile)

export default router