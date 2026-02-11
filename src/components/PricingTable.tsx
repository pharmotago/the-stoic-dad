import React from 'react';
import { Check, X, Crown } from 'lucide-react';

export function PricingTable() {
    return (
        <div className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Path</h2>
                <p className="text-slate-400 max-w-xl mx-auto">
                    Most fathers stumble through blindly. The Stoic Dad follows a protocol.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Tier */}
                <div className="bg-slate-900/50 rounded-2xl p-8 border border-slate-800">
                    <h3 className="text-xl font-bold text-slate-300 mb-2">The Wanderer</h3>
                    <div className="text-4xl font-bold text-white mb-6">$0</div>
                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-slate-400">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>Module 1 Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-400">
                            <Check className="w-5 h-5 text-emerald-500" />
                            <span>Basic Streak Tracking</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Advanced Modules (2-10)</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Audio Guides</span>
                        </li>
                        <li className="flex items-center gap-3 text-slate-500 opacity-50">
                            <X className="w-5 h-5" />
                            <span>Community Access</span>
                        </li>
                    </ul>
                    <button className="w-full py-3 bg-slate-800 text-slate-300 font-bold rounded-xl pointer-events-none opacity-50">
                        Current Plan
                    </button>
                </div>

                {/* Pro Tier */}
                <div className="relative bg-slate-900 rounded-2xl p-8 border border-amber-500 shadow-2xl shadow-amber-500/10 transform md:scale-105 border-t-amber-400">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-900 text-xs font-bold rounded-full flex items-center gap-1 shadow-lg">
                        <Crown className="w-3 h-3" /> ULTIMATE LEGACY
                    </div>

                    <h3 className="text-xl font-bold text-amber-500 mb-2">The Unshakable Patriarch</h3>
                    <div className="flex items-end gap-2 mb-6">
                        <div className="text-4xl font-bold text-white">$29</div>
                        <div className="text-lg text-slate-500 line-through mb-1">$99</div>
                        <div className="text-xs text-emerald-500 font-bold mb-1 ml-auto animate-pulse">70% OFF TODAY</div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">Full Access (Modules 1-12)</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">Tactical Audio Guides & Scripts</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">"Emergency Toolkit" Lifetime Access</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">MCJP Agent Oversight Support</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => {
                            // This assumes we pass a prop or use a store to trigger the payment modal
                            (window as any).dispatchEvent(new CustomEvent('open-premium-modal'));
                        }}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black rounded-xl text-center transition-all shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-1"
                    >
                        RECLAIM YOUR PEACE →
                    </button>

                    <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest">One-time payment • Secure Stripe Checkout</p>
                </div>
            </div>
        </div>
    );
}
