import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Trash2, Bot, User } from 'lucide-react';
import { useChatStore } from '../stores/useChatStore';
import { Link } from 'react-router-dom';

const ChatWidget = () => {
    const { messages, isOpen, loading, toggleChat, sendMessage, clearHistory } = useChatStore();
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim() === '' || loading) return;
        
        sendMessage(inputValue);
        setInputValue('');
    };

    const renderMessage = (text) => {
        // Simple regex to parse [Text](URL)
        const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = linkRegex.exec(text)) !== null) {
            // Push text before link
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            const linkText = match[1];
            const url = match[2];
            
            if (url.startsWith('/')) {
                parts.push(
                    <Link key={`link-${match.index}`} to={url} className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200">
                        {linkText}
                    </Link>
                );
            } else {
                parts.push(
                    <a key={`link-${match.index}`} href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 underline font-semibold transition-colors duration-200">
                        {linkText}
                    </a>
                );
            }
            lastIndex = match.index + match[0].length;
        }
        // Push remaining text
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }

        // Render line breaks and bold formatting safely
        return parts.map((part, i) => {
            if (typeof part === 'string') {
                return <span key={`text-${i}`} dangerouslySetInnerHTML={{ __html: part.replace(/\n/g, '<br />').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
            }
            return part;
        });
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="w-80 sm:w-96 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden mb-4 transition-all duration-300 transform origin-bottom-right flex flex-col" style={{ height: '500px', maxHeight: '80vh' }}>
                    {/* Header */}
                    <div className="bg-emerald-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center space-x-2">
                            <Bot size={24} />
                            <h3 className="font-bold text-lg">DS.shop Assistant</h3>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={clearHistory} className="text-emerald-200 hover:text-white transition" title="Clear history">
                                <Trash2 size={18} />
                            </button>
                            <button onClick={toggleChat} className="text-emerald-200 hover:text-white transition">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'User' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex items-end space-x-2 max-w-[85%] ${msg.role === 'User' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'User' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                                        {msg.role === 'User' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm ${msg.role === 'User' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-gray-700 text-gray-100 rounded-bl-sm'}`}>
                                        {renderMessage(msg.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Typing Indicator */}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-end space-x-2 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <Bot size={16} className="text-white" />
                                    </div>
                                    <div className="p-4 rounded-2xl bg-gray-700 rounded-bl-sm flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-gray-900 border-t border-gray-700">
                        <form onSubmit={handleSubmit} className="flex relative items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                disabled={loading}
                                className="w-full bg-gray-800 text-white border border-gray-700 rounded-full py-3 pl-4 pr-12 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50"
                            />
                            <button
                                type="submit"
                                disabled={loading || !inputValue.trim()}
                                className="absolute right-2 p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={16} />
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110"
                >
                    <MessageCircle size={28} />
                </button>
            )}
        </div>
    );
};

export default ChatWidget;
