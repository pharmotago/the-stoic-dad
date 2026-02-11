import React, { useState } from 'react';
import { Shield, Eye, Hourglass, Scale, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const protocols = [
    {
        id: 'control',
        icon: Scale,
        title: 'Dichotomy of Control',
        prompt: 'Is this within my control?',
        technique: 'Separate external chaos from your internal state (Hegemonikon). Focus energy only on your judgment and your next action. Everything else is indifferent.',
        color: 'amber'
    },
    {
        id: 'above',
        icon: Eye,
        title: 'View From Above',
        prompt: 'Will this matter in 5 years?',
        technique: 'Zoom out temporally and physically. Silence the Amygdala by viewing this moment as a single pixel in an eternal tapestry. Perspective is your superpower.',
        color: 'blue'
    },
    {
        id: 'memento',
        icon: Hourglass,
        title: 'Memento Mori',
        prompt: 'How would I act if this were our last day?',
        technique: 'Presence over pride. Your time with them is a finite loan from the universe. Every second of rage is a second of life that is gone forever.',
        color: 'purple'
    },
    {
        id: 'pause',
        icon: Shield,
        title: 'Tactical Pause',
        prompt: 'Breathe. Identify the hijack. Choose wisdom.',
        technique: '1. Detect the "Heat" in your chest. 2. Identify it: "This is a biological prediction error." 3. Pause for 3 cycles of breath. 4. Re-engage the Prefrontal Cortex.',
        color: 'emerald'
    }
];

interface EmergencyToolkitProps {
    isOpen: boolean;
    onClose: () => void;
}

export function EmergencyToolkit({ isOpen, onClose }: EmergencyToolkitProps) {
    const [selected, setSelected] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const selectedProtocol = protocols.find(p => p.id === selected);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-red-900/20 to-slate-900">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                            <Shield className="w-6 h-6 text-red-500" />
                            Emergency Protocols
                        </h3>
                        <p className="text-sm text-slate-400 mt-1">Quick access when crisis strikes</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto">
                    {!selectedProtocol ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {protocols.map((protocol) => {
                                const Icon = protocol.icon;
                                return (
                                    <button
                                        key={protocol.id}
                                        onClick={() => setSelected(protocol.id)}
                                        className={cn(
                                            "p-6 rounded-xl border-2 text-left transition-all duration-200 hover:scale-105 active:scale-95",
                                            "bg-slate-800/50 border-slate-700 hover:border-amber-500/50"
                                        )}
                                    >
                                        <Icon className={cn("w-8 h-8 mb-3", `text-${protocol.color}-500`)} />
                                        <h4 className="font-bold text-white mb-2">{protocol.title}</h4>
                                        <p className="text-sm text-slate-400 italic">"{protocol.prompt}"</p>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="animate-in slide-in-from-right duration-300">
                            <button
                                onClick={() => setSelected(null)}
                                className="text-amber-500 hover:text-amber-400 mb-4 text-sm flex items-center gap-1"
                            >
                                ← Back to protocols
                            </button>

                            <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700 relative overflow-hidden">
                                {selected === 'pause' && (
                                    <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                                        <div className="w-32 h-32 rounded-full bg-emerald-500/30 animate-breathe blur-xl" />
                                    </div>
                                )}

                                <h4 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                                    {selectedProtocol.title}
                                    {selected === 'pause' && <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full animate-pulse">Breathing Assistant Active</span>}
                                </h4>

                                <div
                                    className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg cursor-pointer hover:bg-amber-500/20 transition-colors group relative"
                                    onClick={() => handleCopy(selectedProtocol.prompt)}
                                >
                                    <p className="text-lg text-amber-100 italic pr-8">"{selectedProtocol.prompt}"</p>
                                    <div className="absolute top-4 right-4 text-amber-500/50 group-hover:text-amber-500 transition-colors text-xs font-mono">
                                        {copied ? 'COPIED' : 'COPY'}
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none">
                                    <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
                                        {selectedProtocol.technique}
                                    </p>
                                </div>

                                <div className="mt-6 p-4 bg-emerald-950/30 border border-emerald-900/50 rounded-lg">
                                    <p className="text-sm text-emerald-200">
                                        <strong>Practice:</strong> Read this aloud. Let it anchor you. You are in control of your mind, not your impulses.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
