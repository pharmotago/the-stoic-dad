"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Compass, Hammer, Shield } from 'lucide-react';

interface SynthesisMessage {
    id: string;
    source: string;
    text: string;
    type: 'insight' | 'optimization' | 'verification';
}

const ARCHETYPE = {
    name: "The Patriarch",
    pulseColor: "border-amber-500/10",
    glowColor: "rgba(245,158,11,0.05)",
    pulseDuration: 6,
    tag: "VIRTUE SYNTHESIS"
};

const SYNTHESIS_MESSAGES: Omit<SynthesisMessage, 'id'>[] = [
    { source: "The Signal", text: "Psychological resilience is peaking. The discipline of the hearth is your greatest fortress.", type: 'insight' },
    { source: "Language Coach", text: "Linguistic expansion is now rooted in ancient wisdom. Your words carry the weight of justice.", type: 'optimization' },
    { source: "AuthorityRx", text: "Industrial audit complete. Your household economy is now governed by the virtue of Temperance.", type: 'verification' },
    { source: "MCJP Council", text: "The Patriarch protocol is active. Steadfastness is the only acceptable baseline for this cycle.", type: 'insight' }
];

export function SynthesisOverlay() {
    const [messages, setMessages] = useState<SynthesisMessage[]>([]);
    const [pulseActive, setPulseActive] = useState(false);

    useEffect(() => {
        // Slow Monolithic pulse interval
        const initialTimer = setTimeout(() => {
            triggerRandomMessage();
        }, 15000);

        const pulseInterval = setInterval(() => {
            setPulseActive(true);
            setTimeout(() => setPulseActive(false), 6000);
        }, 50000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(pulseInterval);
        };
    }, []);

    const triggerRandomMessage = () => {
        const template = SYNTHESIS_MESSAGES[Math.floor(Math.random() * SYNTHESIS_MESSAGES.length)];
        const newMessage: SynthesisMessage = {
            ...template,
            id: Math.random().toString(36).substring(7)
        };

        setMessages(prev => [...prev, newMessage]);
        setPulseActive(true);

        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== newMessage.id));
            setPulseActive(false);
        }, 12000); // Very long for monolithic feel

        setTimeout(triggerRandomMessage, 80000 + Math.random() * 80000);
    };

    return (
        <>
            {/* Council Pulse: Monolithic Frequency */}
            <AnimatePresence>
                {pulseActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.02 }}
                        transition={{ duration: ARCHETYPE.pulseDuration, ease: [0.4, 0, 0.2, 1] }}
                        className={`fixed inset-0 pointer-events-none z-[100] border-[20px] ${ARCHETYPE.pulseColor} shadow-[inset_0_0_250px_${ARCHETYPE.glowColor}]`}
                    />
                )}
            </AnimatePresence>

            {/* Synthesis Feed: Stoic Intelligence */}
            <div className="fixed top-32 left-1/2 -translate-x-1/2 z-[101] flex flex-col gap-6 pointer-events-none max-w-lg w-full px-4">
                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: -20, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
                            className="p-8 bg-slate-900/90 border-2 border-amber-500/10 rounded-none backdrop-blur-3xl shadow-[0_20px_100px_rgba(0,0,0,0.8)] relative overflow-hidden group pointer-events-auto"
                        >
                            {/* Vertical "Pillar" Decor */}
                            <div className="absolute left-0 top-0 w-1 h-full bg-amber-500/40" />
                            <div className="absolute right-0 top-0 w-1 h-full bg-amber-500/40" />

                            <div className="flex flex-col items-center text-center gap-4">
                                <div className="p-3 bg-amber-500/5 border border-amber-500/20">
                                    {msg.type === 'insight' && <Compass className="w-6 h-6 text-amber-500" />}
                                    {msg.type === 'optimization' && <Hammer className="w-6 h-6 text-amber-600" />}
                                    {msg.type === 'verification' && <Shield className="w-6 h-6 text-amber-700" />}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-center gap-3">
                                        <div className="h-[1px] w-8 bg-amber-500/30" />
                                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em]">
                                            {ARCHETYPE.tag}
                                        </span>
                                        <div className="h-[1px] w-8 bg-amber-500/30" />
                                    </div>
                                    <p className="text-sm text-amber-50/60 font-serif leading-relaxed italic">
                                        [{msg.source}]: "{msg.text}"
                                    </p>
                                    <p className="text-[9px] font-bold text-amber-500/40 uppercase tracking-widest mt-2">
                                        — {ARCHETYPE.name} —
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </>
    );
}
