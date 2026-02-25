"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import courseData from '@/data'; // Removed in favor of store modules
import { Header } from '@/components/Header';
import { DynamicHeader } from '@/components/DynamicHeader';
import { ModuleCard } from '@/components/ModuleCard';
import { LessonView } from '@/components/LessonView';

import { XP_CONSTANTS, calculateLevel } from '@/lib/gamification';
import dynamic from 'next/dynamic';
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

import { AdSense, useLicensing, ExitIntentModal, CrossPromo } from '@/ecosystem-shared';
import { BrainCircuit } from 'lucide-react';

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
        isLoaded,
        isPremium,
        setPremium,
        modules
    } = useCourseStore();

    const { isPremium: isSharedPremium } = useLicensing();

    const [showLanguagePromo, setShowLanguagePromo] = useState(false);

    useEffect(() => {
        const { level } = calculateLevel(totalXp);
        if (level >= 3) {
            setShowLanguagePromo(true);
        }
    }, [totalXp]);

    // Sync shared premium
    useEffect(() => {
        if (isSharedPremium && !isPremium) {
            setPremium(true);
        }
    }, [isSharedPremium, isPremium, setPremium]);

    // Modals & UI State
    const [modals, setModals] = useState({
        quiz: false,
        emergency: false,
        journal: false,
        stats: false,
        welcome: false,
        settings: false,
        search: false,
        tutorial: false,
        mobileMenu: false,
        community: false,
        share: false,
        premium: false
    });

    const toggleModal = (key: keyof typeof modals, value: boolean) => {
        setModals(prev => ({ ...prev, [key]: value }));
    };

    // Toast notifications
    const { showToast, ToastComponent } = useToast();

    // Load Welcome/Tutorial logic from LocalStorage (UI only)
    useEffect(() => {
        if (!isLoaded) return;

        const hasSeenWelcome = localStorage.getItem('stoic-dad-welcomed');
        const hasSeenTutorial = localStorage.getItem('stoic-dad-tutorial');
        const savedPremium = localStorage.getItem('stoic-dad-premium');
        if (savedPremium === 'true') setPremium(true);

        if (!hasSeenWelcome) {
            toggleModal('welcome', true);
        } else if (!hasSeenTutorial) {
            toggleModal('tutorial', true);
        }
    }, [isLoaded]);

    const handleWelcomeClose = () => {
        toggleModal('welcome', false);
        localStorage.setItem('stoic-dad-welcomed', 'true');
        setTimeout(() => toggleModal('tutorial', true), 500);
    };

    const handleUnlockPremium = () => {
        setPremium(true);
        localStorage.setItem('stoic-dad-premium', 'true');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleModuleClick = (module: Module) => {
        // Premium Lock Visual (Day 3 Gating)
        if (!isPremium && module.id > 3) {
            toggleModal('premium', true);
            return;
        }

        // Standard Progression Lock (index-based)
        if (module.id - 1 <= unlockedIndex) {
            setActiveModule(module);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuizSuccess = () => {
        toggleModal('quiz', false);

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
        'e': () => toggleModal('emergency', true),
        'j': () => activeModule && toggleModal('journal', true),
        's': () => toggleModal('stats', !modals.stats),
        'k': () => toggleModal('search', true),
        '/': () => toggleModal('search', true),
        'escape': () => {
            setModals(prev => ({
                ...prev,
                emergency: false,
                journal: false,
                quiz: false,
                welcome: false,
                search: false,
                premium: false
            }));
        }
    }, !activeModule || !modals.quiz);

    const handleExportJournal = () => { exportJournalData(modules.length); };
    const handleResetProgress = () => {
        resetProgress();
        showToast('All progress reset', 'info');
    };

    if (!isLoaded) return <LoadingSkeleton />;

    const progress = (completedModules.length / modules.length) * 100;


    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 relative overflow-hidden">
            {/* Full Site Scanline */}
            <div className="matrix-scanline animate-scanline" />

            {ToastComponent}

            {/* Dynamic Imperial Header */}
            <DynamicHeader
                completionPercentage={progress}
                currentStreak={currentStreak}
                completedCount={completedModules.length}
                totalCount={modules.length}
                onMobileMenuToggle={() => toggleModal('mobileMenu', true)}
            />

            {/* Emergency FAB */}
            <button
                onClick={() => toggleModal('emergency', true)}
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
                            onTakeQuiz={() => toggleModal('quiz', true)}
                        />

                        <button
                            onClick={() => toggleModal('journal', true)}
                            className="mt-6 w-full py-3 bg-slate-900/50 hover:bg-slate-800 text-slate-300 font-medium rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700/50"
                        >
                            <BookText className="w-5 h-5" />
                            Add Reflection Note
                        </button>
                    </div>
                ) : (
                    <div className="space-y-20">
                        {/* HERO SECTION */}
                        <div className="relative py-20 md:py-32 flex flex-col items-center text-center space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {/* Decorative Pillars */}
                            <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden xl:block" />
                            <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-amber-500/20 to-transparent hidden xl:block" />

                            <div className="space-y-6 max-w-4xl">
                                <div className="flex items-center justify-center gap-4 mb-4">
                                    <div className="h-px w-12 bg-amber-500/30" />
                                    <span className="text-[10px] font-black tracking-[0.6em] text-amber-500 uppercase">Est. 2026 // The Protocol</span>
                                    <div className="h-px w-12 bg-amber-500/30" />
                                </div>
                                <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-white leading-[0.85] uppercase text-shadow-glow">
                                    The Unshakable <br />
                                    <span className="text-burnished-amber">Patriarch.</span>
                                </h1>
                                <p className="text-2xl text-slate-400 font-light leading-relaxed max-w-2xl mx-auto tracking-tight">
                                    Forge your legacy through a neuroscience-backed <span className="text-white font-medium italic">Stoic protocol</span>. Reclaim your internal citadel.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-lg">
                                <button
                                    onClick={() => handleModuleClick(modules[0])}
                                    className="w-full px-12 py-5 bg-white text-black font-black uppercase tracking-[0.3em] rounded-none hover:bg-amber-500 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    Begin Trial
                                </button>
                                <button
                                    onClick={() => toggleModal('premium', true)}
                                    className="w-full px-12 py-5 bg-slate-900 text-amber-500 font-black uppercase tracking-[0.3em] rounded-none border-2 border-amber-500/20 hover:border-amber-500/50 transition-all hover:scale-105 active:scale-95 shadow-2xl"
                                >
                                    Unlock Protocol
                                </button>
                            </div>

                            <div className="pt-8 flex items-center justify-center gap-6 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                                    5.4K Active Fathers
                                </span>
                                <span className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500/40" />
                                    v4.2 Protocol
                                </span>
                            </div>
                        </div>

                        {/* Social Proof Strip: The Council of Peers */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-white/5 divide-y md:divide-y-0 md:divide-x divide-white/5 bg-slate-950">
                            <Testimonial
                                quote="The 'Binary Filter' technique is a tactical manual. I learned how to kill the Red Mist before it spoke."
                                author="Commander Mark, Sydney"
                            />
                            <Testimonial
                                quote="Marcus Aurelius meets modern neuroscience. This is the absolute game-changer for modern parenting."
                                author="David, New York"
                            />
                            <Testimonial
                                quote="Tactical, severe, and effective. Reclaim your presence as a father immediately."
                                author="James, London"
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
                                    {modules.map((module) => {
                                        // "Locked" logic: 
                                        // If !Premium AND id > 1 -> Premium Locked (shows padlock, opens modal)
                                        // If Premium AND id > highestUnlocked -> Progression Locked (shows padlock, no click or standard logic)
                                        // Currently ModuleCard handles "isLocked". We'll overload it or pass a custom click.

                                        const isPremiumLocked = !isPremium && module.id > 3;
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
                                            {completedModules.length} of {modules.length} modules
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
                                    onOpenEmergency={() => toggleModal('emergency', true)}
                                    onOpenStats={() => toggleModal('stats', !modals.stats)}
                                    onExportJournal={handleExportJournal}
                                    onResetProgress={handleResetProgress}
                                    onOpenSearch={() => toggleModal('search', true)}
                                    onOpenCommunity={() => toggleModal('community', true)}
                                />

                                {/* AdSense Unit */}
                                <div className="glass-card rounded-2xl p-4 flex justify-center items-center min-h-[250px] bg-slate-900/50">
                                    <AdSense adSlot="sidebar-ad-1" adFormat="rectangle" />
                                </div>
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
                        isOpen={modals.quiz}
                        onClose={() => toggleModal('quiz', false)}
                        onSuccess={handleQuizSuccess}
                    />
                    <JournalEntry
                        moduleId={activeModule.id}
                        moduleTitle={activeModule.title}
                        isOpen={modals.journal}
                        onClose={() => toggleModal('journal', false)}
                    />
                </>
            )}

            <EmergencyToolkit isOpen={modals.emergency} onClose={() => toggleModal('emergency', false)} />
            <WelcomeModal isOpen={modals.welcome} onClose={handleWelcomeClose} />
            <SettingsPanel isOpen={modals.settings} onClose={() => toggleModal('settings', false)} />
            <CommunityModal isOpen={modals.community} onClose={() => toggleModal('community', false)} currentXp={totalXp} currentStreak={currentStreak} />
            <ShareModal isOpen={modals.share} onClose={() => toggleModal('share', false)} totalXp={totalXp} streak={currentStreak} completedModules={completedModules.length} />
            <ModuleSearch isOpen={modals.search} onClose={() => toggleModal('search', false)} onSelectModule={(module) => { handleModuleClick(module); window.scrollTo({ top: 0, behavior: 'instant' }); }} />
            <MobileMenu isOpen={modals.mobileMenu} onToggle={() => toggleModal('mobileMenu', !modals.mobileMenu)} onNavigate={(action) => { if (action === 'home') setActiveModule(null); if (action === 'stats') toggleModal('stats', !modals.stats); if (action === 'emergency') toggleModal('emergency', true); if (action === 'settings') toggleModal('settings', true); if (action === 'community') toggleModal('community', true); }} currentPage={activeModule ? 'module' : 'home'} totalXp={totalXp} />

            {/* New Premium Modal */}
            <PremiumModal
                isOpen={modals.premium}
                onClose={() => toggleModal('premium', false)}
                onUnlock={handleUnlockPremium}
            />

            {!isPremium && <StickyPromo />}

            {!isPremium && (
                <ExitIntentModal
                    onClose={() => { }}
                    onClaim={() => { }}
                />
            )}

            <CrossPromo
                id="sd-to-lc"
                targetAppName="Language Coach"
                hook="Mastering discipline often requires expanding your cognitive horizon. Start neural training."
                cta="Start Coaching"
                url="https://language-coach-app.vercel.app"
                icon={BrainCircuit}
                color="emerald"
                isVisible={showLanguagePromo}
                onClose={() => setShowLanguagePromo(false)}
            />

            <footer className="mt-20 py-12 border-t border-slate-900/50 container mx-auto px-4 max-w-6xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-sm font-black tracking-widest uppercase">
                    <p>© 2026 MCJP Ecosystem | Precise. Powerful. Productive.</p>
                    <div className="flex gap-8">
                        <span className="hover:text-amber-500 cursor-pointer transition-colors">Documentation</span>
                        <Link href="/privacy" className="hover:text-amber-500 cursor-pointer transition-colors">Privacy Protocol</Link>
                        <span className="hover:text-amber-500 cursor-pointer transition-colors">System Status</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function Testimonial({ quote, author }: { quote: string, author: string }) {
    return (
        <div className="bg-slate-950 p-10 flex flex-col justify-between group">
            <div>
                <div className="flex gap-1 mb-6">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="w-1 h-1 bg-amber-500/40" />
                    ))}
                </div>
                <p className="text-white/60 font-light italic text-lg leading-relaxed mb-8 group-hover:text-white transition-colors">
                    "{quote}"
                </p>
            </div>
            <p className="text-[10px] font-black text-amber-500/60 uppercase tracking-[0.3em]">
                // {author}
            </p>
        </div>
    );
}


