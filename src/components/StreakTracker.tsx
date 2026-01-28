import React from 'react';
import { Flame, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreakTrackerProps {
    currentStreak: number;
    longestStreak: number;
    lastCheckIn: string | null;
}

export function StreakTracker({ currentStreak, longestStreak, lastCheckIn }: StreakTrackerProps) {
    const today = new Date().toDateString();
    const checkedInToday = lastCheckIn === today;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 relative overflow-hidden">
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Flame className={cn(
                            "w-6 h-6 transition-all duration-300",
                            currentStreak > 0 ? "text-amber-500 animate-pulse" : "text-slate-600"
                        )} />
                        <h3 className="text-lg font-bold text-white">Daily Discipline</h3>
                    </div>

                    {checkedInToday && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-xs font-medium text-emerald-400">Today</span>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div className="text-3xl font-bold text-amber-500 mb-1">
                            {currentStreak}
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Current Streak</div>
                    </div>

                    <div className="text-center p-4 bg-slate-950/50 rounded-xl border border-slate-800">
                        <div className="text-3xl font-bold text-slate-300 mb-1">
                            {longestStreak}
                        </div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Best Streak</div>
                    </div>
                </div>

                {currentStreak >= 3 && (
                    <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                        <p className="text-sm text-amber-200/90 italic text-center">
                            "{currentStreak >= 30 ? 'The chains of habit are too weak to be felt until they are too strong to be broken.' :
                                currentStreak >= 7 ? 'Persistence is the virtue of the wise.' :
                                    'The journey of a thousand miles begins with one step.'}"
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
