"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles, User, Bot, Volume2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { model } from "@/lib/gemini";
import { cn } from "@/lib/utils";
import { voiceService } from "@/lib/voice";

interface ChatMessage {
    role: "user" | "model";
    text: string;
}

export function StoicChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        { role: "model", text: "Greetings. I am Marcus. What burden weighs upon your mind today? 🏛️" }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input;
        setInput("");
        setMessages(prev => [...prev, { role: "user", text: userText }]);
        setIsLoading(true);

        try {
            // Create a chat history for context
            // Note: In a real app, uses chat.sendMessage with history
            const result = await model.generateContent(
                `User: ${userText}\n\nRespond as Marcus Aurelius, concise and stoic:`
            );
            const response = result.response;
            const text = response.text();

            setMessages(prev => [...prev, { role: "model", text }]);
        } catch (error) {
            console.error("Gemini Error:", error);
            setMessages(prev => [...prev, { role: "model", text: "The connection to the Logos is faint. Please check your API key. ⚠️" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-slate-900 border border-amber-500/30 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-slate-950 p-4 border-b border-slate-800 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-amber-500/10 rounded-lg">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">The Living Marcus</h3>
                                    <p className="text-xs text-amber-500/80">AI Stoic Mentor</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors"
                                aria-label="Close Chat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={cn(
                                        "flex gap-3 max-w-[90%]",
                                        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                                        msg.role === "user" ? "bg-slate-700" : "bg-amber-900/50"
                                    )}>
                                        {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-500" />}
                                    </div>
                                    <div className={cn(
                                        "p-3 rounded-2xl text-sm leading-relaxed relative group",
                                        msg.role === "user"
                                            ? "bg-slate-800 text-slate-100 rounded-tr-none"
                                            : "bg-amber-500/10 text-amber-100/90 rounded-tl-none border border-amber-500/10"
                                    )}>
                                        {msg.text}
                                        {msg.role === "model" && (
                                            <button
                                                onClick={() => voiceService.speak(msg.text)}
                                                className="absolute -bottom-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500/50 hover:text-amber-500 p-1"
                                                title="Listen to Marcus"
                                            >
                                                <Volume2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-amber-900/50 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-amber-500" />
                                    </div>
                                    <div className="flex gap-1 items-center h-8 px-2">
                                        <div className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                        <div className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                        <div className="w-2 h-2 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-slate-950 border-t border-slate-800">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="relative flex items-center"
                            >
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask for guidance..."
                                    className="w-full bg-slate-900 border border-slate-700 rounded-full py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 p-2 bg-amber-500 rounded-full text-slate-900 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    aria-label="Send Message"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-24 right-6 z-50 w-14 h-14 bg-amber-500 rounded-full shadow-lg shadow-amber-500/20 flex items-center justify-center text-slate-900 hover:text-white transition-colors border-2 border-white/10"
                    aria-label="Open AI Mentor"
                >
                    <MessageCircle className="w-7 h-7" />
                </motion.button>
            )}
        </>
    );
}
