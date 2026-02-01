'use client';

import { useEffect } from 'react';
import { OctagonAlert, RotateCcw } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <div className="p-4 bg-red-900/20 rounded-full mb-6 ring-1 ring-red-500/50">
                <OctagonAlert className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-400 mb-8 max-w-md">
                "It is not what happens to you, but how you react to it that matters."
                <br />
                <span className="text-sm italic text-slate-600 mt-2 block">- Epictetus (and the App)</span>
            </p>
            <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-3 bg-red-900/20 hover:bg-red-900/40 text-red-100 rounded-lg transition-all border border-red-900/50 group"
            >
                <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                Try again
            </button>
        </div>
    );
}
