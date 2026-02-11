'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { LanguageCoachErrorBoundary } from '@/components/LanguageCoachErrorBoundary';

// Use dynamic import with SSR disabled to prevent static generation errors
// for components relying on client-side state/persistence.
const LanguageCoach = dynamic(
    () => import('@/components/LanguageCoach').then(mod => mod.LanguageCoach),
    { ssr: false }
);

import { SoundProvider } from '@/lib/sound';

export default function LanguagePage() {
    return (
        <SoundProvider>
            <LanguageCoachErrorBoundary>
                <LanguageCoach />
            </LanguageCoachErrorBoundary>
        </SoundProvider>
    );
}
