import { useState, useRef, useEffect } from "react";
import { Headphones, Play, PenTool, Book, MoreVertical, ArrowRight } from "lucide-react";
import { Module } from "@/lib/schemas";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCourseStore } from "@/store/useCourseStore";
import { audioService, VoicePersona } from "@/lib/audioService";
import { GlassCard, NeuralPulse, SignalPlayer } from "@ecosystem/shared-ui";
import { SignalInsights } from "./SignalInsights";

interface LessonAudioProps {
    module: Module;
    onNext: () => void;
}

export function LessonAudio({ module, onNext }: LessonAudioProps) {
    const { theme } = useCourseStore();
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // TTS Fallback State
    const [isTTS, setIsTTS] = useState(false);

    useEffect(() => {
        // Reset state only when the ACTUAL module changes (by ID)
        setIsPlaying(false);
        setAudioProgress(0);
        setCurrentTime(0);
        audioService.stop();

        if (module.audioUrl) {
            setIsTTS(false);
            if (audioRef.current) {
                audioRef.current.src = module.audioUrl;
                audioRef.current.load();
            }
        } else {
            setIsTTS(true);
        }
    }, [module.id]); // ONLY depend on the module ID for resets

    const handleTogglePlay = () => {
        if (isTTS) {
            // ... existing TTS logic ...
            if (isPlaying) {
                audioService.stop();
                setIsPlaying(false);
            } else {
                setIsPlaying(true);
                audioService.speak(
                    module.content.full_lesson_content,
                    'mentor',
                    (index) => {
                        // Estimate progress
                        const progress = (index / module.content.full_lesson_content.length) * 100;
                        setAudioProgress(progress);
                        setCurrentTime((progress / 100) * 225); // Fake duration
                    },
                    () => setIsPlaying(false)
                );
            }
        } else {
            // MP3 Logic
            if (!audioRef.current) return;

            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const dur = audioRef.current.duration;
            setCurrentTime(current);
            setDuration(dur);
            setAudioProgress((current / dur) * 100);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
        setAudioProgress(100);
    };

    const formatTime = (time: number) => {
        if (!time || isNaN(time)) return "0:00";
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto"
        >
            {/* Audio Element (Hidden) */}
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleTimeUpdate}
                onEnded={handleAudioEnded}
                onError={() => {
                    console.log("Audio URL failed, falling back to TTS");
                    setIsTTS(true);
                }}
                preload="metadata"
            />

            {/* Card Container */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                {module.muxPlaybackId && (
                    <SignalPlayer
                        playbackId={module.muxPlaybackId}
                        title={module.title}
                        accentColor="amber"
                        className="rounded-t-3xl"
                    />
                )}

                <div className="p-6">
                    {/* Header Content */}
                    <div className="flex items-start gap-4 mb-8 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-amber-900/30 flex items-center justify-center border border-amber-500/20 text-amber-500">
                            <Book className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white leading-tight mb-1">{module.title}</h3>
                            <p className="text-sm text-slate-400">{module.summary}</p>
                        </div>
                    </div>

                    {!module.muxPlaybackId && (
                        /* Player UI */
                        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 relative z-10">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase">Audio Guide</span>
                            </div>

                            <div className="flex items-center gap-4">
                                {/* Play Button */}
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={handleTogglePlay}
                                        aria-label={isPlaying ? "Pause" : "Play"}
                                        className="w-10 h-10 rounded-full bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-slate-900 transition-all hover:scale-105 shadow-lg shadow-amber-500/20 flex-shrink-0"
                                    >
                                        {isPlaying ? (
                                            <div className="flex gap-1 h-3">
                                                <div className="w-1 bg-slate-900 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite]" />
                                                <div className="w-1 bg-slate-900 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.1s]" />
                                                <div className="w-1 bg-slate-900 rounded-full animate-[music-bar_0.5s_ease-in-out_infinite_0.2s]" />
                                            </div>
                                        ) : (
                                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                                        )}
                                    </button>
                                    {!isTTS && module.audioUrl && (
                                        <button
                                            onClick={() => setIsTTS(true)}
                                            className="text-[9px] text-slate-500 hover:text-amber-500 uppercase font-black tracking-tighter"
                                        >
                                            Switch to AI
                                        </button>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="flex-1 flex items-center gap-3">
                                    <span className="text-xs text-slate-400 font-mono w-8 text-right">{formatTime(currentTime)}</span>
                                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full relative overflow-hidden">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-100"
                                            style={{ width: `${audioProgress}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-slate-400 font-mono w-8 text-left">{formatTime(isTTS ? 225 : duration)}</span>
                                </div>

                                {/* Volume/Options */}
                                <button className="text-slate-400 hover:text-white transition-colors" title="More options">
                                    <MoreVertical className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {module.id === 6 && (
                <SignalInsights
                    accentColor="amber"
                    segments={[
                        { id: 1, audio_text: "We often talk about a father’s strength, but we rarely talk about his 'temperature.' Why does a father’s calm feel like home?", character_prompt: "Maya looking reflective while leaning her chin on her hand, staring thoughtfully at a minimalist wooden table.", visual_prompt: "A minimalist, sun-drenched Scandinavian apartment. Soft dust motes dancing in golden hour light. No text." },
                        { id: 2, audio_text: "In biology, we call this 'co-regulation.' A temperate father acts as an external nervous system for his child.", character_prompt: "Kael standing in a dimly lit architectural studio, leaning over a blueprint, looking intense and focused.", visual_prompt: "Close-up of architectural tools, charcoal sketches, and a warm desk lamp casting long shadows. High-fidelity textures." },
                        { id: 3, audio_text: "When he remains steady during a tantrum or a crisis, he isn't just being patient. He is literally rewriting the child's stress response.", character_prompt: "Eos manifesting as a rhythmic pulsing of golden light threads weaving through a dark void.", visual_prompt: "Abstract representation of neural pathways glowing with amber light. Intricate, flowing geometry. Minimalist vector style." },
                        { id: 4, audio_text: "His composure lowers the child's cortisol. It signals to their developing brain that the world is, ultimately, a predictable and safe place.", character_prompt: "Kael looking directly into the camera with a grounded, compassionate expression, his charcoal turtleneck texture visible.", visual_prompt: "A blurred background of a library with dark wood shelves. High-contrast, cinematic lighting on Kael's face." },
                        { id: 5, audio_text: "So it’s not just about the lessons he teaches. It’s about the signal he emits when the storm hits.", character_prompt: "Maya standing by a window, looking out at a gentle rain, her oatmeal sweater looking soft and tactile.", visual_prompt: "View through a window of a peaceful garden at dusk. Soft focus on the raindrops on the glass." },
                        { id: 6, audio_text: "The temperate father is the anchor. The steady frequency. The signal in the noise.", character_prompt: "Eos expanding into a brilliant, soft golden halo that fills the frame.", visual_prompt: "A vast, calm horizon where the ocean meets a clear morning sky. Minimalist and serene. No text." }
                    ]}
                />
            )}

            <div className="mt-8 flex justify-center">
                <button
                    onClick={onNext}
                    className="group flex items-center gap-2 px-6 py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded-full text-amber-500 text-sm font-medium transition-all"
                >
                    Continue to Reflection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
