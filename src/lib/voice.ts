
class VoiceService {
    private synth: SpeechSynthesis | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
        }
    }

    speak(text: string) {
        if (!this.synth) return;

        this.synth.cancel();
        const utterance = new SpeechSynthesisUtterance(text);

        // Stoic voice configuration
        utterance.rate = 0.9;
        utterance.pitch = 0.85;

        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}

export const voiceService = new VoiceService();
