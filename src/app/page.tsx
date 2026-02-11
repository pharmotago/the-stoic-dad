"use client";

import React, { useState, useEffect } from 'react';
import courseData from '@/data';
import { Header } from '@/components/Header';
import { DynamicHeader } from '@/components/DynamicHeader';
import { ModuleCard } from '@/components/ModuleCard';
import { LessonView } from '@/components/LessonView';

import { XP_CONSTANTS, calculateLevel } from '@/lib/gamification';
import dynamic from 'next/dynamic';
import { analytics } from '@/lib/analytics';

// Performance: Dynamic Imports for heavy components and modals
const EmergencyToolkit = dynamic(() => import('@/components/EmergencyToolkit').then(mod => mod.EmergencyToolkit), { ssr: false });
const StatsPanel = dynamic(() => import('@/components/StatsPanel').then(mod => mod.StatsPanel), { ssr: false });
const WelcomeModal = dynamic(() => import('@/components/WelcomeModal').then(mod => mod.WelcomeModal), { ssr: false });
const AchievementBadges = dynamic(() => import('@/components/AchievementBadges').then(mod => mod.AchievementBadges));
const SettingsPanel = dynamic(() => import('@/components/SettingsPanel').then(mod => mod.SettingsPanel), { ssr: false });
const AICoach = dynamic(() => import('@/components/AICoach').then(mod => mod.AICoach), { ssr: false });
const LeadGenModal = dynamic(() => import('@/components/LeadGenModal').then(mod => mod.LeadGenModal), { ssr: false });
const ModuleSearch = dynamic(() => import('@/components/ModuleSearch').then(mod => mod.ModuleSearch), { ssr: false });
const TutorialOverlay = dynamic(() => import('@/components/TutorialOverlay').then(mod => mod.TutorialOverlay), { ssr: false });
const CommunityModal = dynamic(() => import('@/components/CommunityModal').then(mod => mod.CommunityModal), { ssr: false });
const ShareModal = dynamic(() => import('@/components/ShareModal').then(mod => mod.ShareModal), { ssr: false });
const PremiumModal = dynamic(() => import('@/components/PremiumModal').then(mod => mod.PremiumModal), { ssr: false });
const Hero3DPreview = dynamic(() => import('@/components/Hero3DPreview').then(mod => mod.Hero3DPreview));
const PricingTable = dynamic(() => import('@/components/PricingTable').then(mod => mod.PricingTable));
const FAQSection = dynamic(() => import('@/components/FAQSection').then(mod => mod.FAQSection));
const StickyPromo = dynamic(() => import('@/components/StickyPromo').then(mod => mod.StickyPromo), { ssr: false });
const StreakDisplay = dynamic(() => import('@/components/StreakTracker').then(mod => mod.StreakDisplay));
const ProgressRing = dynamic(() => import('@/components/ProgressRing').then(mod => mod.ProgressRing));
const DailyQuote = dynamic(() => import('@/components/DailyQuote').then(mod => mod.DailyQuote));
const QuickActions = dynamic(() => import('@/components/QuickActions').then(mod => mod.QuickActions));
const LoadingSkeleton = dynamic(() => import('@/components/LoadingSkeleton').then(mod => mod.LoadingSkeleton));
const MobileMenu = dynamic(() => import('@/components/MobileMenu').then(mod => mod.MobileMenu), { ssr: false });
import { SynthesisOverlay } from '@/components/SynthesisOverlay';

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

import { useCourseStore } from '@/store/useCourseStore';

