import { GoogleGenerativeAI } from "@google/generative-ai";
import { redis } from "../lib/redis.js";
import Product from "../model/product.model.js";

const SYSTEM_PROMPT = `
You are an AI virtual assistant for the e-commerce store named DS.shop.
Always maintain a polite, friendly, and helpful attitude towards customers.
If a customer asks about policies, reply generally that: DS.shop offers free shipping on orders over $150, a 30-day return policy, and guarantees high-quality products.
If a customer asks about products, base your answers strictly on the provided context below. Do not invent non-existent products.
IMPORTANT: Every product you recommend MUST be accompanied by a link to its detail page in Markdown format: [Product Name](/product/product_id).
For example: "[Nike T-Shirt](/product/60d5ec...)". Never use absolute URLs.
Keep your advice concise, natural, easy to understand, and encourage the customer to click the link to view more details.
`;

export const handleChat = async (req, res) => {
    try {
        const { message, sessionId } = req.body;
        
        if (!message || !sessionId) {
            return res.status(400).json({ message: "Message and sessionId are required" });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ message: "GEMINI_API_KEY is missing in environment variables" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // Retrieve chat history from Redis
        const redisKey = `chat_history:${sessionId}`;
        let chatHistory = await redis.get(redisKey);
        
        if (chatHistory) {
            chatHistory = JSON.parse(chatHistory);
        } else {
            chatHistory = [];
        }

        // Fetch some products to give the AI some knowledge
        const products = await Product.find({}).limit(15).select("_id name price category description").lean();
        const productContext = products.map(p => `- ID: ${p._id} | Name: ${p.name} | Category: ${p.category} | Price: $${p.price} | Description: ${p.description}`).join("\n");

        const fullPrompt = `${SYSTEM_PROMPT}\n\nHere is a list of our current available products (real data):\n${productContext}\n\nChat History:\n${chatHistory.map(msg => `${msg.role}: ${msg.content}`).join('\n')}\n\nUser: ${message}\nAssistant (DS.shop):`;

        // Fallback strategy to mitigate 503 Overloaded issues
        const generateWithFallback = async (prompt) => {
            const fallbackModels = ["gemini-flash-latest", "gemini-flash-lite-latest", "gemini-2.5-flash-lite"];
            let lastError;

            for (let i = 0; i < fallbackModels.length; i++) {
                const modelName = fallbackModels[i];
                try {
                    const currentModel = genAI.getGenerativeModel({ model: modelName });
                    const result = await currentModel.generateContent(prompt);
                    return result;
                } catch (error) {
                    console.warn(`[Chat AI] Model ${modelName} failed: ${error.message}`);
                    lastError = error;
                    // Wait for 1.5 seconds before trying the next model
                    if (i < fallbackModels.length - 1) {
                        await new Promise(resolve => setTimeout(resolve, 1500));
                    }
                }
            }
            throw lastError; // Throw the last error if all models fail
        };

        const result = await generateWithFallback(fullPrompt);
        const responseText = result.response.text();

        // Update chat history
        chatHistory.push({ role: 'User', content: message });
        chatHistory.push({ role: 'Assistant', content: responseText });

        // Keep only last 12 messages to avoid context overflow and save Redis memory
        if (chatHistory.length > 12) {
            chatHistory = chatHistory.slice(chatHistory.length - 12);
        }

        await redis.set(redisKey, JSON.stringify(chatHistory), "EX", 60 * 60 * 24); // expire in 24 hours

        res.json({ reply: responseText });
    } catch (error) {
        console.error("Error in handleChat controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const clearChatHistory = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const redisKey = `chat_history:${sessionId}`;
        await redis.del(redisKey);
        res.json({ message: "Chat history cleared" });
    } catch (error) {
        console.error("Error in clearChatHistory controller", error.message);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
