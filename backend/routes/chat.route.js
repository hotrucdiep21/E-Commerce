import express from "express";
import { handleChat, clearChatHistory } from "../controller/chat.controller.js";

const router = express.Router();

router.post("/", handleChat);
router.delete("/:sessionId", clearChatHistory);

export default router;
