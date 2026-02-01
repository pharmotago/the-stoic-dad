/**
 * Sound Assets & Generation
 */

// We will use AudioContext for procedural sounds to keep external deps low
// But we'll structure it to allow file assets later if needed.

export type SoundType = 'send' | 'receive' | 'success' | 'error' | 'click' | 'hover' | 'unlock' | 'ambient_reflect';

class SoundService {
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;
    private volume: number = 0.5;

    constructor() {
        if (typeof window !== 'undefined') {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                this.audioContext = new AudioContextClass();
            }
        }
    }

    public setMuted(muted: boolean) {
        this.isMuted = muted;
    }

    public setVolume(vol: number) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    private playTone(freq: number, type: OscillatorType, duration: number, startTime: number = 0) {
        if (!this.audioContext || this.isMuted) return;

        // Resume context if suspended (browser policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + startTime);

        gain.gain.setValueAtTime(this.volume * 0.1, this.audioContext.currentTime + startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + startTime + duration);

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.start(this.audioContext.currentTime + startTime);
        osc.stop(this.audioContext.currentTime + startTime + duration);
    }

    public play(sound: SoundType) {
        if (!this.audioContext) return;

        switch (sound) {
            case 'click':
                this.playTone(800, 'sine', 0.05); // Short tick
                break;
            case 'hover':
                // Very subtle, maybe skip or just very low volume/freq
                // this.playTone(400, 'sine', 0.02);
                break;
            case 'send':
                // Rising pitch "Whoosh"
                this.playTone(400, 'sine', 0.1);
                this.playTone(600, 'sine', 0.1, 0.05);
                this.playTone(800, 'triangle', 0.15, 0.1);
                break;
            case 'receive':
                // Soft chime "Ding-dong"
                this.playTone(600, 'sine', 0.2);
                this.playTone(400, 'sine', 0.4, 0.15);
                break;
            case 'success':
                // Major chord equivalent
                this.playTone(523.25, 'sine', 0.2); // C5
                this.playTone(659.25, 'sine', 0.2, 0.1); // E5
                this.playTone(783.99, 'sine', 0.4, 0.2); // G5
                break;
            case 'error':
                // Dissonant / Low thud
                this.playTone(150, 'sawtooth', 0.2);
                this.playTone(140, 'sawtooth', 0.2, 0.1);
                break;
            case 'unlock':
                // Magical arpeggio
                const now = 0;
                [440, 554, 659, 880, 1108, 1318, 1760].forEach((freq, i) => {
                    this.playTone(freq, 'sine', 0.5, now + (i * 0.06));
                });
                break;
            case 'ambient_reflect':
                // Submarine-like deep atmospheric drone (procedurally simulated)
                this.playAtmosphericDrone();
                break;
        }
    }

    private playAtmosphericDrone() {
        if (!this.audioContext || this.isMuted) return;

        const masterGain = this.audioContext.createGain();
        masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
        masterGain.gain.linearRampToValueAtTime(this.volume * 0.05, this.audioContext.currentTime + 2);
        masterGain.connect(this.audioContext.destination);

        const createOsc = (freq: number, type: OscillatorType, detour: number) => {
            if (!this.audioContext) return;
            const osc = this.audioContext.createOscillator();
            const g = this.audioContext.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);
            osc.detune.setValueAtTime(detour, this.audioContext.currentTime);
            g.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            osc.connect(g);
            g.connect(masterGain);
            osc.start();
            return { osc, g };
        };

        const oscs = [
            createOsc(60, 'sine', 0),
            createOsc(62, 'sine', 5),
            createOsc(120, 'triangle', -5)
        ];

        // Stop after 30 seconds
        setTimeout(() => {
            if (!this.audioContext) return;
            masterGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 3);
            setTimeout(() => {
                oscs.forEach(o => o?.osc.stop());
            }, 3001);
        }, 30000);
    }
}

export const soundService = new SoundService();
