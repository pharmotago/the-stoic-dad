/**
 * Stoic Dad Audio Service
 * Manages Lesson Narration (TTS) and Atmospheric Background Loops.
 */

export type VoicePersona = 'mentor' | 'philosopher' | 'warrior';

class AudioService {
    private synth: SpeechSynthesis | null = null;
    private utterance: SpeechSynthesisUtterance | null = null;
    private audioContext: AudioContext | null = null;
    private ambientGain: GainNode | null = null;
    private isPlayingSpeech = false;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    public getVoices(): SpeechSynthesisVoice[] {
        if (!this.synth) return [];
        return this.synth.getVoices();
    }

    public speak(text: string, persona: VoicePersona = 'mentor', onBoundary?: (charIndex: number) => void, onEnd?: () => void) {
        if (!this.synth) return;

        this.stop();

        // Strip markdown-like characters for cleaner speech
        const cleanText = text.replace(/[#*`✨🏛️🧠🧬🛡️⚔️🚗🎬🤬🛑👀🤔🤐🏃‍♂️📜🧘🗣️🏷️🌪️]/g, '');

        this.utterance = new SpeechSynthesisUtterance(cleanText);

        // Select voice based on persona and availability
        const voices = this.getVoices();
        let selectedVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Google'));

        if (persona === 'philosopher') {
            selectedVoice = voices.find(v => v.name.includes('Premium') || v.name.includes('Natural')) || selectedVoice;
            this.utterance.pitch = 0.8;
            this.utterance.rate = 0.85;
        } else if (persona === 'warrior') {
            this.utterance.pitch = 0.7;
            this.utterance.rate = 1.0;
        } else {
            this.utterance.pitch = 1.0;
            this.utterance.rate = 0.95;
        }

        if (selectedVoice) {
            this.utterance.voice = selectedVoice;
        }

        this.utterance.onboundary = (event) => {
            if (onBoundary) onBoundary(event.charIndex);
        };

        this.utterance.onend = () => {
            this.isPlayingSpeech = false;
            if (onEnd) onEnd();
            this.stopAmbient();
        };

        this.isPlayingSpeech = true;
        this.synth.speak(this.utterance);
        this.startAmbient('wind');
    }

    public pause() {
        if (this.synth) this.synth.pause();
        if (this.audioContext) this.audioContext.suspend();
    }

    public resume() {
        if (this.synth) this.synth.resume();
        if (this.audioContext) this.audioContext.resume();
    }

    public stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.isPlayingSpeech = false;
        this.stopAmbient();
    }

    private async startAmbient(type: 'wind' | 'fire' | 'night' = 'wind') {
        if (!this.audioContext) return;

        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }

        this.stopAmbient();

        this.ambientGain = this.audioContext.createGain();
        this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.05, this.audioContext.currentTime + 2);
        this.ambientGain.connect(this.audioContext.destination);

        // Simulation of low-frequency rumble/wind using white noise + lowpass
        const bufferSize = 2 * this.audioContext.sampleRate;
        const noiseBuffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }

        const whiteNoise = this.audioContext.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const lowpass = this.audioContext.createBiquadFilter();
        lowpass.type = 'lowpass';
        lowpass.frequency.setValueAtTime(200, this.audioContext.currentTime);
        lowpass.Q.setValueAtTime(5, this.audioContext.currentTime);

        whiteNoise.connect(lowpass);
        lowpass.connect(this.ambientGain);
        whiteNoise.start();
    }

    private stopAmbient() {
        if (this.ambientGain) {
            this.ambientGain.gain.linearRampToValueAtTime(0, this.audioContext?.currentTime || 0 + 1);
            setTimeout(() => {
                this.ambientGain?.disconnect();
                this.ambientGain = null;
            }, 1000);
        }
    }
}

export const audioService = new AudioService();
