"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Shield, Lock, Eye, FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
            <main className="container mx-auto px-4 py-12 max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center text-amber-500 hover:text-amber-400 font-black uppercase tracking-widest text-xs mb-12 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Protocol
                </Link>

                <div className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <header className="space-y-4">
                        <div className="flex items-center gap-3 text-amber-500">
                            <Shield className="w-8 h-8" />
                            <span className="text-[10px] font-black tracking-[0.6em] uppercase">Privacy Protocol v1.0</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                            Privacy <br />
                            <span className="text-amber-500">Citadel.</span>
                        </h1>
                        <p className="text-xl text-slate-400 max-w-2xl font-light">
                            Your data is your property. We protect it with Stoic rigor.
                        </p>
                    </header>

                    <div className="grid gap-8">
                        <Section
                            icon={<Eye className="w-6 h-6" />}
                            title="Data Collection"
                            content="We do not require accounts or personal information to use the core Stoic Dad protocol. Your progress, XP, and journal entries are stored locally on your device via browser storage (LocalStorage). This data never leaves your machine unless you choose to export it."
                        />

                        <Section
                            icon={<FileText className="w-6 h-6" />}
                            title="Google AdSense"
                            content="We use Google AdSense to sustain the platform. Google uses cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to users based on their visit to our site and/or other sites on the Internet."
                        />

                        <Section
                            icon={<Lock className="w-6 h-6" />}
                            title="Analytics"
                            content="We use Vercel Analytics to understand aggregate usage patterns and improve the protocol. This data is anonymized and does not track individual identities."
                        />

                        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-2xl space-y-4">
                            <h3 className="text-xl font-bold text-amber-500 uppercase tracking-tight">Cookie Disclosure</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-amber-500 underline">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" className="text-amber-500 underline">www.aboutads.info</a>.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="mt-20 py-12 border-t border-slate-900/50 container mx-auto px-4 max-w-6xl text-center">
                <p className="text-white/20 text-[10px] font-black tracking-widest uppercase">
                    © 2026 MCJP Ecosystem | The Stoic Dad Privacy Protocol
                </p>
            </footer>
        </div>
    );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
    return (
        <div className="space-y-4 border-l-2 border-amber-500/20 pl-8 pb-4">
            <div className="flex items-center gap-3 text-amber-500">
                {icon}
                <h2 className="text-2xl font-black uppercase tracking-tighter">{title}</h2>
            </div>
            <p className="text-slate-400 leading-relaxed font-light">
                {content}
            </p>
        </div>
    );
}
