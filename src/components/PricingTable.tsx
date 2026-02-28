import React, { useState, useEffect } from 'react';
import { Check, X, Crown } from 'lucide-react';

export function PricingTable() {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
    const [timeLeft, setTimeLeft] = useState(15 * 60);
    const [isGift, setIsGift] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="py-20">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Path</h2>
                <p className="text-slate-400 max-w-xl mx-auto mb-8">
                    Most fathers stumble through blindly. The Stoic Dad follows a protocol.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <span className={`text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
                    <button
                        onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'yearly' : 'monthly')}
                        title={`Switch to ${billingCycle === 'monthly' ? 'yearly' : 'monthly'} billing`}
                        className="w-14 h-7 bg-slate-800 rounded-full p-1 relative transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    >
                        <div className={`w-5 h-5 bg-amber-500 rounded-full transition-transform duration-300 transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                    <span className={`text-sm font-bold transition-colors ${billingCycle === 'yearly' ? 'text-white' : 'text-slate-500'}`}>
                        Yearly <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-1.5 py-0.5 rounded ml-1">SAVE 45%</span>
                    </span>
                </div>

                {/* Gift Toggle */}
                <div className="flex items-center justify-center gap-2 mb-8 p-3 bg-amber-500/5 rounded-xl border border-amber-500/10 inline-flex mx-auto">
                    <input
                        type="checkbox"
                        id="gift-toggle"
                        checked={isGift}
                        onChange={() => setIsGift(!isGift)}
                        className="w-4 h-4 accent-amber-500"
                    />
                    <label htmlFor="gift-toggle" className="text-sm font-bold text-slate-300 cursor-pointer select-none">
                        Buy this as a gift for another father
                    </label>
                </div>
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

                    <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        <span className="text-red-400 font-mono font-bold text-sm tracking-widest">
                            OFFER EXPIRES IN: {formatTime(timeLeft)}
                        </span>
                    </div>

                    <div className="flex items-end gap-2 mb-6">
                        <div className="text-4xl font-bold text-white">
                            {billingCycle === 'monthly' ? '$14.99' : '$99'}
                        </div>
                        <div className="text-sm text-slate-500 mb-1">
                            {billingCycle === 'monthly' ? '/mo' : '/year'}
                        </div>
                        <div className="text-xs text-emerald-500 font-bold mb-1 ml-auto animate-pulse">
                            {billingCycle === 'yearly' ? 'BEST VALUE' : ''}
                        </div>
                    </div>

                    <ul className="space-y-4 mb-8">
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm font-bold">UNLIMITED AI Coach Chat</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">Full Access (Modules 1-12)</span>
                        </li>
                        <li className="flex items-center gap-3 text-white">
                            <div className="p-1 bg-emerald-500/20 rounded-full"><Check className="w-4 h-4 text-emerald-500" /></div>
                            <span className="text-sm">Tactical Audio Guides & Scripts</span>
                        </li>
                    </ul>

                    <button
                        onClick={() => {
                            (window as any).dispatchEvent(new CustomEvent('open-premium-modal', {
                                detail: {
                                    plan: billingCycle,
                                    isGift: isGift
                                }
                            }));
                        }}
                        className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-900 font-black rounded-xl text-center transition-all shadow-lg hover:shadow-amber-500/40 transform hover:-translate-y-1"
                    >
                        {isGift ? 'GIFT THE PROTOCOL →' : 'START PROTOCOL →'}
                    </button>

                    <p className="text-[10px] text-center text-slate-500 mt-4 uppercase tracking-widest">Cancel anytime • Secure Stripe Checkout</p>
                </div>
            </div>
        </div>
    );
}
