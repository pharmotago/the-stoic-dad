"use client";

import { useCourseStore } from "@/store/useCourseStore";
import courseData from "@/data";
import { Footer } from "@/components/Footer";
import { ArrowLeft, PenTool, Search, Calendar, Hash, Smile, Meh, Frown, Download, Printer, FileDown, BookOpen, BrainCircuit, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { triggerHaptic, HapticPatterns } from "@/lib/haptics";
import { EmptyState } from "@/components/ui/EmptyState";
import { useRouter } from "next/navigation";
import { journalModel } from "@/lib/gemini";

export default function JournalPage() {
    const { journalEntries, isLoaded, initializeStore, theme, saveInsight, insights } = useCourseStore();
    const [mounted, setMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const router = useRouter();

    useEffect(() => {
        initializeStore();
        setMounted(true);
    }, [initializeStore]);

    // Theme Classes mapping
    const themeClasses = theme === 'paper'
        ? "bg-[#fdfbf7] text-slate-800 selection:bg-amber-500/20"
        : "bg-slate-900 text-slate-50 selection:bg-amber-500/30";

    const cardBg = theme === 'paper' ? "bg-white border-slate-200" : "bg-slate-800/50 border-slate-700";
    const subText = theme === 'paper' ? "text-slate-500" : "text-slate-400";
    const accentText = theme === 'paper' ? "text-slate-900" : "text-slate-100";

    if (!mounted || !isLoaded) return null;

    const entries = Object.entries(journalEntries).map(([idStr, entry]) => {
        const id = parseInt(idStr);
        const module = courseData.find(m => m.id === id);
        const isLegacy = typeof entry === 'string';
        const content = isLegacy ? entry as string : entry.content;
        const mood = isLegacy ? 'neutral' : entry.mood;
        const timestamp = isLegacy ? new Date().toISOString() : entry.timestamp;
        const wordCount = isLegacy ? (entry as string).split(/\s+/).filter(Boolean).length : entry.wordCount;

        return {
            id,
            title: module?.title || `Day ${id}`,
            content,
            mood,
            timestamp,
            wordCount
        };
    })
        .filter(entry => entry.content.toLowerCase().includes(searchQuery.toLowerCase()) || entry.title.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => b.id - a.id); // Newest first

    const totalWords = entries.reduce((acc, curr) => acc + curr.wordCount, 0);

    const handleAnalyze = async () => {
        if (entries.length === 0) return;
        setIsAnalyzing(true);
        triggerHaptic(HapticPatterns.medium);

        try {
            const recentEntries = entries.slice(0, 5).map(e => `Day ${e.id} (${e.mood}): ${e.content}`).join("\n\n");
            const result = await journalModel.generateContent(`Analyze these journal entries:\n\n${recentEntries}`);
            const text = result.response.text();
            setAnalysis(text);
            saveInsight(text); // Save to history
        } catch (error) {
            console.error(error);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const exportToMarkdown = () => {
        triggerHaptic(HapticPatterns.medium);
        const md = entries.map(e => `## Day ${e.id}: ${e.title}\n*Date: ${new Date(e.timestamp).toLocaleDateString()} | Mood: ${e.mood}*\n\n${e.content}\n\n---`).join("\n\n");
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stoic-journal-${new Date().toISOString().split('T')[0]}.md`;
        a.click();
    };

    const exportToJSON = () => {
        triggerHaptic(HapticPatterns.medium);
        const blob = new Blob([JSON.stringify(journalEntries, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `stoic-journal-raw-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
    };

    const handlePrint = () => {
        triggerHaptic(HapticPatterns.medium);
        window.print();
    };

    const getMoodIcon = (mood: string) => {
        switch (mood) {
            case 'positive': return <Smile className="w-4 h-4 text-emerald-500" />;
            case 'negative': return <Frown className="w-4 h-4 text-rose-500" />;
            default: return <Meh className="w-4 h-4 text-amber-500" />;
        }
    };

    return (
        <main className={`min-h-screen flex flex-col ${themeClasses} transition-colors duration-700`}>
            {/* Analysis Modal */}
            {analysis && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-slate-900 border border-amber-500/30 max-w-lg w-full rounded-2xl p-6 shadow-2xl relative max-h-[80vh] flex flex-col">
                        <button onClick={() => setAnalysis(null)} className="absolute top-4 right-4 text-slate-500 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-4 text-amber-500">
                            <BrainCircuit className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Stoic Insight</h3>
                        </div>

                        <div className="flex gap-4 border-b border-slate-800 mb-4 pb-2">
                            <button
                                onClick={() => setShowHistory(false)}
                                className={`text-sm font-bold uppercase tracking-wider pb-1 ${!showHistory ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Current Analysis
                            </button>
                            <button
                                onClick={() => setShowHistory(true)}
                                className={`text-sm font-bold uppercase tracking-wider pb-1 ${showHistory ? 'text-amber-500 border-b-2 border-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                Archive ({insights.length})
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 pr-2">
                            {!showHistory ? (
                                <div className="prose prose-invert prose-amber max-w-none text-sm leading-relaxed whitespace-pre-wrap animate-in fade-in">
                                    {analysis}
                                </div>
                            ) : (
                                <div className="space-y-4 animate-in fade-in">
                                    {insights.length === 0 && <p className="text-slate-500 italic">No past insights archived.</p>}
                                    {insights.map((insight) => (
                                        <div key={insight.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                            <div className="text-xs text-amber-500 mb-2 font-mono">{new Date(insight.timestamp).toLocaleDateString()}</div>
                                            <div className="text-sm text-slate-300 whitespace-pre-wrap line-clamp-6 hover:line-clamp-none transition-all cursor-pointer">
                                                {insight.content}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 max-w-2xl mx-auto w-full p-6 md:p-12">

                {/* Header */}
                <div className="flex items-center justify-between mb-12 no-print">
                    <button
                        onClick={() => { triggerHaptic(HapticPatterns.light); router.back(); }}
                        className="flex items-center text-slate-400 hover:text-amber-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" /> Back
                    </button>
                    <div className="flex items-center text-amber-500 font-bold uppercase text-xs tracking-widest">
                        <PenTool className="w-4 h-4 mr-2" /> Stoic Journal
                    </div>
                </div>

                <header className="mb-12">
                    <div className="flex justify-between items-start mb-4">
                        <h1 className={`text-3xl font-bold ${accentText}`}>Your Reflections</h1>
                        <div className="flex gap-2 no-print">
                            <button
                                onClick={handleAnalyze}
                                disabled={isAnalyzing || entries.length === 0}
                                title="AI Analysis"
                                className="p-2 bg-amber-500/10 hover:bg-amber-500/20 rounded-lg text-amber-500 border border-amber-500/30 transition-all disabled:opacity-50"
                            >
                                {isAnalyzing ? <div className="w-4 h-4 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            </button>
                            <button onClick={handlePrint} title="Print Journal" className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors">
                                <Printer className="w-4 h-4" />
                            </button>
                            <button onClick={exportToMarkdown} title="Export Markdown" className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors">
                                <FileDown className="w-4 h-4" />
                            </button>
                            <button onClick={exportToJSON} title="Export JSON" className="p-2 bg-slate-800/50 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-amber-500 transition-colors">
                                <Download className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-6 mb-8">
                        <p className={subText}>
                            "No man is free who is not master of himself." — Epictetus
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-8 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search your reflections..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border outline-none transition-all ${theme === 'paper' ? 'bg-white border-slate-200 focus:border-amber-500' : 'bg-slate-800/50 border-slate-700 focus:border-amber-500'}`}
                        />
                    </div>

                    <div className="flex flex-wrap gap-6 text-xs font-medium uppercase tracking-widest text-slate-500">
                        <div className="flex items-center gap-2">
                            <Hash className="w-3 h-3" />
                            <span>{entries.length} Entries</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            <span>{totalWords} Words</span>
                        </div>
                    </div>
                </header>

                {entries.length === 0 ? (
                    searchQuery ? (
                        <div className="text-center py-20 bg-slate-800/20 rounded-2xl border border-dashed border-slate-800">
                            <Search className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                            <h3 className="text-xl font-medium mb-2 text-slate-500">No matches found</h3>
                            <button onClick={() => setSearchQuery("")} className="text-amber-500 underline text-sm">Clear search</button>
                        </div>
                    ) : (
                        <EmptyState
                            title="No entries yet"
                            description="Your reflections are the anchor of your practice. Complete a lesson to record your first entry."
                            actionLabel="Start Training"
                            onAction={() => { triggerHaptic(HapticPatterns.medium); router.push("/"); }}
                        />
                    )
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {entries.map((entry) => (
                            <div key={entry.id} className={`p-6 md:p-8 rounded-2xl border ${cardBg} shadow-sm transition-all hover:shadow-md group`}>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-amber-500 text-[10px] font-bold tracking-[0.2em] uppercase">Day {entry.id}</span>
                                        <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono uppercase tracking-tighter">
                                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(entry.timestamp).toLocaleDateString()}</span>
                                            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {entry.wordCount} words</span>
                                        </div>
                                    </div>
                                    <div className={`p-2 rounded-full ${theme === 'paper' ? 'bg-slate-50' : 'bg-slate-900'}`}>
                                        {getMoodIcon(entry.mood)}
                                    </div>
                                </div>
                                <h3 className={`text-xl font-bold mb-4 ${accentText} group-hover:text-amber-500 transition-colors`}>{entry.title}</h3>
                                <div className={`prose prose-sm max-w-none leading-relaxed whitespace-pre-wrap ${theme === 'paper' ? 'text-slate-600' : 'text-slate-700 dark:text-slate-300'}`}>
                                    {entry.content}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
