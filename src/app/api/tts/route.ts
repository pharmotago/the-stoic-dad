import { NextResponse } from 'next/server';

/**
 * Stoic TTS API Route
 * Integrates with Google Cloud Text-to-Speech (REST API)
 * Features: Neural2/Journey voices, Stoic pacing (0.85x), and Lower Pitch.
 */

export async function POST(req: Request) {
    try {
        const { text, voice = 'en-US-Neural2-D' } = await req.json();

        if (!text) {
            return NextResponse.json({ error: 'Text is required' }, { status: 400 });
        }

        const apiKey = process.env.GOOGLE_CLOUD_TTS_API_KEY;
        if (!apiKey) {
            console.error('GOOGLE_CLOUD_TTS_API_KEY is missing');
            return NextResponse.json({ error: 'TTS Service Unavailable' }, { status: 503 });
        }

        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

        // Stoic Tone Optimization
        // We use SSML to add deliberate pauses at commas and periods if needed, 
        // but simple audioConfig usually suffices for rate/pitch.
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                input: { text },
                voice: {
                    languageCode: 'en-US',
                    name: voice, // Journey voices usually look like en-US-Journey-F/D
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 0.82, // Slower for authority
                    pitch: -3.5,        // Deeper for gravitas
                    effectsProfileId: ['small-bluetooth-speaker-class-device'],
                },
            }),
        });

        const data = await response.json();

        if (data.error) {
            console.error('Google TTS Error:', data.error);
            return NextResponse.json({ error: data.error.message }, { status: 500 });
        }

        return NextResponse.json({ audioContent: data.audioContent });
    } catch (err: any) {
        console.error('TTS Route Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
