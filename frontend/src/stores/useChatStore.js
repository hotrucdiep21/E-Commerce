import { create } from "zustand";
import axios from "../lib/axios.js";
import toast from "react-hot-toast";

// Generate a random session ID if not exists
const getSessionId = () => {
    let sessionId = localStorage.getItem("chat_session_id");
    if (!sessionId) {
        sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("chat_session_id", sessionId);
    }
    return sessionId;
};

export const useChatStore = create((set, get) => ({
    messages: [
        { role: 'Assistant', content: 'Hello! I am the DS.shop virtual assistant. How can I help you today?' }
    ],
    isOpen: false,
    loading: false,
    sessionId: getSessionId(),

    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

    sendMessage: async (message) => {
        const { sessionId, messages } = get();
        
        // Add user message to state immediately
        const newMessages = [...messages, { role: 'User', content: message }];
        set({ messages: newMessages, loading: true });

        try {
            const response = await axios.post('/chat', { message, sessionId });
            
            // Add bot response to state
            set((state) => ({
                messages: [...state.messages, { role: 'Assistant', content: response.data.reply }],
                loading: false
            }));
        } catch (error) {
            console.error("Chat error:", error);
            toast.error("Could not connect to the assistant at this time.");
            set({ loading: false });
        }
    },

    clearHistory: async () => {
        const { sessionId } = get();
        try {
            await axios.delete(`/chat/${sessionId}`);
            set({ 
                messages: [{ role: 'Assistant', content: 'Chat history has been cleared. How can I help you?' }]
            });
            toast.success("Chat history cleared");
        } catch (error) {
            console.error("Clear history error:", error);
            toast.error("Error clearing history");
        }
    }
}));
