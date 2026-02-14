
export type VoicePersona = 'mentor' | 'system';

class AudioService {
    private synth: SpeechSynthesis | null = null;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

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

        // Prioritize natural sounding male voices for the 'Mentor' persona
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

    speak(text: string, persona: VoicePersona = 'mentor', onBoundary?: (index: number) => void, onEnd?: () => void) {
        if (!this.synth) return;

        this.stop();

        const cleanedText = this.cleanText(text);
        this.currentUtterance = new SpeechSynthesisUtterance(cleanedText);

        const bestVoice = this.getBestVoice();
        if (bestVoice) {
            this.currentUtterance.voice = bestVoice;
        }

        // Stoic voice configuration
        this.currentUtterance.rate = 0.85; // Slightly slower for gravity
        this.currentUtterance.pitch = 0.9;  // Slightly deeper

        this.currentUtterance.onboundary = (event) => {
            if (onBoundary) onBoundary(event.charIndex);
        };

        this.currentUtterance.onend = () => {
            this.currentUtterance = null;
            if (onEnd) onEnd();
        };

        this.synth.speak(this.currentUtterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.currentUtterance = null;
    }
}

export const audioService = new AudioService();
