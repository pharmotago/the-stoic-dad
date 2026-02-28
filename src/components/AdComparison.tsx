import React from 'react';
import { X, Check, Zap } from 'lucide-react';

export function AdComparison() {
    return (
        <section className="py-24 bg-slate-950/50 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 uppercase tracking-tighter">
                        The Cost of <span className="text-red-500">Wandering</span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                        Most fathers lose their composure because they lack a protocol. Stoicism is the defensive line for your sanity.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
                    {/* The Wanderer */}
                    <div className="p-12 bg-slate-900/50 border-r border-slate-800">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <X className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-400 uppercase tracking-widest">The Wanderer</h3>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-slate-500">
                                <X className="w-5 h-5 mt-1 shrink-0" />
                                <span>Reacts purely on emotion to child's tantrums</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-500">
                                <X className="w-5 h-5 mt-1 shrink-0" />
                                <span>Carries work stress into the dinner table</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-500">
                                <X className="w-5 h-5 mt-1 shrink-0" />
                                <span>Lacks a daily mental framework for resilience</span>
                            </li>
                            <li className="flex items-start gap-4 text-slate-500 opacity-60">
                                <X className="w-5 h-5 mt-1 shrink-0" />
                                <span>No connection to ancestral values or wisdom</span>
                            </li>
                        </ul>
                        <div className="mt-12 pt-8 border-t border-slate-800">
                            <p className="text-red-500/60 font-mono text-sm uppercase tracking-widest">Outcome: Burnout & Regret</p>
                        </div>
                    </div>

                    {/* The Stoic Dad */}
                    <div className="p-12 bg-gradient-to-br from-slate-900 to-slate-950 relative">
                        <div className="absolute top-0 right-0 p-4">
                            <Zap className="w-12 h-12 text-amber-500/10" />
                        </div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-amber-500/10 rounded-lg">
                                <Check className="w-6 h-6 text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-amber-500 uppercase tracking-widest">The Stoic Dad</h3>
                        </div>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4 text-white">
                                <Check className="w-5 h-5 mt-1 shrink-0 text-emerald-500" />
                                <span className="font-medium">Maintains the "Inner Citadel" during chaos</span>
                            </li>
                            <li className="flex items-start gap-4 text-white">
                                <Check className="w-5 h-5 mt-1 shrink-0 text-emerald-500" />
                                <span className="font-medium">Translates ancient wisdom into modern patience</span>
                            </li>
                            <li className="flex items-start gap-4 text-white">
                                <Check className="w-5 h-5 mt-1 shrink-0 text-emerald-500" />
                                <span className="font-medium">Follows a 12-week protocol for legacy building</span>
                            </li>
                            <li className="flex items-start gap-4 text-white">
                                <Check className="w-5 h-5 mt-1 shrink-0 text-emerald-500" />
                                <span className="font-medium">AI Marcus: A 24/7 advisor in your pocket</span>
                            </li>
                        </ul>
                        <div className="mt-12 pt-8 border-t border-amber-500/20">
                            <p className="text-emerald-500 font-mono text-sm uppercase tracking-widest">Outcome: Resilience & Respect</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <button
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-4 bg-white text-slate-950 font-black rounded-full hover:bg-amber-500 transition-all transform hover:scale-110 shadow-xl shadow-white/5 active:scale-95"
                    >
                        CHOOSE YOUR PATH ABOVE ↑
                    </button>
                </div>
            </div>
        </section>
    );
}

