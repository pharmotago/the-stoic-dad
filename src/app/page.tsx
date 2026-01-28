"use client";

import React, { useState, useEffect } from 'react';
import courseData from '@/data';
import { Header } from '@/components/Header';
import { EnhancedHeader } from '@/components/EnhancedHeader';
import { ModuleCard } from '@/components/ModuleCard';
import { LessonView } from '@/components/LessonView';

import { StreakTracker } from '@/components/StreakTracker';
import { ProgressRing } from '@/components/ProgressRing';
import { EmergencyToolkit } from '@/components/EmergencyToolkit';
import { StatsPanel } from '@/components/StatsPanel';
import { WelcomeModal } from '@/components/WelcomeModal';
import { AchievementBadges } from '@/components/AchievementBadges';
import { QuickActions } from '@/components/QuickActions';
import { DailyQuote } from '@/components/DailyQuote';
import { SettingsPanel } from '@/components/SettingsPanel';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { MobileMenu } from '@/components/MobileMenu';
import { ModuleSearch } from '@/components/ModuleSearch';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { CommunityModal } from '@/components/CommunityModal';
import { ShareModal } from '@/components/ShareModal'; // New import
import { XP_CONSTANTS, calculateLevel } from '@/lib/gamification';
import dynamic from 'next/dynamic';

// Code Splitting for heavy modals
const QuizModal = dynamic(() => import('@/components/QuizModal').then(mod => mod.QuizModal), {
    loading: () => null
});
const JournalEntry = dynamic(() => import('@/components/JournalEntry').then(mod => mod.JournalEntry), {
    loading: () => null
});
import { useToast } from '@/components/Toast';
import { Module } from '@/lib/schemas';
import { Trophy, Shield, BookText, BarChart3 } from 'lucide-react';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { exportJournalData, resetAllProgress } from '@/lib/export';

import { useHistory } from '@/hooks/useHistory';

export default function Home() {
    const [activeModule, setActiveModule] = useState<Module | null>(null);
    const [highestUnlockedId, setHighestUnlockedId] = useState(1);

    // History management for progress
    const {
        state: completedModules,
        set: setCompletedModules,
        undo: undoProgress,
        redo: redoProgress,
        canUndo,
        canRedo
    } = useHistory<number[]>([]);
    const [showQuiz, setShowQuiz] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const [showJournal, setShowJournal] = useState(false);
    const [showStats, setShowStats] = useState(false);
    const [showWelcome, setShowWelcome] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);

    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showCommunity, setShowCommunity] = useState(false);
    const [showShare, setShowShare] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Streak tracking
    const [currentStreak, setCurrentStreak] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [lastCheckIn, setLastCheckIn] = useState<string | null>(null);

    // Gamification State
    const [totalXp, setTotalXp] = useState(0);

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
        const hasSeenTutorial = localStorage.getItem('stoic-dad-tutorial');
        const savedXp = localStorage.getItem('stoic-dad-xp');

        if (savedProgress) setHighestUnlockedId(parseInt(savedProgress));
        if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted));
        if (savedStreak) setCurrentStreak(parseInt(savedStreak));
        if (savedLongest) setLongestStreak(parseInt(savedLongest));
        if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);
        if (savedXp) setTotalXp(parseInt(savedXp));

        // Show welcome modal for first-time users
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        } else if (!hasSeenTutorial) {
            // If welcomed but haven't seen tutorial (migrated users), show tutorial
            setShowTutorial(true);
        }

        setIsLoaded(true);
    }, []);

    const handleWelcomeClose = () => {
        setShowWelcome(false);
        localStorage.setItem('stoic-dad-welcomed', 'true');
        // Show tutorial after welcome
        setTimeout(() => setShowTutorial(true), 500);
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

            // Award XP
            const oldLevel = calculateLevel(totalXp).level;
            const xpGained = XP_CONSTANTS.COMPLETE_QUIZ; // + Bonus potential
            const newXp = totalXp + xpGained;
            setTotalXp(newXp);
            localStorage.setItem('stoic-dad-xp', newXp.toString());

            showToast(`+${xpGained} XP! Knowledge grows.`, 'success');

            // Check Level Up
            const newLevel = calculateLevel(newXp).level;
            if (newLevel > oldLevel) {
                setTimeout(() => showToast(`Level Up! You are now a ${calculateLevel(newXp).title}`, 'success'), 1000);
            }

            setActiveModule(null);
        }
    };

    // Keyboard shortcuts
    useKeyboardShortcuts({
        'e': () => setShowEmergency(true),
        'j': () => activeModule && setShowJournal(true),
        's': () => setShowStats(!showStats),
        'k': () => setShowSearch(true),
        '/': () => setShowSearch(true),
        'z': () => {
            if (canUndo) {
                undoProgress();
                showToast('Progress undone', 'info');
            }
        },
        'y': () => {
            if (canRedo) {
                redoProgress();
                showToast('Progress restored', 'success');
            }
        },
        'escape': () => {
            setShowEmergency(false);
            setShowJournal(false);
            setShowQuiz(false);
            setShowWelcome(false);
            setShowSearch(false);
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
                                onOpenSearch={() => setShowSearch(true)}
                                onOpenCommunity={() => setShowCommunity(true)}
                            />

                            {/* Stats Panel */}
                            {showStats && (
                                <div className="animate-in slide-in-from-top duration-300">
                                    <StatsPanel
                                        completedModules={completedModules}
                                        totalModules={courseData.length}
                                        onShare={() => setShowShare(true)}
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

            <CommunityModal
                isOpen={showCommunity}
                onClose={() => setShowCommunity(false)}
                currentXp={totalXp}
                currentStreak={currentStreak}
            />

            <ShareModal
                isOpen={showShare}
                onClose={() => setShowShare(false)}
                totalXp={totalXp}
                streak={currentStreak}
                completedModules={completedModules.length}
            />

            <ModuleSearch
                isOpen={showSearch}
                onClose={() => setShowSearch(false)}
                onSelectModule={(module) => {
                    handleModuleClick(module);
                    window.scrollTo({ top: 0, behavior: 'instant' });
                }}
            />

            <MobileMenu
                isOpen={showMobileMenu}
                onToggle={() => setShowMobileMenu(!showMobileMenu)}
                onNavigate={(action) => {
                    if (action === 'home') setActiveModule(null);
                    if (action === 'stats') setShowStats(!showStats);
                    if (action === 'emergency') setShowEmergency(true);
                    if (action === 'settings') setShowSettings(true);
                    if (action === 'community') setShowCommunity(true);
                }}
                currentPage={activeModule ? 'module' : 'home'}
                totalXp={totalXp}
            />
        </div>
    );
}
