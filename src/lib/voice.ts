
class VoiceService {
    private synth: SpeechSynthesis | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.synth = window.speechSynthesis;
        }
    }

    private cleanText(text: string): string {
        return text
            .replace(/[*#_~`>]/g, '')
            .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
            .replace(/\n+/g, ' ')
            .trim();
    }

    private getBestVoice(): SpeechSynthesisVoice | null {
        if (!this.synth) return null;
        const voices = this.synth.getVoices();
        const priorities = ['Google US English', 'Microsoft Guy', 'en-US'];

        for (const name of priorities) {
            const voice = voices.find(v => v.name.includes(name));
            if (voice) return voice;
        }
        return voices[0] || null;
    }

    speak(text: string) {
        if (!this.synth) return;

        this.synth.cancel();
        const cleanedText = this.cleanText(text);
        const utterance = new SpeechSynthesisUtterance(cleanedText);

        const bestVoice = this.getBestVoice();
        if (bestVoice) {
            utterance.voice = bestVoice;
        }

        // Stoic voice configuration
        utterance.rate = 0.85;
        utterance.pitch = 0.9;

        this.synth.speak(utterance);
    }

    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
    }
}

export const voiceService = new VoiceService();
