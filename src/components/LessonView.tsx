import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Module } from '@/lib/schemas';
import { ArrowLeft, BookOpen, Brain, Flame, Maximize2, Minimize2, Lock } from 'lucide-react';
import { LessonAudio } from './LessonAudio';
import { useCourseStore } from '@/store/useCourseStore';
import { cn } from '@/lib/utils';

interface LessonViewProps {
    module: Module;
    onBack: () => void;
    onTakeQuiz: () => void;
}

export function LessonView({ module, onBack, onTakeQuiz }: LessonViewProps) {
    const [isTheaterMode, setIsTheaterMode] = useState(false);

    const toggleTheaterMode = () => setIsTheaterMode(!isTheaterMode);

    return (
        <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-slate-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Path
                </button>
                <button
                    onClick={toggleTheaterMode}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-white/5 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
                >
                    {isTheaterMode ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                    {isTheaterMode ? 'Exit Theater' : 'Theater Mode'}
                </button>
            </div>

            <AnimatePresence>
                {isTheaterMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-2xl p-6 md:p-12 overflow-y-auto flex justify-center"
                    >
                        <div className="max-w-3xl w-full">
                            <button
                                onClick={toggleTheaterMode}
                                className="fixed top-8 right-8 p-3 bg-white/5 rounded-full text-white hover:bg-white/10 transition-all"
                            >
                                <Minimize2 className="w-6 h-6" />
                            </button>
                            <div className="pt-12 pb-24">
                                <LessonContent module={module} onTakeQuiz={onTakeQuiz} theaterMode={true} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!isTheaterMode && (
                <LessonContent module={module} onTakeQuiz={onTakeQuiz} />
            )}
        </div>
    );
}

interface LessonContentProps {
    module: Module;
    onTakeQuiz: () => void;
    theaterMode?: boolean;
}

function LessonContent({ module, onTakeQuiz, theaterMode }: LessonContentProps) {
    // If the module is locked (id > 3 and not premium)
    const isPreviewMode = !useCourseStore(state => state.isPremium) && module.id > 3;

    return (
        <div className={`bg-slate-950 rounded-none p-8 md:p-12 border-l-8 border-amber-600 shadow-2xl relative overflow-hidden group ${theaterMode ? 'bg-transparent border-white/10' : ''}`}>
            {/* Visual Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[80px]" />

            <div className="flex items-start justify-between gap-6 mb-12">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        <span className="text-[10px] font-black tracking-[0.4em] text-amber-500 uppercase">The Steward // Terminal</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-4 leading-none">
                        {module.title}
                    </h2>
                    <p className="text-slate-400 font-medium tracking-tight border-l border-white/10 pl-4">
                        {module.summary}
                    </p>
                </div>
            </div>

            <div className="relative">
                <div className={cn(isPreviewMode && "max-h-64 overflow-hidden blur-[2px] pointer-events-none select-none relative z-0 opacity-80 transition-all duration-1000")}>
                    {/* Advanced Audio Player with TTS Fallback */}
                    <div className="mb-12 p-8 bg-slate-900/50 border border-white/5 relative group/player">
                        <div className="absolute -top-3 left-4 px-2 py-0.5 bg-amber-500 text-[9px] font-black text-black uppercase tracking-widest">Live Transmission</div>
                        <LessonAudio
                            module={module}
                            onNext={onTakeQuiz}
                        />
                    </div>

                    <div className="prose prose-invert prose-emerald max-w-none mb-12">
                        <div className="whitespace-pre-line text-slate-300 leading-relaxed font-serif text-xl tracking-wide selection:bg-amber-500/30 selection:text-amber-100 first-letter:text-5xl first-letter:font-black first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left first-letter:leading-none">
                            {module.content.full_lesson_content}
                        </div>
                    </div>

                    {module.content.challenge && (
                        <div className="bg-slate-900 p-8 border border-amber-900/40 mb-12 relative">
                            <div className="absolute -top-3 right-4 px-2 py-0.5 border border-amber-500/40 text-[9px] font-black text-amber-500 uppercase tracking-widest bg-slate-950">Active Duty</div>
                            <div className="flex items-center gap-3 mb-4 text-amber-500 font-black uppercase tracking-widest text-xs">
                                <Flame className="w-4 h-4" />
                                <span>Forge the Shield</span>
                            </div>
                            <p className="text-xl text-amber-100/80 font-serif italic leading-relaxed">
                                "{module.content.challenge}"
                            </p>
                        </div>
                    )}

                    <button
                        onClick={onTakeQuiz}
                        className="w-full py-6 bg-white text-black font-black uppercase tracking-[0.3em] rounded-none hover:bg-amber-500 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl"
                    >
                        Knowledge Validation
                    </button>
                </div>

                {isPreviewMode && (
                    <div className="absolute inset-x-0 bottom-0 top-32 flex flex-col justify-end items-center p-8 bg-gradient-to-t from-slate-950 px-4 pt-48 via-slate-950/90 to-transparent z-10">
                        <Lock className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
                        <h3 className="text-2xl font-black text-white mb-2 text-center">Unlock The Protocol</h3>
                        <p className="text-slate-400 text-center max-w-md mb-6">
                            This tactic is reserved for the Inner Circle. Reclaim your peace and lead your family with unwavering strength.
                        </p>
                        <button
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.dispatchEvent(new CustomEvent('open-premium-modal'));
                                }
                            }}
                            className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-xl shadow-amber-500/20 transform hover:-translate-y-1 transition-all"
                        >
                            Get Lifetime Access Now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


