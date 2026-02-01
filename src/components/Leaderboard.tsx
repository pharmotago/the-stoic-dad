'use client';

import React, { useState } from 'react';
import { Trophy, Medal, Crown, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/store/useLanguageStore';

interface LeaderboardUser {
    id: string;
    rank: number;
    name: string;
    xp: number;
    avatar_color: string;
    streak: number;
    isCurrentUser?: boolean;
    language: string;
    flag: string;
}

// Mock Leaderboard Data
const MOCK_LEADERBOARD: LeaderboardUser[] = [
    { id: '1', rank: 1, name: 'LinguaMaster99', xp: 12500, avatar_color: 'bg-purple-500', streak: 45, language: 'Japanese', flag: '🇯🇵' },
    { id: '2', rank: 2, name: 'PolyglotPrime', xp: 11200, avatar_color: 'bg-blue-500', streak: 32, language: 'Spanish', flag: '🇪🇸' },
    { id: '3', rank: 3, name: 'SoraExplorer', xp: 9800, avatar_color: 'bg-emerald-500', streak: 12, language: 'French', flag: '🇫🇷' },
    { id: '4', rank: 4, name: 'ZenLearner', xp: 8500, avatar_color: 'bg-amber-500', streak: 8, language: 'Italian', flag: '🇮🇹' },
    { id: '5', rank: 5, name: 'ArcticFox', xp: 7200, avatar_color: 'bg-indigo-500', streak: 5, language: 'German', flag: '🇩🇪' },
];

interface LeaderboardProps {
    currentUserXp: number;
    currentUserStreak: number;
}

export function Leaderboard({ currentUserXp, currentUserStreak }: LeaderboardProps) {
    const { skillLevel } = useLanguageStore();
    const [timeframe, setTimeframe] = useState<'weekly' | 'all-time'>('weekly');

    // Simulate current user relative to leaderboard
    const currentUserMock: LeaderboardUser = {
        id: 'user',
        rank: 6,
        name: 'You',
        xp: currentUserXp,
        avatar_color: 'bg-fuchsia-500',
        streak: currentUserStreak,
        language: 'English',
        flag: '🌎',
        isCurrentUser: true
    };

    const displayUsers = [...MOCK_LEADERBOARD, currentUserMock];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <Crown className="w-10 h-10 text-amber-400 animate-float" />
                        Leaderboard
                    </h2>
                    <p className="text-slate-400 mt-1">Daily virtue competition with the Brotherhood.</p>
                </motion.div>

                <div className="flex glass-premium p-1.5 rounded-xl border border-white/5">
                    <button
                        onClick={() => setTimeframe('weekly')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${timeframe === 'weekly' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setTimeframe('all-time')}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 ${timeframe === 'all-time' ? 'bg-amber-500 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
                            }`}
                    >
                        All Time
                    </button>
                </div>
            </div>

            {/* League Banner */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-3d bg-gradient-to-br from-amber-500/20 via-slate-900/40 to-purple-500/20 p-8 rounded-3xl flex items-center justify-between"
            >
                <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 rounded-2xl rotate-3 flex items-center justify-center shadow-2xl shadow-amber-500/40 border border-amber-200/30">
                        <Medal className="w-8 h-8 text-slate-950" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-1">Gold League</h3>
                        <p className="text-slate-300">Top 10 advance to <span className="text-amber-400 font-bold">Diamond League</span></p>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black text-white tracking-widest">4D : 12H</div>
                    <div className="text-xs text-amber-500/60 uppercase font-black tracking-[0.2em]">SEASON ENDS</div>
                </div>
            </motion.div>

            {/* Leaderboard List */}
            <div className="space-y-4">
                {displayUsers.map((user, index) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                        className={`relative group flex items-center gap-6 p-5 rounded-2xl border transition-all duration-500 ${user.isCurrentUser
                            ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.1)] sticky bottom-4 z-10 backdrop-blur-xl'
                            : 'glass-premium border-white/5 hover:border-white/20 hover:bg-white/5'
                            }`}
                    >
                        {/* Rank */}
                        <div className="w-10 flex justify-center items-baseline">
                            {user.rank === 1 ? <Crown className="w-6 h-6 text-amber-400" /> :
                                user.rank === 2 ? <Medal className="w-6 h-6 text-slate-300" /> :
                                    user.rank === 3 ? <Medal className="w-6 h-6 text-amber-700" /> :
                                        <span className="text-slate-500 font-black italic">{user.rank}</span>}
                        </div>

                        {/* Avatar */}
                        <div className={`w-14 h-14 rounded-2xl ${user.avatar_color} p-0.5 shadow-2xl`}>
                            <div className="w-full h-full bg-slate-950/20 rounded-[14px] flex items-center justify-center text-xl text-white font-black">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                                <span className={`text-lg font-bold ${user.isCurrentUser ? 'text-amber-400' : 'text-slate-100'}`}>
                                    {user.name}
                                </span>
                                {user.isCurrentUser && (
                                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded-full text-[10px] uppercase font-black tracking-wider">
                                        You
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-xs">
                                <span className="flex items-center gap-1.5 text-slate-400">
                                    <span className="opacity-80">{user.flag}</span> {user.language}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-400/80 font-bold">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    {user.streak} DAY STREAK
                                </span>
                            </div>
                        </div>

                        {/* XP */}
                        <div className="text-right">
                            <div className={`text-xl font-black ${user.isCurrentUser ? 'text-amber-400' : 'text-white'}`}>
                                {user.xp.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">XP POINTS</div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
