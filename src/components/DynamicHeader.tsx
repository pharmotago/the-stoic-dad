"use client";

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Flame, Trophy, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicHeaderProps {
    completionPercentage: number;
    currentStreak: number;
    completedCount: number;
    totalCount: number;
    onMobileMenuToggle?: () => void;
}

export function DynamicHeader({
    completionPercentage,
    currentStreak,
    completedCount,
    totalCount,
    onMobileMenuToggle
}: DynamicHeaderProps) {
    const { scrollY } = useScroll();

    // Transform values based on scroll
    const headerBg = useTransform(
        scrollY,
        [0, 50],
        ["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.8)"]
    );
    const headerBlur = useTransform(
        scrollY,
        [0, 50],
        ["blur(0px)", "blur(12px)"]
    );
    const headerBorder = useTransform(
        scrollY,
        [0, 50],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.1)"]
    );
    const headerPadding = useTransform(
        scrollY,
        [0, 50],
        ["1.5rem", "1rem"]
    );

    return (
        <motion.header
            style={{
                backgroundColor: headerBg,
                backdropFilter: headerBlur,
                borderBottomColor: headerBorder,
                paddingTop: headerPadding,
                paddingBottom: headerPadding
            }}
            className="sticky top-0 z-50 border-b transition-colors duration-300"
        >
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between">
                    {/* Logo Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-xl"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        role="button"
                        tabIndex={0}
                        aria-label="The Stoic Dad logo, scroll to top"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); } }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full group-hover:bg-amber-500/40 transition-colors" />
                            <div className="relative p-2.5 bg-slate-900 border border-white/10 rounded-xl glass-3d">
                                <Shield className="w-6 h-6 text-amber-500" />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                                The Stoic Dad
                            </h1>
                            <p className="text-[10px] text-amber-500/60 font-black uppercase tracking-[0.2em] mt-1">
                                Imperial Protocol
                            </p>
                        </div>
                    </motion.div>

                    {/* Desktop Stats */}
                    <div className="hidden lg:flex items-center gap-8">
                        <div className="flex items-center gap-6">
                            <StatItem
                                icon={<Flame className={cn("w-4 h-4", currentStreak > 0 ? "text-orange-500" : "text-slate-500")} />}
                                label="Daily Streak"
                                value={`${currentStreak} Days`}
                            />
                            <div className="w-px h-8 bg-white/5" />
                            <StatItem
                                icon={<Trophy className="w-4 h-4 text-purple-500" />}
                                label="Mastery"
                                value={`${completedCount}/${totalCount}`}
                            />
                        </div>

                        <div className="w-48 space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-500">Global Progress</span>
                                <span className="text-amber-500">{Math.round(completionPercentage)}%</span>
                            </div>
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${completionPercentage}%` }}
                                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={onMobileMenuToggle}
                        className="lg:hidden p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                        aria-label="Open mobile menu"
                    >
                        <Menu className="w-6 h-6 text-slate-300" aria-hidden="true" />
                    </button>
                </div>
            </div>
        </motion.header>
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 border border-white/5 rounded-xl">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mb-1">
                    {label}
                </p>
                <p className="text-sm font-bold text-slate-200 leading-none">
                    {value}
                </p>
            </div>
        </div>
    );
}
