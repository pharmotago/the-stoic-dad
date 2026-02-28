/**
 * Stripe Integration Utility
 * This handles the initialization of Stripe and checkout session logic.
 */

import { loadStripe, Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');
    }
    return stripePromise;
};

/**
 * Creates a Stripe Checkout Session
 * Handles both one-time payments and recurring subscriptions.
 */
export async function createCheckoutSession(priceId: string, options: { addJournal?: boolean, mode?: 'payment' | 'subscription', giftEmail?: string } = {}) {
    try {
        const response = await fetch('/api/stripe/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                priceId,
                addJournal: options.addJournal,
                mode: options.mode || 'subscription',
                giftEmail: options.giftEmail
            }),
        });

        const session = await response.json();

        if (session.error) {
            throw new Error(session.error.message);
        }

        return session;
    } catch (error: any) {
        console.error('Error creating checkout session:', error);
        throw error;
    }
}
