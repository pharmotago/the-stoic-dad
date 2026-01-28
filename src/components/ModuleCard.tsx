import React from 'react';
import { Lock, CheckCircle, Circle, PlayCircle } from 'lucide-react';
import { Module } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface ModuleCardProps {
    module: Module;
    isActive: boolean;
    isCompleted: boolean;
    isLocked: boolean;
    onClick: () => void;
}

export function ModuleCard({ module, isActive, isCompleted, isLocked, onClick }: ModuleCardProps) {
    return (
        <div
            onClick={!isLocked ? onClick : undefined}
            className={cn(
                "relative p-4 rounded-xl border transition-all duration-300 group cursor-pointer overflow-hidden",
                isActive
                    ? "bg-slate-800/80 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40",
                isLocked && "opacity-50 cursor-not-allowed hover:bg-slate-900 hover:border-slate-800"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                            "text-xs font-bold uppercase tracking-wider",
                            isActive ? "text-amber-500" : "text-slate-500"
                        )}>
                            Day {module.id}
                        </span>
                        {isCompleted && <CheckCircle className="w-3 h-3 text-emerald-500" />}
                    </div>

                    <h3 className={cn(
                        "font-semibold text-lg mb-1 group-hover:text-amber-100 transition-colors",
                        isActive ? "text-white" : "text-slate-300"
                    )}>
                        {module.title}
                    </h3>

                    <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {module.summary}
                    </p>
                </div>

                <div className="flex-shrink-0 mt-1">
                    {isLocked ? (
                        <Lock className="w-5 h-5 text-slate-600" />
                    ) : isActive ? (
                        <PlayCircle className="w-6 h-6 text-amber-500 animate-pulse" />
                    ) : isCompleted ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                        </div>
                    ) : (
                        <Circle className="w-5 h-5 text-slate-600 group-hover:text-slate-400" />
                    )}
                </div>
            </div>

            {/* ProgressBar for active modules could go here in v2 */}
        </div>
    );
}
