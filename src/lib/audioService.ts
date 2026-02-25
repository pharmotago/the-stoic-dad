export type VoicePersona = 'mentor' | 'system';

class AudioService {
    private synth: SpeechSynthesis | null = null;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private currentAudio: HTMLAudioElement | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
        }
    }

    private cleanText(text: string): string {
        return text
            .replace(/[*#_~`>]/g, '') // Strip markdown characters
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Strip links but keep text
            .replace(/\n+/g, ' ') // Replace newlines with spaces for smoother flow
            .trim();
    }

    private getBestVoice(): SpeechSynthesisVoice | null {
        if (!this.synth) return null;
        const voices = this.synth.getVoices();

        const priorities = [
            'Google US English',
            'Microsoft Guy',
            'English United States',
            'en-US'
        ];

        for (const name of priorities) {
            const voice = voices.find(v => v.name.includes(name) || v.lang.includes(name));
            if (voice) return voice;
        }

        return voices[0] || null;
    }

    /**
     * Attempts to use the Premium API TTS
     * Falls back to Browser Synthesis if API fails
     */
    async speak(text: string, persona: VoicePersona = 'mentor', onBoundary?: (index: number) => void, onEnd?: () => void) {
        this.stop();
        const cleanedText = this.cleanText(text);

        try {
            const voice = persona === 'mentor' ? 'en-US-Neural2-D' : 'en-US-Neural2-F';
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: cleanedText, voice }),
            });

            if (!response.ok) throw new Error('Premium TTS API failed');

            const data = await response.json();
            if (data.audioContent) {
                const audioBlob = this.base64ToBlob(data.audioContent, 'audio/mp3');
                const audioUrl = URL.createObjectURL(audioBlob);

                this.currentAudio = new Audio(audioUrl);
                this.currentAudio.onended = () => {
                    if (onEnd) onEnd();
                    URL.revokeObjectURL(audioUrl);
                };
                this.currentAudio.play();
                return;
            }
        } catch (err) {
            console.warn('Falling back to Browser TTS:', err);
            this.speakWithBrowser(cleanedText, onBoundary, onEnd);
        }
    }

    private speakWithBrowser(text: string, onBoundary?: (index: number) => void, onEnd?: () => void) {
        if (!this.synth) return;

        this.currentUtterance = new SpeechSynthesisUtterance(text);
        const bestVoice = this.getBestVoice();
        if (bestVoice) this.currentUtterance.voice = bestVoice;

        this.currentUtterance.rate = 0.85;
        this.currentUtterance.pitch = 0.9;

        this.currentUtterance.onboundary = (event) => {
            if (onBoundary) onBoundary(event.charIndex);
        };

        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
            if (onEnd) onEnd();
        };

        this.synth.speak(this.currentUtterance);
    }

    private base64ToBlob(base64: string, type: string) {
        const binStr = atob(base64);
        const len = binStr.length;
        const arr = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            arr[i] = binStr.charCodeAt(i);
        }
        return new Blob([arr], { type });
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        if (this.currentAudio) {
            this.currentAudio.pause();
            this.currentAudio = null;
        }
        this.currentUtterance = null;
    }
}

export const audioService = new AudioService();
