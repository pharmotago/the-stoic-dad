import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Module } from '@/lib/schemas';
import { staticModules, getAllModules } from '@/data';

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
    subscriptionPlan: 'free' | 'monthly' | 'yearly' | 'lifetime';
    dailyAiMessageCount: number;
    lastAiMessageDate: string | null;
    modules: Module[];

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
    setPremium: (active: boolean, plan?: 'monthly' | 'yearly' | 'lifetime') => void;
    incrementAiMessageCount: () => void;
    resetAiMessageCount: () => void;
    fetchModules: () => Promise<void>;
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
            subscriptionPlan: 'free',
            dailyAiMessageCount: 0,
            lastAiMessageDate: null,
            modules: staticModules,

            setLoaded: () => set({ isLoaded: true }),

            unlockNext: () => set((state) => {
                const maxIndex = state.modules.length - 1;
                const nextIndex = state.unlockedIndex + 1;
                return { unlockedIndex: Math.min(nextIndex, maxIndex) };
            }),

            setActiveModule: (_module: Module | null) => set({ activeModule: _module }),

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
                isPremium: false,
                subscriptionPlan: 'free',
                dailyAiMessageCount: 0,
                lastAiMessageDate: null
            }),

            setPanicMode: (_active: boolean) => set({ isPanicMode: _active }),

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

            addXp: (_amount) => set((state) => ({ totalXp: state.totalXp + _amount })),

            markDateComplete: () => set((state) => {
                const today = new Date().toISOString().split('T')[0];
                if (state.completedDates.includes(today)) return {};
                return { completedDates: [...state.completedDates, today] };
            }),

            setTheme: (theme) => set({ theme }),

            setFocusMode: (_active) => set({ focusMode: _active }),

            setPremium: (active, plan = 'lifetime') => set({
                isPremium: active,
                subscriptionPlan: active ? plan : 'free'
            }),

            incrementAiMessageCount: () => set((state) => {
                const today = new Date().toDateString();
                const isNewDay = state.lastAiMessageDate !== today;
                return {
                    dailyAiMessageCount: isNewDay ? 1 : state.dailyAiMessageCount + 1,
                    lastAiMessageDate: today
                };
            }),

            resetAiMessageCount: () => set({ dailyAiMessageCount: 0 }),

            initializeStore: () => {
                const today = new Date().toDateString();
                const yesterday = new Date(Date.now() - 86400000).toDateString();
                const { lastCheckIn, currentStreak } = get();

                if (lastCheckIn && lastCheckIn !== today && lastCheckIn !== yesterday) {
                    set({ currentStreak: 0 });
                }
                get().fetchModules().then(() => {
                    set({ isLoaded: true });
                });
            },

            fetchModules: async () => {
                const modules = await getAllModules();
                set({ modules });
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
                isPremium: state.isPremium,
                subscriptionPlan: state.subscriptionPlan,
                dailyAiMessageCount: state.dailyAiMessageCount,
                lastAiMessageDate: state.lastAiMessageDate
            }),
            onRehydrateStorage: () => (state) => {
                state?.initializeStore();
            }
        }
    )
);
