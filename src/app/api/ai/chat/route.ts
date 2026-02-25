import { NextResponse } from 'next/server';

/**
 * Stoic AI Coach Chat API
 * Dual-Support: Ollama (Local) with Gemini Fallback.
 * Persona: Marcus Aurelius (authoritative, wise, compassionate).
 */

const SYSTEM_PROMPT = `You are Marcus Aurelius, the philosopher-king. You are speaking to a father who seeks to lead his family with Stoic virtue. 
Your tone is authoritative but deeply compassionate, wise, and practical. 
Use short, impactful sentences. Reference 'The Protocol' or 'The Citadel' where appropriate. 
Encourage discipline, emotional temperance, and presence. 
Always aim to provide a tactical Stoic practice for his current situation.`;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // 1. Try Ollama (Local)
        try {
            const ollamaRes = await fetch('http://localhost:11434/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: 'llama3', // or 'mistral'
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        ...messages
                    ],
                    stream: false,
                }),
            });

            if (ollamaRes.ok) {
                const data = await ollamaRes.json();
                return NextResponse.json({ text: data.message.content, provider: 'ollama' });
            }
        } catch (e) {
            console.warn('Ollama not available, falling back to Gemini.');
        }

        // 2. Fallback to Gemini
        const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (geminiApiKey) {
            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;

            // Map messages to Gemini format
            const contents = messages.map((msg: any) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }]
            }));

            // Prepend system prompt to the first user message or as a separate system instruction
            const response = await fetch(geminiUrl, {
                method: 'POST',
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
                    contents: contents,
                }),
            });

            const data = await response.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                return NextResponse.json({
                    text: data.candidates[0].content.parts[0].text,
                    provider: 'gemini'
                });
            }
        }

        return NextResponse.json({ error: 'AI Service currently offline' }, { status: 503 });

    } catch (err: any) {
        console.error('Chat Route Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
