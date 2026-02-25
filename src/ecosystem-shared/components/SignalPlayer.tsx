import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn'; // Assuming we have a cn utility
import { GlassCard } from './GlassCard';
import { NeuralPulse } from './NeuralPulse';

interface SignalPlayerProps {
    playbackId: string;
    title?: string;
    poster?: string;
    className?: string;
    accentColor?: 'emerald' | 'blue' | 'purple' | 'amber';
    showInsights?: boolean;
    onEnded?: () => void;
}

export const SignalPlayer: React.FC<SignalPlayerProps> = ({
    playbackId,
    title,
    poster,
    className,
    accentColor = 'emerald',
    showInsights = false,
    onEnded
}) => {
    // Note: showInsights can be used in future versions to toggle metadata overlays
    const colorMap = {
        emerald: 'emerald-500',
        blue: 'blue-500',
        purple: 'purple-500',
        amber: 'amber-500'
    };

    const glowColor = colorMap[accentColor];

    return (
        <div className={cn("relative group", className)}>
            {/* High-Fidelity Outer Glow */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                    scale: [1, 1.05, 1],
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className={cn(
                    "absolute -inset-1 rounded-[2.5rem] blur-2xl pointer-events-none",
                    `bg-${glowColor}`
                )}
            />

            <GlassCard
                glowColor={accentColor}
                className="p-1 overflow-hidden border-white/10"
            >
                <div className="relative rounded-[1.8rem] overflow-hidden bg-slate-950 aspect-video shadow-2xl">
                    <MuxPlayer
                        playbackId={playbackId}
                        metadata={{
                            video_title: title,
                        }}
                        poster={poster}
                        streamType="on-demand"
                        onEnded={onEnded}
                        className="w-full h-full"
                        accentColor={accentColor === 'emerald' ? '#10b981' : undefined} // Custom accent for Mux UI
                    />

                    {/* Neural Pulse Overlay (Top Left) */}
                    <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                        <NeuralPulse size="sm" color={accentColor === 'emerald' ? '#10b981' : '#3b82f6'} />
                        <span className="text-[10px] font-black tracking-widest uppercase text-white/70">
                            High-Fidelity Signal
                        </span>
                    </div>

                    {/* Metadata Overlay (Bottom Left) */}
                    {title && (
                        <div className="absolute bottom-4 left-4 z-10 pointer-events-none">
                            <h3 className="text-sm font-black uppercase tracking-tight text-white/90 drop-shadow-lg">
                                {title}
                            </h3>
                        </div>
                    )}
                </div>
            </GlassCard>
        </div>
    );
};
