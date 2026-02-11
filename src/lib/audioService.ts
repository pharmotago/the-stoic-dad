
export type VoicePersona = 'mentor' | 'system';

class AudioService {
    private synth: SpeechSynthesis | null = null;
    private currentUtterance: SpeechSynthesisUtterance | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
        }
    }

    speak(text: string, persona: VoicePersona = 'mentor', onBoundary?: (index: number) => void, onEnd?: () => void) {
        if (!this.synth) return;

        this.stop();

        this.currentUtterance = new SpeechSynthesisUtterance(text);

        // Stoic voice configuration
        this.currentUtterance.rate = 0.9;
        this.currentUtterance.pitch = 0.85;

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
