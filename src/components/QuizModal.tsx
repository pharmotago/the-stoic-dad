"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Module } from '@/lib/schemas';
import { X, Check, AlertCircle, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizModalProps {
    module: Module;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function QuizModal({ module, isOpen, onClose, onSuccess }: QuizModalProps) {
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // BACKWARDS COMPATIBILITY: Check for legacy 'quiz' object if 'questions' is missing
    let questions = module.content.questions || [];

    // If no questions array but legacy quiz object exists, convert it
    if (questions.length === 0 && module.content.quiz) {
        questions = [{
            question: module.content.quiz.question,
            options: module.content.quiz.options,
            correctAnswer: module.content.quiz.correctAnswer,
            explanation: "Review the lesson content to understand the correct principle."
        } as any];
    }

    // FALLBACK: Use Audit questions if no multiple choice exists
    if (questions.length === 0 && module.content.audit?.length) {
        questions = module.content.audit.map(q => ({
            question: q,
            options: ["I have meditated on this", "I will apply this tonight", "I need more practice"],
            correctAnswer: -1,
            explanation: "Insight is the fruit of honest reflection. Keep building your Inner Citadel."
        }));
    }

    // FINAL FALLBACK: General Knowledge Check
    if (questions.length === 0) {
        questions = [{
            question: "Have you fully internalized today's core principle and the Dichotomy of Control?",
            options: ["Yes, I am focused on my internals", "I am still practicing", "I will re-read the lesson"],
            correctAnswer: -1,
            explanation: "Progress, not perfection, is the goal of the Stoic Dad."
        }];
    }

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleSubmit = () => {
        if (selectedOption === null) return;

        setHasSubmitted(true);
        const correct = currentQuestion.correctAnswer === -1 ? true : selectedOption === currentQuestion.correctAnswer;
        setIsCorrect(correct);

        if (correct) {
            if (isLastQuestion) {
                confetti({
                    particleCount: 150,
                    spread: 100,
                    origin: { y: 0.6 },
                    colors: ['#f59e0b', '#fbbf24', '#ffffff', '#8b5cf6']
                });
                setTimeout(() => {
                    onSuccess();
                    resetState();
                }, 2500);
            } else {
                setTimeout(() => {
                    setCurrentQuestionIndex(prev => prev + 1);
                    resetState();
                }, 1500);
            }
        }
    };

    const resetState = () => {
        setSelectedOption(null);
        setHasSubmitted(false);
        setIsCorrect(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="glass-3d w-full max-w-xl rounded-[32px] relative overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-3">
                                    <div className="p-2 bg-amber-500/20 rounded-xl">
                                        <Trophy className="w-6 h-6 text-amber-500" />
                                    </div>
                                    The Crucible
                                </h3>
                                {questions.length > 1 && (
                                    <div className="flex gap-2 mt-4">
                                        {questions.map((_, i) => (
                                            <motion.div
                                                key={i}
                                                initial={false}
                                                animate={{
                                                    width: i === currentQuestionIndex ? 32 : 12,
                                                    backgroundColor: i < currentQuestionIndex ? "#10b981" : i === currentQuestionIndex ? "#f59e0b" : "#1e293b"
                                                }}
                                                className="h-1.5 rounded-full"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl transition-all text-slate-400 hover:text-white group">
                                <X className="w-6 h-6 group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-8 overflow-y-auto custom-scrollbar">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentQuestionIndex}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                >
                                    <p className="text-xl text-white font-bold mb-8 leading-relaxed">
                                        {currentQuestion?.question}
                                    </p>

                                    <div className="space-y-4">
                                        {currentQuestion?.options.map((option, idx) => {
                                            const isSelected = selectedOption === idx;
                                            let stateClasses = "border-white/5 bg-white/5 hover:bg-white/10";

                                            if (hasSubmitted && isSelected) {
                                                stateClasses = isCorrect
                                                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
                                                    : "border-red-500/50 bg-red-500/10 text-red-100 shadow-[0_0_20px_rgba(239,68,68,0.1)]";
                                            } else if (isSelected) {
                                                stateClasses = "border-amber-500/50 bg-amber-500/10 text-amber-100 shadow-[0_0_20px_rgba(245,158,11,0.1)]";
                                            }

                                            return (
                                                <motion.button
                                                    key={idx}
                                                    whileHover={{ x: 5 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => !hasSubmitted && setSelectedOption(idx)}
                                                    disabled={hasSubmitted}
                                                    className={cn(
                                                        "w-full text-left p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between group",
                                                        stateClasses
                                                    )}
                                                >
                                                    <span className="font-medium text-lg">{option}</span>
                                                    <div className={cn(
                                                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                                                        isSelected ? "border-amber-500" : "border-white/10"
                                                    )}>
                                                        {hasSubmitted && isSelected && (
                                                            isCorrect ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-red-500" />
                                                        )}
                                                        {isSelected && !hasSubmitted && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                                                    </div>
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            <AnimatePresence>
                                {hasSubmitted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "mt-8 p-6 rounded-2xl border backdrop-blur-md transition-all",
                                            isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20"
                                        )}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={cn(
                                                "p-2 rounded-xl mt-0.5",
                                                isCorrect ? "bg-emerald-500/20" : "bg-red-500/20"
                                            )}>
                                                {isCorrect ? (
                                                    <Check className="w-5 h-5 text-emerald-500" />
                                                ) : (
                                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className={cn(
                                                    "font-black uppercase tracking-widest text-xs mb-1",
                                                    isCorrect ? "text-emerald-400" : "text-red-400"
                                                )}>
                                                    {isCorrect ? "Virtue Manifested" : "Lesson Observed"}
                                                </h4>
                                                <p className="text-slate-200 leading-relaxed">
                                                    {isCorrect ? (currentQuestion.explanation || "Well reasoned. You have internalized the principle.") : "Take heart. Even the great Emperors stumbled. Reflect on the choice and try again."}
                                                </p>
                                                {!isCorrect && (
                                                    <button
                                                        onClick={resetState}
                                                        className="mt-4 text-red-400 hover:text-red-300 font-bold text-sm underline underline-offset-4"
                                                    >
                                                        Retry Reflection
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-8 border-t border-white/5 bg-white/5 backdrop-blur-xl">
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={handleSubmit}
                                disabled={selectedOption === null || (hasSubmitted && isCorrect)}
                                className="w-full py-5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 text-slate-950 font-black rounded-2xl transition-all shadow-2xl shadow-amber-500/20 uppercase tracking-widest"
                            >
                                {hasSubmitted ? (isCorrect ? (isLastQuestion ? "Internalizing..." : "Next Question") : "Observation Complete") : "Submit Reflection"}
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
