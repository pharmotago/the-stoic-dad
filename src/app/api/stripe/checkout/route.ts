import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
    try {
        const { priceId } = await req.json();

        if (!priceId) {
            return NextResponse.json({ error: 'Price ID is required' }, { status: 400 });
        }

        // Use the origin for success and cancel URLs
        const origin = req.headers.get('origin') || 'https://the-stoic-dad.vercel.app';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${origin}/?success=true`,
            cancel_url: `${origin}/?canceled=true`,
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (err: any) {
        console.error('Stripe session error:', err);
        return NextResponse.json({ error: { message: err.message } }, { status: 500 });
    }
}
