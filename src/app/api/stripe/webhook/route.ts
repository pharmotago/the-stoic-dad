import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabase';
import { sendLicenseKeyEmail } from '@/lib/email';
import crypto from 'crypto';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' as any });
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
    } catch (err: any) {
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const customerEmail = session.customer_details?.email;

        if (customerEmail) {
            // Generate a secure, readable key (e.g., STOIC-A1B2-C3D4)
            const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
            const keyCode = `STOIC-${randomHex.substring(0, 4)}-${randomHex.substring(4, 8)}`;

            // Insert into Supabase
            const { error } = await supabase
                .from('premium_keys')
                .insert([{ key_code: keyCode, customer_email: customerEmail, status: 'unused' }]);

            if (error) {
                console.error('Supabase Error:', error);
                return NextResponse.json({ error: 'Database Error' }, { status: 500 });
            }

            // Send Email
            await sendLicenseKeyEmail(customerEmail, keyCode);
        }
    }

    return NextResponse.json({ received: true });
}
