/**
 * Voice Synthesis Service (Ported from Language Coach)
 * Wrapper around Web Speech API for Text-to-Speech
 */

export interface VoiceOptions {
    rate?: number;  // 0.1 to 10
    pitch?: number; // 0 to 2
    volume?: number; // 0 to 1
    voice?: SpeechSynthesisVoice | null;
}

class VoiceService {
    private synthesis: SpeechSynthesis | null = null;
    private voices: SpeechSynthesisVoice[] = [];

    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synthesis = window.speechSynthesis;
            this.loadVoices(); // Initial load

            // Chrome loads voices asynchronously
            if (window.speechSynthesis.onvoiceschanged !== undefined) {
                window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
            }
        }
    }

    private loadVoices() {
        if (!this.synthesis) return;
        this.voices = this.synthesis.getVoices();
    }

    public getVoices(): SpeechSynthesisVoice[] {
        return this.voices;
    }

    /**
     * Tries to find a deep, male British or English voice for Marcus Aurelius
     */
    public getMarcusVoice(): SpeechSynthesisVoice | null {
        // 1. Look for specific "Male" and "English" voices
        let voice = this.voices.find(v => v.name.includes('Male') && v.lang.startsWith('en'));

        // 2. Look for "Google UK English Male" (Common on Chrome)
        if (!voice) {
            voice = this.voices.find(v => v.name.includes('United Kingdom') || v.name.includes('UK'));
        }

        // 3. Fallback to any English voice
        if (!voice) {
            voice = this.voices.find(v => v.lang.startsWith('en'));
        }

        return voice || this.voices[0] || null;
    }

    public speak(text: string, options: VoiceOptions = {}) {
        if (!this.synthesis) {
            console.error('[VoiceService] SpeechSynthesis not supported');
            return;
        }

        // Cancel current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Default to English for Marcus

        // Stoic settings: Slower, slightly lower pitch
        utterance.rate = options.rate || 0.9;
        utterance.pitch = options.pitch || 0.9;
        utterance.volume = options.volume || 1.0;

        const voice = options.voice || this.getMarcusVoice();

        if (voice) {
            // console.log(`[VoiceService] Marcus speaking with: ${voice.name} (${voice.lang})`);
            utterance.voice = voice;
        }

        this.synthesis.speak(utterance);
    }

    public cancel() {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }
}

// Singleton instance
export const voiceService = new VoiceService();
