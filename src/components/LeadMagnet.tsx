import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { analytics } from '@/lib/analytics';

export function LeadMagnet() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        try {
            const res = await fetch('/api/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (res.ok) {
                analytics.track('lead_magnet_section_submitted', { email });
                localStorage.setItem('lead_captured', 'true');
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error('Error submitting lead:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="my-20 p-12 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl text-center animate-in zoom-in duration-500">
                <div className="inline-flex p-4 bg-emerald-500/20 rounded-full mb-6">
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">Protocol Dispatched.</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                    Check your inbox. The 7-Day Stoic Fatherhood Guide is on its way. Use it well.
                </p>
            </div>
        );
    }

    return (
        <section className="my-32 relative overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/50">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

            <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16">
                <div className="space-y-8 relative z-10">
                    <div>
                        <span className="text-amber-500 font-black tracking-[0.3em] text-[10px] uppercase mb-4 block">Free Resource</span>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight uppercase">
                            The 7-Day <br />
                            <span className="text-burnished-amber">Stoic Protocol</span>
                        </h2>
                    </div>

                    <p className="text-xl text-slate-400 leading-relaxed font-light">
                        Stop reacting. Start leading. Our tactical guide gives you the exact morning routine used by the world&apos;s most composed fathers.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="commander@email.com"
                                required
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-12 pr-4 py-4 text-white focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                        >
                            {isLoading ? "Dispatching..." : <>Get The Guide <ArrowRight className="w-5 h-5" /></>}
                        </button>
                    </form>

                    <div className="flex gap-6 pt-4">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[8px] font-bold text-slate-400">
                                    {String.fromCharCode(64 + i)}
                                </div>
                            ))}
                        </div>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-2">
                            Joined by 12,402 Fathers this month
                        </p>
                    </div>
                </div>

                <div className="relative group">
                    <div className="absolute -inset-4 bg-amber-500/10 blur-3xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative aspect-[3/4] w-full max-w-sm mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-black/50 border border-white/5 transform group-hover:-rotate-2 transition-transform duration-500">
                        <img
                            src="/stoic_guide_mockup.png"
                            alt="Stoic Fatherhood Guide Mockup"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
