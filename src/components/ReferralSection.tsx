"use client";

import React, { useState } from 'react';
import { Gift, Copy, Check, Share2, Twitter } from 'lucide-react';
import { useToast } from './Toast';

export function ReferralSection() {
    const [copied, setCopied] = useState(false);
    const { showToast } = useToast();

    // In a real app, this would be a unique user ID or code
    const referralCode = "STOICDAD_" + Math.random().toString(36).substring(7).toUpperCase();
    const referralLink = `https://thestoicdad.com?ref=${referralCode}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        showToast("Referral link copied to clipboard!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    const shareOnTwitter = () => {
        const text = encodeURIComponent("I'm mastering my inner calm with The Stoic Dad Protocol. Join me and get a 7-day Stoic Fatherhood Guide for free! 🛡️ #StoicDad");
        window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(referralLink)}`, '_blank');
    };

    return (
        <section className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative glass-card border-amber-500/20 p-8 md:p-12 text-center space-y-8">
                <div className="inline-flex items-center justify-center p-4 bg-amber-500/10 rounded-full mb-4">
                    <Gift className="w-8 h-8 text-amber-500 animate-bounce" />
                </div>

                <div className="space-y-4 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">
                        Refer a Fellow <span className="text-amber-500">Father</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Know a dad who's struggling with the chaos? Share the protocol and you both win.
                        Get **1 Week of Pro Access** for every successful referral.
                    </p>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
                    <div className="flex-1 w-full bg-slate-950/50 border border-white/10 px-4 py-3 rounded-xl font-mono text-amber-500/80 text-sm overflow-hidden text-ellipsis whitespace-nowrap">
                        {referralLink}
                    </div>

                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 bg-white text-black font-black uppercase px-6 py-3 rounded-xl hover:bg-amber-500 transition-all active:scale-95 whitespace-nowrap"
                    >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copied' : 'Copy Link'}
                    </button>

                    <button
                        onClick={shareOnTwitter}
                        className="flex items-center gap-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 px-6 py-3 rounded-xl hover:bg-sky-500/20 transition-all active:scale-95"
                    >
                        <Twitter className="w-4 h-4" />
                        Tweet
                    </button>
                </div>

                <div className="pt-4 flex items-center justify-center gap-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        3.2K Referrals this month
                    </span>
                </div>
            </div>
        </section>
    );
}
Riverside
