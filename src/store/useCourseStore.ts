import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Module } from '@/lib/schemas';
import courseData from '@/data';

export interface JournalEntry {
    content: string;
    mood: string;
    timestamp: string;
    wordCount: number;
}

export interface Insight {
    id: string;
    content: string;
    timestamp: string;
}

interface CourseState {
    unlockedIndex: number;
    activeModule: Module | null;
    isLoaded: boolean;
    isPanicMode: boolean;
    journalEntries: Record<number, JournalEntry>; // Map moduleId -> Entry
    insights: Insight[]; // New: AI Insights
    completedDates: string[]; // ISO Date strings 'YYYY-MM-DD'
    theme: 'dark' | 'paper';
    focusMode: boolean;

    // Actions
    setLoaded: () => void;
    unlockNext: () => void;
    setActiveModule: (module: Module | null) => void;
    resetProgress: () => void;
    setPanicMode: (active: boolean) => void;
    saveJournalEntry: (moduleId: number, content: string, mood?: string) => void;
    saveInsight: (content: string) => void; // New Action
    markDateComplete: () => void;
    setTheme: (theme: 'dark' | 'paper') => void;
    setFocusMode: (active: boolean) => void;
    initializeStore: () => void;
    saveProgress: () => void; // Deprecated
}

export const useCourseStore = create<CourseState>()(
    persist(
        (set) => ({
            unlockedIndex: 0,
            activeModule: null,
            isLoaded: false,
            isPanicMode: false,
            journalEntries: {},
            insights: [],
            completedDates: [],
            theme: 'dark',
            focusMode: false,

            setLoaded: () => set({ isLoaded: true }),

            unlockNext: () => set((state) => {
                const maxIndex = courseData.length - 1;
                const nextIndex = state.unlockedIndex + 1;
                return { unlockedIndex: Math.min(nextIndex, maxIndex) };
            }),

            setActiveModule: (module: Module | null) => set({ activeModule: module }),

            resetProgress: () => set({ unlockedIndex: 0, activeModule: null, journalEntries: {}, insights: [], completedDates: [] }),

            setPanicMode: (active: boolean) => set({ isPanicMode: active }),

            saveJournalEntry: (moduleId, content, mood = 'neutral') => set((state) => {
                const entry: JournalEntry = {
                    content,
                    mood,
                    timestamp: new Date().toISOString(),
                    wordCount: content.split(/\s+/).filter(Boolean).length
                };
                return {
                    journalEntries: { ...state.journalEntries, [moduleId]: entry }
                };
            }),

            saveInsight: (content) => set((state) => ({
                insights: [{
                    id: Date.now().toString(),
                    content,
                    timestamp: new Date().toISOString()
                }, ...state.insights]
            })),

            markDateComplete: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                if (state.completedDates.includes(today)) return {};
                return { completedDates: [...state.completedDates, today] };
            }),

            setTheme: (theme) => set({ theme }),

            setFocusMode: (active) => set({ focusMode: active }),

            initializeStore: () => set({ isLoaded: true }),

            saveProgress: () => { },
        }),
        {
            name: 'stoic-dad-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                unlockedIndex: state.unlockedIndex,
                journalEntries: state.journalEntries,
                insights: state.insights, // Persist insights
                completedDates: state.completedDates,
                theme: state.theme
            }),
            onRehydrateStorage: () => (state) => {
                state?.setLoaded();
            }
        }
    )
);
