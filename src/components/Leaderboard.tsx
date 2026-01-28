"use client";

import React, { useState } from 'react';
import { Trophy, Users, Star, Medal, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserProfile } from './UserProfile';

interface LeaderboardEntry {
    rank: number;
    username: string;
    level: string;
    xp: number;
    streak: number;
    isCurrentUser?: boolean;
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    { rank: 1, username: "Marcus A.", level: "Legend", xp: 15400, streak: 420 },
    { rank: 2, username: "Seneca The Younger", level: "Sage", xp: 12500, streak: 365 },
    { rank: 3, username: "Epictetus", level: "Sage", xp: 11200, streak: 300 },
    { rank: 4, username: "Zeno of Citium", level: "Patriarch", xp: 8500, streak: 250 },
    { rank: 5, username: "Cato", level: "Mentor", xp: 6200, streak: 180 },
    { rank: 6, username: "Musonius", level: "Stoic", xp: 4500, streak: 120 },
    { rank: 7, username: "Cleanthes", level: "Philosopher", xp: 3200, streak: 90 },
];

interface LeaderboardProps {
    currentUserXp: number;
    currentUserStreak: number;
}

export function Leaderboard({ currentUserXp, currentUserStreak }: LeaderboardProps) {
    const [filter, setFilter] = useState<'global' | 'friends'>('global');

    // Insert current user into mock data for display
    const userEntry: LeaderboardEntry = {
        rank: 99, // Placeholder
        username: "You",
        level: "Initiate", // Simplified
        xp: currentUserXp,
        streak: currentUserStreak,
        isCurrentUser: true
    };

    // Sort logic would go here in a real app
    const displayData = [...MOCK_LEADERBOARD, userEntry].sort((a, b) => b.xp - a.xp).map((entry, index) => ({
        ...entry,
        rank: index + 1
    }));

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[600px]">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-500/10 rounded-xl">
                        <Trophy className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Leaderboard</h2>
                        <p className="text-slate-400 text-sm">Compare your progress with fellow Stoics</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-800 rounded-xl">
                    <button
                        onClick={() => setFilter('global')}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                            filter === 'global' ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Global
                    </button>
                    <button
                        onClick={() => setFilter('friends')}
                        className={cn(
                            "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all",
                            filter === 'friends' ? "bg-slate-700 text-white shadow-sm" : "text-slate-400 hover:text-slate-300"
                        )}
                    >
                        Friends
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {displayData.map((entry) => (
                    <div
                        key={entry.username}
                        className={cn(
                            "flex items-center gap-4 p-3 rounded-xl border transition-colors",
                            entry.isCurrentUser
                                ? "bg-amber-500/10 border-amber-500/30"
                                : "bg-slate-800/20 border-slate-800/50 hover:bg-slate-800/40"
                        )}
                    >
                        {/* Rank */}
                        <div className={cn(
                            "w-8 h-8 flex items-center justify-center font-bold rounded-full",
                            entry.rank === 1 ? "bg-yellow-500/20 text-yellow-500" :
                                entry.rank === 2 ? "bg-slate-400/20 text-slate-300" :
                                    entry.rank === 3 ? "bg-amber-700/20 text-amber-600" :
                                        "text-slate-500"
                        )}>
                            {entry.rank <= 3 ? <Medal className="w-5 h-5" /> : entry.rank}
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "font-bold truncate",
                                    entry.isCurrentUser ? "text-amber-500" : "text-white"
                                )}>
                                    {entry.username}
                                </span>
                                {entry.isCurrentUser && (
                                    <span className="text-[10px] bg-amber-500 text-slate-900 px-1.5 rounded font-bold">YOU</span>
                                )}
                            </div>
                            <div className="text-xs text-slate-500">{entry.level}</div>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                            <div className="text-sm font-bold text-slate-200">{entry.xp.toLocaleString()} XP</div>
                            <div className="text-xs text-slate-500 flex items-center justify-end gap-1">
                                <Shield className="w-3 h-3" />
                                {entry.streak} day streak
                            </div>
                        </div>
                    </div>
                ))}

                {filter === 'friends' && (
                    <div className="text-center py-10 text-slate-500">
                        <Users className="w-10 h-10 mx-auto mb-3 opacity-20" />
                        <p>No friends added yet.</p>
                        <button className="mt-4 text-amber-500 text-sm hover:underline">Invite Friends</button>
                    </div>
                )}
            </div>
        </div>
    );
}
