"use client";

import React, { useState, useEffect } from 'react';
import courseData from '@/data';
import { Header } from '@/components/Header';
import { EnhancedHeader } from '@/components/EnhancedHeader';
import { ModuleCard } from '@/components/ModuleCard';
import { LessonView } from '@/components/LessonView';
import { QuizModal } from '@/components/QuizModal';
import { StreakTracker } from '@/components/StreakTracker';
import { ProgressRing } from '@/components/ProgressRing';
import { EmergencyToolkit } from '@/components/EmergencyToolkit';
import { JournalEntry } from '@/components/JournalEntry';
import { StatsPanel } from '@/components/StatsPanel';
import { WelcomeModal } from '@/components/WelcomeModal';
import { AchievementBadges } from '@/components/AchievementBadges';
import { QuickActions } from '@/components/QuickActions';
import { DailyQuote } from '@/components/DailyQuote';
import { SettingsPanel } from '@/components/SettingsPanel';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { MobileMenu } from '@/components/MobileMenu';
import { useToast } from '@/components/Toast';
import { Module } from '@/lib/schemas';
import { Trophy, Shield, BookText, BarChart3 } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { exportJournalData, resetAllProgress } from '@/lib/export';

export default function Home() {
    const [activeModule, setActiveModule] = useState<Module | null>(null);
    const [highestUnlockedId, setHighestUnlockedId] = useState(1);
    const [completedModules, setCompletedModules] = useState<number[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Streak tracking
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

    // Toast notifications
    const { showToast, ToastComponent } = useToast();

    // Load progress from LocalStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem('stoic-dad-progress');
        const savedCompleted = localStorage.getItem('stoic-dad-completed');
        const savedStreak = localStorage.getItem('stoic-dad-streak');
        const savedLongest = localStorage.getItem('stoic-dad-longest-streak');
        const savedLastCheckIn = localStorage.getItem('stoic-dad-last-checkin');
        const hasSeenWelcome = localStorage.getItem('stoic-dad-welcomed');

        if (savedProgress) setHighestUnlockedId(parseInt(savedProgress));
        if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted));
        if (savedStreak) setCurrentStreak(parseInt(savedStreak));
        if (savedLongest) setLongestStreak(parseInt(savedLongest));
        if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);

        // Show welcome modal for first-time users
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }

        setIsLoaded(true);
    }, []);

    const handleWelcomeClose = () => {
        setShowWelcome(false);
        localStorage.setItem('stoic-dad-welcomed', 'true');
    };

    // Check streak on mount
    useEffect(() => {
        if (!isLoaded) return;

        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastCheckIn !== today) {
            if (lastCheckIn === yesterday) {
                // Maintain streak
            } else if (lastCheckIn) {
                // Streak broken
                setCurrentStreak(0);
                localStorage.setItem('stoic-dad-streak', '0');
            }
        }
    }, [isLoaded, lastCheckIn]);

    const handleModuleClick = (module: Module) => {
        if (module.id <= highestUnlockedId) {
            setActiveModule(module);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuizSuccess = () => {
        setShowQuiz(false);

        if (activeModule) {
            // Mark current as completed
            if (!completedModules.includes(activeModule.id)) {
                const newCompleted = [...completedModules, activeModule.id];
                setCompletedModules(newCompleted);
                localStorage.setItem('stoic-dad-completed', JSON.stringify(newCompleted));

                // Update streak
                const today = new Date().toDateString();
                if (lastCheckIn !== today) {
                    const newStreak = currentStreak + 1;
                    setCurrentStreak(newStreak);
                    setLastCheckIn(today);
                    localStorage.setItem('stoic-dad-streak', newStreak.toString());
                    localStorage.setItem('stoic-dad-last-checkin', today);

                    if (newStreak > longestStreak) {
                        setLongestStreak(newStreak);
                        localStorage.setItem('stoic-dad-longest-streak', newStreak.toString());
                    }
                }
            }

            // Unlock next
            const nextId = activeModule.id + 1;
            if (nextId > highestUnlockedId) {
                setHighestUnlockedId(nextId);
                localStorage.setItem('stoic-dad-progress', nextId.toString());
            }

            setActiveModule(null);
        }
    };

    // Keyboard shortcuts
    useKeyboardShortcuts({
        'e': () => setShowEmergency(true),
        'j': () => activeModule && setShowJournal(true),
        's': () => setShowStats(!showStats),
        'escape': () => {
            setShowEmergency(false);
            setShowJournal(false);
            setShowQuiz(false);
            setShowWelcome(false);
        }
    }, !activeModule || !showQuiz);

    // Export and reset handlers
    const handleExportJournal = () => {
        exportJournalData(courseData.length);
    };

    const handleResetProgress = () => {
        resetAllProgress();
    };

    if (!isLoaded) return <LoadingSkeleton />;

    const progress = (completedModules.length / courseData.length) * 100;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
            {ToastComponent}
            <EnhancedHeader
                completionPercentage={progress}
                currentStreak={currentStreak}
                completedCount={completedModules.length}
                totalCount={courseData.length}
            />

            {/* Emergency FAB */}
            <button
                onClick={() => setShowEmergency(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 animate-pulse"
                title="Emergency Protocols"
            >
                <Shield className="w-6 h-6" />
            </button>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {activeModule ? (
                    <div className="max-w-2xl mx-auto">
                        <LessonView
                            module={activeModule}
                            onBack={() => setActiveModule(null)}
                            onTakeQuiz={() => setShowQuiz(true)}
                        />

                        {/* Journal button */}
                        <button
                            onClick={() => setShowJournal(true)}
                            className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
                        >
                            <BookText className="w-5 h-5" />
                            Add Reflection Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="text-center mb-6">
                                <h2 className="text-3xl font-bold mb-2 text-white">The Path</h2>
                                <p className="text-slate-400">Master yourself, lead your family.</p>
                            </div>

                            <div className="grid gap-4">
                                {courseData.map((module) => (
                                    <ModuleCard
                                        key={module.id}
                                        module={module}
                                        isActive={module.id === highestUnlockedId && !completedModules.includes(module.id)}
                                        isCompleted={completedModules.includes(module.id)}
                                        isLocked={module.id > highestUnlockedId}
                                        onClick={() => handleModuleClick(module)}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Progress Ring */}
                            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 border border-slate-700/50 flex flex-col items-center">
                                <ProgressRing progress={progress} size={140} />
                                <div className="mt-4 text-center">
                                    <div className="text-sm text-slate-400 mb-1">
                                        {completedModules.length} of {courseData.length} modules
                                    </div>
                                    {progress === 100 && (
                                        <div className="flex items-center justify-center gap-1 text-amber-500 font-bold mt-2">
                                            <Trophy className="w-4 h-4" />
                                            <span className="text-sm">Path Complete!</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Daily Quote */}
                            <DailyQuote />

                            {/* Streak Tracker */}
                            <StreakTracker
                                currentStreak={currentStreak}
                                longestStreak={longestStreak}
                                lastCheckIn={lastCheckIn}
                            />

                            {/* Achievements */}
                            <AchievementBadges
                                completedModules={completedModules}
                                currentStreak={currentStreak}
                                longestStreak={longestStreak}
                            />

                            {/* Quick Actions */}
                            <QuickActions
                                onOpenEmergency={() => setShowEmergency(true)}
                                onOpenStats={() => setShowStats(!showStats)}
                                onExportJournal={handleExportJournal}
                                onResetProgress={handleResetProgress}
                            />

                            {/* Stats Panel */}
                            {showStats && (
                                <div className="animate-in slide-in-from-top duration-300">
                                    <StatsPanel
                                        completedModules={completedModules}
                                        totalModules={courseData.length}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>

            {/* Modals */}
            {activeModule && (
                <>
                    <QuizModal
                        module={activeModule}
                        isOpen={showQuiz}
                        onClose={() => setShowQuiz(false)}
                        onSuccess={handleQuizSuccess}
                    />
                    <JournalEntry
                        moduleId={activeModule.id}
                        moduleTitle={activeModule.title}
                        isOpen={showJournal}
                        onClose={() => setShowJournal(false)}
                    />
                </>
            )}

            <EmergencyToolkit
                isOpen={showEmergency}
                onClose={() => setShowEmergency(false)}
            />

            <WelcomeModal
                isOpen={showWelcome}
                onClose={handleWelcomeClose}
            />

            <SettingsPanel
                isOpen={showSettings}
                onClose={() => setShowSettings(false)}
            />

            <MobileMenu
                isOpen={showMobileMenu}
                onToggle={() => setShowMobileMenu(!showMobileMenu)}
                onNavigate={(action) => {
                    if (action === 'home') setActiveModule(null);
                    if (action === 'stats') setShowStats(!showStats);
                    if (action === 'emergency') setShowEmergency(true);
                    if (action === 'settings') setShowSettings(true);
                }}
                currentPage={activeModule ? 'module' : 'home'}
            />
        </div>
    );
}
