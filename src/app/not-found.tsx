import Link from 'next/link';
import { Home, MoveLeft } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
            <h1 className="text-9xl font-black text-slate-900 select-none relative">
                404
                <span className="absolute inset-0 text-transparent bg-clip-text bg-gradient-to-b from-amber-900/20 to-transparent blur-sm">404</span>
            </h1>
            <div className="relative z-10 -mt-12 space-y-6">
                <p className="text-xl text-amber-500 font-serif italic">
                    "The obstacle is the way... but this page is not."
                </p>
                <div className="flex gap-4 justify-center">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 bg-amber-900/20 hover:bg-amber-900/40 text-amber-100 rounded-lg transition-all border border-amber-900/50"
                    >
                        <Home className="w-4 h-4" />
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