export default function Home() {
    const {
        activeModule,
        setActiveModule,
        unlockedIndex,
        completedModules,
        currentStreak,
        longestStreak,
        lastCheckIn,
        totalXp,
        completeModule,
        addXp,
        resetProgress,
        isLoaded
    } = useCourseStore();

    // Premium Logic
    const [isPremium, setIsPremium] = useState(false);
    const [showPremiumModal, setShowPremiumModal] = useState(false);

    // Modals & UI State
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

    // Toast notifications
    const { showToast, ToastComponent } = useToast();

    // Load Welcome/Tutorial logic from LocalStorage (UI only)
    useEffect(() => {
        if (!isLoaded) return;

        const hasSeenWelcome = localStorage.getItem('stoic-dad-welcomed');
        const hasSeenTutorial = localStorage.getItem('stoic-dad-tutorial');
        const savedPremium = localStorage.getItem('stoic-dad-premium');

        if (savedPremium === 'true') setIsPremium(true);

        if (!hasSeenWelcome) {
            setShowWelcome(true);
        } else if (!hasSeenTutorial) {
            setShowTutorial(true);
        }
    }, [isLoaded]);

    const handleWelcomeClose = () => {
        setShowWelcome(false);
        localStorage.setItem('stoic-dad-welcomed', 'true');
        setTimeout(() => setShowTutorial(true), 500);
    };

    const handleUnlockPremium = () => {
        setIsPremium(true);
        localStorage.setItem('stoic-dad-premium', 'true');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleModuleClick = (module: Module) => {
        // Premium Lock Visual
        if (!isPremium && module.id > 1) {
            setShowPremiumModal(true);
            return;
        }

        // Standard Progression Lock (index-based)
        if (module.id - 1 <= unlockedIndex) {
            setActiveModule(module);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuizSuccess = () => {
        setShowQuiz(false);

        if (activeModule) {
            const oldLevel = calculateLevel(totalXp).level;

            // Centralized Store Logic
            completeModule(activeModule.id);

            const xpGained = XP_CONSTANTS.COMPLETE_QUIZ;
            addXp(xpGained);

            showToast(`+${xpGained} XP! Knowledge grows.`, 'success');

            // Check Level Up
            const newLevel = calculateLevel(totalXp + xpGained).level;
            if (newLevel > oldLevel) {
                setTimeout(() => showToast(`Level Up! You are now a ${calculateLevel(totalXp + xpGained).title}`, 'success'), 1000);
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
    const handleResetProgress = () => {
        resetProgress();
        showToast('All progress reset', 'info');
    };

    if (!isLoaded) return <LoadingSkeleton />;

    const progress = (completedModules.length / courseData.length) * 100;


    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
            <SynthesisOverlay />
            {ToastComponent}

            {/* Dynamic Imperial Header */}
            <DynamicHeader
                completionPercentage={progress}
                currentStreak={currentStreak}
                completedCount={completedModules.length}
                totalCount={courseData.length}
                onMobileMenuToggle={() => setShowMobileMenu(true)}
            />

            {/* Emergency FAB */}
            <button
                onClick={() => setShowEmergency(true)}
                className="fixed bottom-6 right-6 z-40 p-4 bg-red-600 hover:bg-red-500 text-white rounded-full shadow-2xl transform hover:scale-110 transition-all duration-200 animate-pulse focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                title="Emergency Protocols"
                aria-label="Open Emergency Protocols"
            >
                <Shield className="w-6 h-6" aria-hidden="true" />
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
                                    The Unshakable <br />
                                    <span className="text-cyan-400">Patriarch.</span>
                                </h1>
                                <p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                                    Transform your legacy through a neuroscience-backed Stoic protocol. Master the biological override and reclaim your family's peace.
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
                                quote="The 'Binary Filter' technique saved my relationship with my son. I finally learned how to kill the Red Mist before it spoke."
                                author="Mark, Sydney"
                            />
                            <Testimonial
                                quote="This isn't just theory. It's a tactical manual for modern fathers who refuse to be driven by their impulses."
                                author="James, London"
                            />
                            <Testimonial
                                quote="The combination of Marcus Aurelius and modern neuroscience is a masterstroke. Absolute game-changer."
                                author="David, New York"
                            />
                        </div>

                        {/* Pricing Table - Hidden for Premium Users */}
                        {!isPremium && <PricingTable />}

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
                                        const isProgressionLocked = module.id - 1 > unlockedIndex;

                                        return (
                                            <ModuleCard
                                                key={module.id}
                                                module={module}
                                                isActive={module.id - 1 === unlockedIndex && !completedModules.includes(module.id)}
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

            <footer className="mt-20 py-12 border-t border-slate-900/50 container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm font-black tracking-widest uppercase">
                    <p>© 2026 MCJP Ecosystem | Precise. Powerful. Productive.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-amber-500 cursor-pointer transition-colors">Documentation</span>
                        <span className="hover:text-amber-500 cursor-pointer transition-colors">Privacy Protocol</span>
                        <span className="hover:text-amber-500 cursor-pointer transition-colors">System Status</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Testimonial({ quote, author }: { quote: string, author: string }) {
    return (
        <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
            <div className="text-amber-500 mb-3">★★★★★</div>
            <p className="text-white/80 italic mb-4">"{quote}"</p>
            <p className="text-sm font-bold text-white">— {author}</p>
        </div>
    );
}


