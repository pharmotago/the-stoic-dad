import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface CrossPromoProps {
    id: string;
    targetAppName: string;
    hook: string;
    cta: string;
    url: string;
    icon: React.ElementType;
    color?: 'emerald' | 'blue' | 'amber' | 'purple';
    isVisible: boolean;
    onClose: () => void;
}

/**
 * Shared Cross-Promotion Component
 * Used to recommend other ecosystem apps contextually.
 */
export const CrossPromo: React.FC<CrossPromoProps> = ({
    id,
    targetAppName,
    hook,
    cta,
    url,
    icon: Icon,
    color = 'emerald',
    isVisible,
    onClose
}) => {
    // Prevent showing if already dismissed this session
    const storageKey = `ecosystem_promo_dismissed_${id}`;
    const [isDismissed, setIsDismissed] = React.useState(false);

    React.useEffect(() => {
        if (typeof window !== 'undefined' && localStorage.getItem(storageKey)) {
            setIsDismissed(true);
        }
    }, [storageKey]);

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem(storageKey, 'true');
        onClose();
    };

    if (isDismissed || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="fixed bottom-6 right-6 z-[60] max-w-sm w-full"
            >
                <GlassCard glowColor={color} className="p-0 border-amber-500/20 shadow-2xl overflow-hidden">
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 text-slate-500 hover:text-white transition-colors z-20"
                    >
                        <X size={14} />
                    </button>

                    <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className={`p-2 bg-${color}-500/20 rounded-xl`}>
                                <Icon className={`w-5 h-5 text-${color}-400`} />
                            </div>
                            <div className="text-[10px] font-black tracking-widest text-slate-500 uppercase">
                                Recommended for you
                            </div>
                        </div>

                        <div className="space-y-1">
                            <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
                                {targetAppName}
                                <Sparkles size={14} className="text-amber-500 animate-pulse" />
                            </h3>
                            <p className="text-sm text-slate-400 leading-snug">
                                {hook}
                            </p>
                        </div>

                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-center gap-2 w-full py-3 bg-${color}-500 text-slate-950 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-${color}-400 transition-all transform active:scale-95 shadow-lg shadow-${color}-500/20`}
                        >
                            {cta}
                            <ArrowRight size={14} />
                        </a>
                    </div>
                </GlassCard>
            </motion.div>
        </AnimatePresence>
    );
};
