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
    completedModules: number[];
    currentStreak: number;
    longestStreak: number;
    lastCheckIn: string | null;
    totalXp: number;
    completedDates: string[]; // ISO Date strings 'YYYY-MM-DD'
    theme: 'dark' | 'paper';
    focusMode: boolean;
    isPremium: boolean;

    // Actions
    setLoaded: () => void;
    unlockNext: () => void;
    setActiveModule: (module: Module | null) => void;
    resetProgress: () => void;
    setPanicMode: (active: boolean) => void;
    saveJournalEntry: (moduleId: number, content: string, mood?: string) => void;
    saveInsight: (content: string) => void; // New Action
    completeModule: (moduleId: number) => void;
    addXp: (amount: number) => void;
    markDateComplete: () => void;
    setTheme: (theme: 'dark' | 'paper') => void;
    setFocusMode: (active: boolean) => void;
    setPremium: (active: boolean) => void;
    initializeStore: () => void;
    saveProgress: () => void; // Deprecated
}

export const useCourseStore = create<CourseState>()(
    persist(
        (set, get) => ({
            unlockedIndex: 0,
            activeModule: null,
            isLoaded: false,
            isPanicMode: false,
            journalEntries: {},
            insights: [],
            completedModules: [],
            currentStreak: 0,
            longestStreak: 0,
            lastCheckIn: null,
            totalXp: 0,
            completedDates: [],
            theme: 'dark',
            focusMode: false,
            isPremium: false,

            setLoaded: () => set({ isLoaded: true }),

            unlockNext: () => set((state) => {
                const maxIndex = courseData.length - 1;
                const nextIndex = state.unlockedIndex + 1;
                return { unlockedIndex: Math.min(nextIndex, maxIndex) };
            }),

            setActiveModule: (module: Module | null) => set({ activeModule: module }),

            resetProgress: () => set({
                unlockedIndex: 0,
                activeModule: null,
                journalEntries: {},
                insights: [],
                completedModules: [],
                currentStreak: 0,
                longestStreak: 0,
                lastCheckIn: null,
                totalXp: 0,
                completedDates: [],
                isPremium: false
            }),

            setPanicMode: (active: boolean) => set({ isPanicMode: active }),

            saveJournalEntry: (moduleId, content, mood = 'neutral') => set((state) => {
                const sanitizedContent = content.replace(/<[^>]*>?/gm, '');
                const entry: JournalEntry = {
                    content: sanitizedContent,
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

            completeModule: (moduleId) => set((state) => {
                if (state.completedModules.includes(moduleId)) return {};

                const newCompleted = [...state.completedModules, moduleId];
                const today = new Date().toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();

                let newStreak = state.currentStreak;
                if (state.lastCheckIn !== today) {
                    if (state.lastCheckIn === yesterday || state.lastCheckIn === null) {
                        newStreak += 1;
                    } else {
                        newStreak = 1;
                    }
                }

                const newLongest = Math.max(newStreak, state.longestStreak);

                return {
                    completedModules: newCompleted,
                    currentStreak: newStreak,
                    longestStreak: newLongest,
                    lastCheckIn: today,
                    unlockedIndex: Math.max(state.unlockedIndex, moduleId) // Unlock next implicitly
                };
            }),

            addXp: (amount) => set((state) => ({ totalXp: state.totalXp + amount })),

            markDateComplete: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                if (state.completedDates.includes(today)) return {};
                return { completedDates: [...state.completedDates, today] };
            }),

            setTheme: (theme) => set({ theme }),

            setFocusMode: (active) => set({ focusMode: active }),

            setPremium: (active) => set({ isPremium: active }),

            initializeStore: () => {
                const today = new Date().toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                const { lastCheckIn, currentStreak } = get();

                if (lastCheckIn && lastCheckIn !== today && lastCheckIn !== yesterday) {
                    set({ currentStreak: 0 });
                }
                set({ isLoaded: true });
            },

            saveProgress: () => { },
        }),
        {
            name: 'stoic-dad-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                unlockedIndex: state.unlockedIndex,
                journalEntries: state.journalEntries,
                insights: state.insights,
                completedModules: state.completedModules,
                currentStreak: state.currentStreak,
                longestStreak: state.longestStreak,
                lastCheckIn: state.lastCheckIn,
                totalXp: state.totalXp,
                completedDates: state.completedDates,
                theme: state.theme,
                isPremium: state.isPremium
            }),
            onRehydrateStorage: () => (state) => {
                state?.initializeStore();
            }
        }
    )
);
