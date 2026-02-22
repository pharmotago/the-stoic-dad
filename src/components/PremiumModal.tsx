import React, { useState } from 'react';
import { Lock, Check, X, CreditCard, ArrowRight } from 'lucide-react';
import { useToast } from './Toast';
import { useSound } from '@/lib/sound';
import { triggerHaptic, HapticPatterns } from '@/lib/haptics';
import { getStripe, createCheckoutSession } from '@/lib/stripe';
import { analytics } from '@/lib/analytics';

interface PremiumModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUnlock: () => void;
}

export function PremiumModal({ isOpen, onClose, onUnlock }: PremiumModalProps) {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { showToast } = useToast();
    const { play } = useSound();

    const handleStripeCheckout = async () => {
        try {
            setIsProcessing(true);
            play('click');
            triggerHaptic(HapticPatterns.light);

            const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || 'price_stoic_lifetime';
            const { sessionId } = await createCheckoutSession(priceId);
            analytics.track('checkout_initiated', { priceId });
            const stripe = await getStripe();

            if (stripe) {
                const { error } = await (stripe as any).redirectToCheckout({ sessionId });
                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Stripe error:', err);
            showToast('Checkout failed. Please try again.', 'error');
            play('error');
            triggerHaptic(HapticPatterns.error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim()) return;

        try {
            setIsProcessing(true); // Re-using state for key verification
            const res = await fetch('/api/verify-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: code.trim().toUpperCase() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onUnlock();
                onClose();
                play('success');
                triggerHaptic(HapticPatterns.success);
                showToast('Premium Access Unlocked! Welcome to the inner circle.', 'success');
            } else {
                throw new Error(data.error || 'Invalid code');
            }
        } catch (err: any) {
            setError(true);
            play('lock');
            triggerHaptic(HapticPatterns.error);
            showToast(err.message, 'error');
            setTimeout(() => setError(false), 2000);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 w-full max-w-lg rounded-2xl border border-amber-500/30 shadow-2xl relative overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-500 hover:text-white transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Hero Image / Icon */}
                <div className="bg-gradient-to-b from-amber-500/20 to-transparent p-8 text-center relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-amber-500/20  blur-3xl rounded-full" />
                    <div className="relative z-10 inline-flex p-4 bg-slate-900 rounded-full border border-amber-500/50 mb-4 shadow-xl shadow-amber-500/10">
                        <Lock className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-2">Unlock The Full Protocol</h2>
                    <p className="text-amber-200/80 font-medium">Join 5,000+ Stoic Fathers</p>
                </div>

                <div className="p-8">
                    {/* Benefits */}
                    <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Access to all 10 Advanced Modules</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Tactical audio guides & scripts</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="p-1 bg-emerald-500/10 rounded-full">
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-slate-300">Lifetime updates & community access</span>
                        </div>
                    </div>

                    {/* Access Code Form */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Enter Access Code
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="STOIC..."
                                className={`flex-1 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono tracking-widest`}
                            />
                            <button
                                type="submit"
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl border border-slate-700 transition-colors"
                            >
                                Unlock
                            </button>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4 py-4 mb-6">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span className="text-xs text-slate-500 font-medium uppercase">Or</span>
                        <div className="h-px bg-slate-800 flex-1" />
                    </div>

                    {/* CTA */}
                    <p className="text-sm text-slate-400 text-center mb-4">
                        After secure checkout, an email will arrive instantly with your unique License Key. Paste it above to unlock the app.
                    </p>
                    <div className="space-y-3">
                        <button
                            onClick={handleStripeCheckout}
                            disabled={isProcessing}
                            className="group w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <CreditCard className="w-5 h-5" />
                            )}
                            <span>Get Lifetime Access for $29</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                            Powered by Stripe • Secure Encryption
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
