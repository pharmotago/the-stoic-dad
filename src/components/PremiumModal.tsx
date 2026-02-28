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
    onUnlock: (giftEmail?: string) => void;
    initialPlan?: 'monthly' | 'yearly' | 'lifetime';
    isGift?: boolean;
}

export function PremiumModal({ isOpen, onClose, onUnlock, initialPlan = 'lifetime', isGift: initialGiftMode = false }: PremiumModalProps) {
    const selectedPlan = initialPlan; // Fixed: using prop directly since selection happens in PricingTable
    const [withOrderBump, setWithOrderBump] = useState(false);
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isGift, setIsGift] = useState(initialGiftMode);
    const [giftEmail, setGiftEmail] = useState('');
    const { showToast } = useToast();
    const { play } = useSound();

    const handleStripeCheckout = async () => {
        try {
            setIsProcessing(true);
            play('click');
            triggerHaptic(HapticPatterns.light);

            const priceMap = {
                monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly',
                yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly',
                lifetime: process.env.NEXT_PUBLIC_STRIPE_PRICE_LIFETIME || 'price_lifetime'
            };

            const priceId = priceMap[selectedPlan];
            const { sessionId } = await createCheckoutSession(priceId, {
                addJournal: withOrderBump,
                mode: selectedPlan === 'lifetime' ? 'payment' : 'subscription',
                giftEmail: isGift ? giftEmail : undefined,
            });
            analytics.track('checkout_initiated', { priceId, plan: selectedPlan, withOrderBump, isGift, giftEmail: isGift ? giftEmail : undefined });
            const stripe = await getStripe();

            if (stripe) {
                const { error } = await (stripe as any).redirectToCheckout({ sessionId });
                if (error) throw error;
            }
        } catch (err: any) {
            console.error('Stripe error:', err);
            const errorMessage = err.message || 'Checkout failed. Please try again.';
            showToast(errorMessage, 'error');
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
            setIsProcessing(true);
            play('click');
            triggerHaptic(HapticPatterns.light);

            const res = await fetch('/api/verify-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: code.trim() }),
            });

            const data = await res.json();

            if (res.ok && data.success) {
                onUnlock();
                onClose();
                play('success');
                triggerHaptic(HapticPatterns.success);
                showToast('Premium Access Unlocked! Welcome to the inner circle.', 'success');
                analytics.track('license_key_redeemed', { key: code.trim() });
            } else {
                setError(true);
                play('lock');
                triggerHaptic(HapticPatterns.error);
                showToast(data.error || 'Invalid or used license key', 'error');
                setTimeout(() => setError(false), 2000);
            }
        } catch (err) {
            console.error('Redemption error:', err);
            showToast('Verification failed. Please try again.', 'error');
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
                    title="Close"
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

                    {/* License Key Form */}
                    <form onSubmit={handleSubmit} className="mb-6">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                            Enter Premium License Key
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="STOIC-XXXX-XXXX"
                                className={`flex-1 bg-slate-800 border ${error ? 'border-red-500' : 'border-slate-700'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all font-mono tracking-widest`}
                            />
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3 rounded-xl border border-slate-700 transition-colors disabled:opacity-50"
                            >
                                {isProcessing ? '...' : 'Redeem'}
                            </button>
                        </div>
                        <p className="mt-2 text-[10px] text-slate-500 italic">
                            Key sent via email after purchase
                        </p>
                    </form>

                    {/* Divider */}
                    <div className="relative flex items-center gap-4 py-4 mb-6">
                        <div className="h-px bg-slate-800 flex-1" />
                        <span className="text-xs text-slate-500 font-medium uppercase">Or</span>
                        <div className="h-px bg-slate-800 flex-1" />
                    </div>

                    {/* Gift Option Details */}
                    {isGift && (
                        <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-6">
                            <h4 className="text-sm font-bold text-amber-500 uppercase mb-3 tracking-widest">Recipient Information</h4>
                            <input
                                type="email"
                                value={giftEmail}
                                onChange={(e) => setGiftEmail(e.target.value)}
                                placeholder="Recipient's Email Address"
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:border-amber-500 outline-none"
                                required={isGift}
                            />
                            <p className="text-[10px] text-slate-500 mt-2 italic">
                                We&apos;ll send the protocol activation link to this email immediately after purchase.
                            </p>
                        </div>
                    )}

                    {/* Order Bump */}
                    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 group cursor-pointer" onClick={() => setWithOrderBump(!withOrderBump)}>
                        <div className="flex items-start gap-3">
                            <input
                                type="checkbox"
                                checked={withOrderBump}
                                onChange={() => { }}
                                title="Add The Stoic Journal"
                                className="mt-1 accent-amber-500"
                            />
                            <div>
                                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                    ONE TIME OFFER: The Stoic Journal
                                    <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded animate-pulse uppercase">Save 75%</span>
                                </h4>
                                <p className="text-xs text-slate-400 mt-1">
                                    Add the Notion Stoic Journal template for only <span className="text-white font-bold">$7</span> (Regularly $29). Master your morning review.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="space-y-3">
                        <button
                            onClick={handleStripeCheckout}
                            disabled={isProcessing || (isGift && !giftEmail)}
                            className="group w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? (
                                <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <CreditCard className="w-5 h-5" />
                            )}
                            <span>{isGift ? 'Gift' : 'Get'} {selectedPlan === 'lifetime' ? 'Lifetime' : selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Access {withOrderBump ? '+ Journal' : ''}</span>
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
