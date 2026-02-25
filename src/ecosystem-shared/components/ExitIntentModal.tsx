import React, { useState, useEffect } from 'react';
import { X, Star, ArrowRight, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExitIntentModalProps {
    onClose: () => void;
    onClaim: () => void;
    title?: string;
    description?: string;
    cta?: string;
    targetUrl?: string;
}

/**
 * Exit Intent Modal
 * Shown when the user attempts to leave the page.
 */
export const ExitIntentModal: React.FC<ExitIntentModalProps> = ({
    onClose,
    onClaim,
    title = "WAIT! Don't Forge Your Legacy Alone",
    description = "Unlock the full protocol today and get a bonus 'Mental Resilience' guide for free. Special one-time offer.",
    cta = "Claim My Special Offer",
    targetUrl = "https://mcjp.gumroad.com/l/uobtt"
}) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !localStorage.getItem('ecosystem_exit_modal_shown')) {
                setShow(true);
                localStorage.setItem('ecosystem_exit_modal_shown', 'true');
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, []);

    if (!show) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="relative max-w-lg w-full bg-slate-900 border border-amber-500/30 p-8 rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Visual Accents */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full -mr-16 -mt-16" />

                    <button
                        onClick={() => { setShow(false); onClose(); }}
                        className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex flex-col items-center text-center space-y-6">
                        <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                            <Zap className="w-8 h-8 text-amber-500 fill-amber-500" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-white uppercase tracking-tight">{title}</h2>
                            <p className="text-slate-400">{description}</p>
                        </div>

                        <a
                            href={targetUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => { setShow(false); onClaim(); }}
                            className="group w-full flex items-center justify-center gap-3 bg-white text-black font-black py-4 rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
                        >
                            <span>{cta}</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>

                        <button
                            onClick={() => { setShow(false); onClose(); }}
                            className="text-xs font-black text-slate-500 uppercase tracking-widest hover:text-slate-400 transition-colors"
                        >
                            Maybe later, I'll pay full price.
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
