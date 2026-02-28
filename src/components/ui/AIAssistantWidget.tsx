import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { useSound } from '../../context/SoundContext';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    isTyping?: boolean;
};

// Mock "knowledge base" for the AI
// We will now rely on the actual Groq backend instead of mock responses.

export function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm Manu's AI Assistant. Ask me anything about his skills, experience, or tech stack.", sender: 'ai' }
    ]);
    const scrollRef = useRef<HTMLDivElement>(null);
    const { playClick, playType, playHover } = useSound();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        playClick();
        const userText = input;
        const userMsg: Message = { id: Date.now().toString(), text: userText, sender: 'user' };
        
        // Update local UI immediately
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Show typing indicator
        const typingId = (Date.now() + 1).toString();
        setMessages(prev => [...prev, { id: typingId, text: '', sender: 'ai', isTyping: true }]);

        try {
            // Build the conversation history for the AI model
            const apiMessages = messages.filter(m => !m.isTyping).map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant',
                content: m.text
            }));
            // Add the newest message
            apiMessages.push({ role: 'user', content: userText });

            const API_URL = import.meta.env.VITE_API_URL || '/api/chat';
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: apiMessages })
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            
            setMessages(prev => prev.map(msg =>
                msg.id === typingId ? { ...msg, text: data.reply || "I couldn't process that.", isTyping: false } : msg
            ));
            playClick(); // Notification sound for reply
            
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => prev.map(msg =>
                msg.id === typingId ? { ...msg, text: "Sorry, I'm having trouble connecting to my central servers. Please try again later.", isTyping: false } : msg
            ));
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[90]">
            {/* FAB */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => { playClick(); setIsOpen(true); }}
                        onMouseEnter={playHover}
                        className="bg-neon-blue text-white p-4 rounded-full shadow-lg hover:shadow-cyan-500/50 hover:bg-cyan-500 transition-colors flex items-center justify-center pointer-events-auto"
                        aria-label="Open AI Assistant"
                    >
                        <MessageSquare size={24} />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-0 right-0 w-[350px] sm:w-[400px] h-[500px] bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/50">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neon-blue/20 flex items-center justify-center text-neon-blue">
                                    <Bot size={18} />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold text-sm tracking-tight">Manu's AI</h3>
                                    <p className="text-xs text-neon-blue flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-pulse"></span>
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => { playClick(); setIsOpen(false); }}
                                onMouseEnter={playHover}
                                className="text-slate-400 hover:text-white transition-colors p-1"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-4 space-y-4 text-sm"
                        >
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-neon-blue text-white'
                                        }`}>
                                        {msg.sender === 'user' ? <User size={12} /> : <Bot size={12} />}
                                    </div>
                                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] ${msg.sender === 'user'
                                            ? 'bg-slate-700 text-white rounded-tr-sm'
                                            : 'bg-slate-800/80 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                                        }`}>
                                        {msg.isTyping ? (
                                            <div className="flex items-center gap-1 h-5">
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        ) : (
                                            <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-3 border-t border-slate-800 bg-slate-900">
                            <form onSubmit={handleSend} className="relative flex items-center">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={playType}
                                    placeholder="Ask about Manu..."
                                    className="w-full bg-slate-800 text-white text-sm rounded-full pl-4 pr-12 py-3 outline-none border border-slate-700 focus:border-neon-blue/50 transition-colors"
                                    autoComplete="off"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim()}
                                    onMouseEnter={playHover}
                                    className="absolute right-2 text-neon-blue p-1.5 rounded-full hover:bg-neon-blue/10 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
                                >
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
