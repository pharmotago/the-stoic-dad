"use client";

import React from 'react';
import { X, Download, Share2, Trophy, Flame, BookOpen } from 'lucide-react';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { calculateLevel } from '@/lib/gamification';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    totalXp: number;
    streak: number;
    completedModules: number;
}

export function ShareModal({ isOpen, onClose, totalXp, streak, completedModules }: ShareModalProps) {
    const modalRef = useFocusTrap(isOpen);
    const { title } = calculateLevel(totalXp);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div
                ref={modalRef}
                className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
                role="dialog"
                aria-modal="true"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-slate-800/50 hover:bg-slate-700 text-slate-300 rounded-full transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <Share2 className="w-5 h-5 text-amber-500" />
                        Share Progress
                    </h2>

                    <div className="mb-8 w-full transform hover:scale-[1.02] transition-transform duration-300">
                        <div className="bg-slate-950 p-6 rounded-2xl border border-white/10 shadow-inner relative overflow-hidden group">
                            {/* Decorative gradients */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-amber-500 rounded-lg">
                                        <Trophy className="w-5 h-5 text-slate-950" />
                                    </div>
                                    <div>
                                        <div className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Stoic Status</div>
                                        <div className="text-white font-bold">{title}</div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <div className="text-amber-500 font-mono text-lg font-bold">{totalXp}</div>
                                        <div className="text-slate-500 text-[9px] uppercase tracking-tighter">Total XP</div>
                                    </div>
                                    <div className="text-center border-x border-white/5">
                                        <div className="text-orange-500 font-mono text-lg font-bold flex items-center justify-center gap-1">
                                            <Flame className="w-4 h-4" /> {streak}
                                        </div>
                                        <div className="text-slate-500 text-[9px] uppercase tracking-tighter">Streak</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-blue-400 font-mono text-lg font-bold flex items-center justify-center gap-1">
                                            <BookOpen className="w-4 h-4" /> {completedModules}
                                        </div>
                                        <div className="text-slate-500 text-[9px] uppercase tracking-tighter">Day</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 w-full">
                        <button className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" />
                            Save Image
                        </button>
                        <button className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
