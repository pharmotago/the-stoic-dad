"use client";

import React, { useState, useEffect } from 'react';
import courseData from '@/data';
import { Header } from '@/components/Header';
import { EnhancedHeader } from '@/components/EnhancedHeader';
import { ModuleCard } from '@/components/ModuleCard';
import { LessonView } from '@/components/LessonView';

import { StreakDisplay } from '@/components/StreakTracker';
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
import { AICoach } from '@/components/AICoach';
import { LeadGenModal } from '@/components/LeadGenModal';
import { ModuleSearch } from '@/components/ModuleSearch';
import { TutorialOverlay } from '@/components/TutorialOverlay';
import { CommunityModal } from '@/components/CommunityModal';
import { ShareModal } from '@/components/ShareModal';
import { PremiumModal } from '@/components/PremiumModal';
import { Hero3DPreview } from '@/components/Hero3DPreview';
import { PricingTable } from '@/components/PricingTable';
import { FAQSection } from '@/components/FAQSection';
import { StickyPromo } from '@/components/StickyPromo';
import { XP_CONSTANTS, calculateLevel } from '@/lib/gamification';
import dynamic from 'next/dynamic';
import { analytics } from '@/lib/analytics';

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

    // Premium Logic
    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

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
        const savedPremium = localStorage.getItem('stoic-dad-premium');

        if (savedProgress) setHighestUnlockedId(parseInt(savedProgress));
        if (savedCompleted) setCompletedModules(JSON.parse(savedCompleted));
        if (savedStreak) setCurrentStreak(parseInt(savedStreak));
        if (savedLongest) setLongestStreak(parseInt(savedLongest));
        if (savedLastCheckIn) setLastCheckIn(savedLastCheckIn);
        if (savedXp) setTotalXp(parseInt(savedXp));
        if (savedPremium === 'true') setIsPremium(true);

        // Show welcome modal for first-time users
        if (!hasSeenWelcome) {
            setShowWelcome(true);
        } else if (!hasSeenTutorial) {
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

    const handleUnlockPremium = () => {
        setIsPremium(true);
        localStorage.setItem('stoic-dad-premium', 'true');
        // Unlock all modules essentially by removing the lock check visual
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // Premium Lock Visual
        if (!isPremium && module.id > 1) {
            setShowPremiumModal(true);
            return;
        }

        // Standard Progression Lock
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
            setShowPremiumModal(false);
        }
    }, !activeModule || !showQuiz);

    const handleExportJournal = () => { exportJournalData(courseData.length); };
    const handleResetProgress = () => { resetAllProgress(); };

    if (!isLoaded) return <LoadingSkeleton />;

    const progress = (completedModules.length / courseData.length) * 100;

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
            {ToastComponent}

            {/* Conditional Header: simplified on landing to avoid distraction? User asked for Hero rewrite of Home. Kept standard for now for consistency */}
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
                    <div className="max-w-3xl mx-auto">
                        <LessonView
                            module={activeModule}
                            onBack={() => setActiveModule(null)}
                            onTakeQuiz={() => setShowQuiz(true)}
                        />

                        <button
                            onClick={() => setShowJournal(true)}
                            className="mt-6 w-full py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700/50"
                        >
                            <BookText className="w-5 h-5" />
                            Add Reflection Note
                        </button>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* HERO SECTION */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="text-center lg:text-left space-y-8">
                                <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                                    Modern Guide. <br />
                                <span className="text-emerald-500">Inner Peace.</span>
                                </h1>
                                <p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Transform your family legacy through the modern art of self-mastery and deep emotional discipline.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                                    <button
                                        onClick={() => handleModuleClick(courseData[0])}
                                        className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
                                    >
                                        Start Module 1 (Free)
                                    </button>

                                    <button
                                        onClick={() => setShowPremiumModal(true)}
                                        className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center justify-center gap-2"
                                    >
                                        <Shield className="w-5 h-5" />
                                        Unlock Full Protocol ($29)
                                    </button>
                                </div>

                                <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm text-slate-500 font-medium">
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950" />
                                        ))}
                                    </div>
                                    <p>Join 5,000+ Fathers</p>
                                </div>
                            </div>

                            {/* 3D Visual */}
                            <div className="hidden lg:block">
                                <Hero3DPreview />
                            </div>
                        </div>

                        {/* Social Proof Strip */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                            <Testimonial
                                quote="Saved my relationship with my son. I finally learned how to pause before reacting."
                                author="Mark, Sydney"
                            />
                            <Testimonial
                                quote="Simple, tactical, and effective. The missing manual for modern fatherhood."
                                author="James, London"
                            />
                            <Testimonial
                                quote="The visualization techniques changed how I handle work stress completely."
                                author="David, New York"
                            />
                        </div>

                        {/* Pricing Table */}
                        <PricingTable />

                        {/* FAQ */}
                        <FAQSection />

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-12 border-t border-slate-900/50">
                            {/* Main Content: Module List */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                        <BookText className="w-6 h-6 text-amber-500" />
                                        Curriculum
                                    </h2>
                                    {isPremium && <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-bold rounded-full border border-amber-500/20">PREMIUM UNLOCKED</span>}
                                </div>

                                <div className="grid gap-4">
                                    {courseData.map((module) => {
                                        // "Locked" logic: 
                                        // If !Premium AND id > 1 -> Premium Locked (shows padlock, opens modal)
                                        // If Premium AND id > highestUnlocked -> Progression Locked (shows padlock, no click or standard logic)
                                        // Currently ModuleCard handles "isLocked". We'll overload it or pass a custom click.

                                        const isPremiumLocked = !isPremium && module.id > 1;
                                        const isProgressionLocked = module.id > highestUnlockedId;

                                        return (
                                            <ModuleCard
                                                key={module.id}
                                                module={module}
                                                isActive={module.id === highestUnlockedId && !completedModules.includes(module.id)}
                                                isCompleted={completedModules.includes(module.id)}
                                                isLocked={isPremiumLocked || isProgressionLocked}
                                                onClick={() => handleModuleClick(module)}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Progress Ring */}
                                <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
                                    <ProgressRing progress={progress} size={140} />
                                    <div className="mt-4 text-center">
                                        <div className="text-sm text-slate-400 mb-1">
                                            {completedModules.length} of {courseData.length} modules
                                        </div>
                                    </div>
                                </div>

                                <DailyQuote />

                                <StreakDisplay
                                    streakData={{
                                        currentStreak,
                                        longestStreak,
                                        lastPracticeDate: lastCheckIn ? new Date(lastCheckIn) : null,
                                        practiceHistory: [],
                                        streakFreezes: 0
                                    }}
                                />

                                <AchievementBadges
                                    completedModules={completedModules}
                                    currentStreak={currentStreak}
                                    longestStreak={longestStreak}
                                />

                                <QuickActions
                                    onOpenEmergency={() => setShowEmergency(true)}
                                    onOpenStats={() => setShowStats(!showStats)}
                                    onExportJournal={handleExportJournal}
                                    onResetProgress={handleResetProgress}
                                    onOpenSearch={() => setShowSearch(true)}
                                    onOpenCommunity={() => setShowCommunity(true)}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Modals & Overlays */}
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

            <EmergencyToolkit isOpen={showEmergency} onClose={() => setShowEmergency(false)} />
            <WelcomeModal isOpen={showWelcome} onClose={handleWelcomeClose} />
            <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
            <CommunityModal isOpen={showCommunity} onClose={() => setShowCommunity(false)} currentXp={totalXp} currentStreak={currentStreak} />
            <ShareModal isOpen={showShare} onClose={() => setShowShare(false)} totalXp={totalXp} streak={currentStreak} completedModules={completedModules.length} />
            <ModuleSearch isOpen={showSearch} onClose={() => setShowSearch(false)} onSelectModule={(module) => { handleModuleClick(module); window.scrollTo({ top: 0, behavior: 'instant' }); }} />
            <MobileMenu isOpen={showMobileMenu} onToggle={() => setShowMobileMenu(!showMobileMenu)} onNavigate={(action) => { if (action === 'home') setActiveModule(null); if (action === 'stats') setShowStats(!showStats); if (action === 'emergency') setShowEmergency(true); if (action === 'settings') setShowSettings(true); if (action === 'community') setShowCommunity(true); }} currentPage={activeModule ? 'module' : 'home'} totalXp={totalXp} />

            {/* New Premium Modal */}
            <PremiumModal
                isOpen={showPremiumModal}
                onClose={() => setShowPremiumModal(false)}
                onUnlock={handleUnlockPremium}
            />

            {!isPremium && <StickyPromo />}
        </div>
    );
}

function Testimonial({ quote, author }: { quote: string, author: string }) {
    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <div className="text-amber-500 mb-3">★★★★★</div>
            <p className="text-slate-300 italic mb-4">"{quote}"</p>
            <p className="text-sm font-bold text-white">— {author}</p>
        </div>
    );
}


