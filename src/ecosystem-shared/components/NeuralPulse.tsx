import React from 'react';
import { motion } from 'framer-motion';

interface NeuralPulseProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

export function NeuralPulse({ size = 'md', color = '#10b981' }: NeuralPulseProps) {
    const sizes = {
        sm: 'h-2 w-2',
        md: 'h-4 w-4',
        lg: 'h-8 w-8'
    };

    return (
        <div className={`relative ${sizes[size]}`}>
            <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full"
                style={{ backgroundColor: color }}
            />
            <div
                className={`relative ${sizes[size]} rounded-full`}
                style={{ backgroundColor: color }}
            />
        </div>
    );
}
