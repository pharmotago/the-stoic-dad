import { NextResponse } from 'next/server';
import { Resend } from 'resend';

// Make sure RESEND_API_KEY and RESEND_AUDIENCE_ID are in .env.local
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();
        if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

        // Add to Resend Audience/Contacts
        const { error } = await resend.contacts.create({
            email: email,
            audienceId: process.env.RESEND_AUDIENCE_ID || '', // Fallback to empty to satisfy typing if missing
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            coupon: 'STOICDAD20', // Limited time 20% off for new leads
            message: 'Successfully subscribed to the protocol.'
        });
    } catch (err) {
        console.error('Server error:', err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
