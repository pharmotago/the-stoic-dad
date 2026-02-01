'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ToastProvider } from './ToastProvider';

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <ToastProvider>
            <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] px-4 py-2 bg-amber-500 text-slate-900 font-bold rounded-lg shadow-xl">
                Skip to Content
            </a>
            <AnimatePresence mode="wait">
                <motion.div
                    id="main-content"
                    key={pathname}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                    {children}
                </motion.div>
            </AnimatePresence>
        </ToastProvider>
    );
}
