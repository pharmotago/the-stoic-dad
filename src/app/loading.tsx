export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-amber-900/30 border-t-amber-500 rounded-full animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-slate-900" />
                </div>
            </div>
            <p className="mt-4 text-amber-500/50 font-serif animate-pulse tracking-widest text-sm">
                PREPARING THE STOA...
            </p>
        </div>
    );
}
