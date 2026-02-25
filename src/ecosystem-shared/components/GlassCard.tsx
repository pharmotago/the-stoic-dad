import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    glowColor?: 'emerald' | 'blue' | 'amber' | 'purple';
    hoverEffect?: boolean;
    onClick?: () => void;
}

export function GlassCard({
    children,
    className,
    glowColor = 'emerald',
    hoverEffect = true,
    onClick
}: GlassCardProps) {
    const glowStyles = {
        emerald: 'after:bg-emerald-500/5',
        blue: 'after:bg-blue-500/5',
        amber: 'after:bg-amber-500/5',
        purple: 'after:bg-purple-500/5',
    };

    return (
        <motion.div
            whileHover={hoverEffect ? { y: -4, scale: 1.01 } : {}}
            onClick={onClick}
            className={cn(
                "relative overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6",
                "after:absolute after:inset-0 after:z-0 after:opacity-20 after:blur-[100px]",
                glowStyles[glowColor],
                className
            )}
        >
            <div className="relative z-10">
                {children}
            </div>
        </motion.div>
    );
}
