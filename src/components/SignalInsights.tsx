import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, Sparkles, MessageSquare, Zap } from 'lucide-react';
import { GlassCard, NeuralPulse } from '@/ecosystem-shared';

interface Segment {
    id: number;
    audio_text: string;
    character_prompt: string;
    visual_prompt: string;
}

interface SignalInsightsProps {
    segments: Segment[];
    accentColor?: 'emerald' | 'blue' | 'purple' | 'amber';
}

export const SignalInsights: React.FC<SignalInsightsProps> = ({ segments, accentColor = 'amber' }) => {
    return (
        <div className="mt-12 space-y-8">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${accentColor}-500/10 border border-${accentColor}-500/20`}>
                        <BrainCircuit className={`text-${accentColor}-400`} size={20} />
                    </div>
                    <div>
                        <h4 className="text-lg font-black uppercase tracking-tight text-white">Neuro-Intelligence Panel</h4>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Underlying Signal Logic // Decrypted</p>
                    </div>
                </div>
                <NeuralPulse size="sm" color={accentColor === 'amber' ? '#f59e0b' : '#10b981'} />
            </header>

            <div className="grid grid-cols-1 gap-4">
                {segments.map((segment, idx) => (
                    <motion.div
                        key={segment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <GlassCard glowColor={accentColor} className="p-6 border-white/5 bg-white/[0.02]">
                            <div className="flex gap-6">
                                <div className="flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-500">
                                        {segment.id.toString().padStart(2, '0')}
                                    </div>
                                    <div className="flex-grow w-[1px] bg-gradient-to-b from-white/10 to-transparent" />
                                </div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-start gap-2">
                                        <MessageSquare size={14} className={`mt-1 text-${accentColor}-400 opacity-60`} />
                                        <p className="text-sm font-medium text-white/90 leading-relaxed italic">
                                            &ldquo;{segment.audio_text}&rdquo;
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Cpu size={10} className="text-slate-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Cognitive Prompting</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium leading-normal">
                                                {segment.character_prompt}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Sparkles size={10} className="text-slate-500" />
                                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Visual Synthesis</span>
                                            </div>
                                            <p className="text-[11px] text-slate-400 font-medium leading-normal text-glow">
                                                {segment.visual_prompt}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            <footer className="pt-8 border-t border-white/5 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full bg-white/5">
                    <Zap size={12} className="text-amber-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        Signal Synchronized // High-Fidelity Verification Complete
                    </span>
                </div>
            </footer>
        </div>
    );
};
