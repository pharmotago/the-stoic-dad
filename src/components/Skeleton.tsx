"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Skeleton({ className, ...props }: SkeletonProps) {
    return (
        <div
            className={cn(
                "animate-pulse rounded-md bg-white/5 backdrop-blur-sm relative overflow-hidden",
                "after:absolute after:inset-0 after:-translate-x-full after:animate-[shimmer_2s_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/5 after:to-transparent",
                className
            )}
            {...props}
        />
    );
}

export function LeaderboardSkeleton() {
    return (
        <div className="space-y-8">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-12 w-32 rounded-xl" />
            </div>

            {/* Banner Skeleton */}
            <Skeleton className="h-32 w-full rounded-3xl" />

            {/* List Skeleton */}
            <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-6 p-5 rounded-2xl border border-white/5">
                        <Skeleton className="h-6 w-10" /> {/* Rank */}
                        <Skeleton className="h-14 w-14 rounded-2xl" /> {/* Avatar */}
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-48" />
                        </div>
                        <Skeleton className="h-10 w-24 rounded-lg" /> {/* XP */}
                    </div>
                ))}
            </div>
        </div>
    );
}
