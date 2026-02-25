# Stripe License Key Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement a complete Stripe fulfillment flow that generates, emails, and redeems unique license keys to unlock premium access.

**Architecture:** A Supabase table stores generated license keys. A Stripe webhook creates the key and emails it via Resend upon successful payment. A Next.js API route verifies and consumes the key when the user submits it in the frontend.

**Tech Stack:** Next.js App Router, Stripe SDK, Supabase JS Client, Resend API.

---

### Task 1: Supabase Database Schema

**Files:**

- Create: `supabase/migrations/20260222_premium_keys.sql`

**Step 1: Write the migration**

```sql
CREATE TABLE public.premium_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    key_code TEXT UNIQUE NOT NULL,
    customer_email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'unused' CHECK (status IN ('unused', 'used')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies
ALTER TABLE public.premium_keys ENABLE ROW LEVEL SECURITY;

-- Only service role can insert/update (backend operations)
CREATE POLICY "Service role can manage premium keys" 
ON public.premium_keys 
USING (true) 
WITH CHECK (true);
```

**Step 2: Commit**

```bash
git add supabase/migrations/20260222_premium_keys.sql
git commit -m "feat(db): create premium_keys table"
```

---

### Task 2: Supabase Client & Resend Configuration

**Files:**

- Modify: `.env.local`
- Modify: `package.json`

**Step 1: Install Resend**

```bash
npm install resend
```

**Step 2: Add Resend to Env**

Ensure `RESEND_API_KEY` is added to your local `.env.local` file.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add resend dependency"
```

---

### Task 3: Stripe Webhook Implementation

**Files:**

- Create: `src/app/api/stripe/webhook/route.ts`
- Create: `src/lib/email.ts`

**Step 1: Write Email Utility**

```typescript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLicenseKeyEmail(email: string, keyCode: string) {
    try {
        await resend.emails.send({
            from: 'Stoic Dad Protocol <access@the-stoic-dad.com>',
            to: email,
            subject: 'Your Premium Access Key - The Stoic Dad',
            html: `
                <h2>Welcome to the Inner Circle</h2>
                <p>Your payment was successful. Here is your unique lifetime access key:</p>
                <div style="padding: 16px; background: #f1f5f9; border-radius: 8px; font-family: monospace; font-size: 20px; font-weight: bold; letter-spacing: 2px; text-align: center; margin: 20px 0;">
                    ${keyCode}
                </div>
                <p>Open the app, click "Unlock Protocol", and paste this code to begin.</p>
                <br/>
                <p>Stay strong,</p>
                <p>The MCJP Team</p>
            `
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
```

**Step 2: Write the Webhook Endpoint**

```typescript
// src/app/api/stripe/webhook/route.ts
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
            const keyCode = \`STOIC-\${randomHex.substring(0,4)}-\${randomHex.substring(4,8)}\`;

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
```

**Step 3: Commit**

```bash
git add src/app/api/stripe/webhook/route.ts src/lib/email.ts
git commit -m "feat(stripe): add webhook and resend integration"
```

---

### Task 4: Key Verification API

**Files:**

- Create: `src/app/api/verify-key/route.ts`

**Step 1: Write Verification Logic**

```typescript
// src/app/api/verify-key/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const { key } = await req.json();

        if (!key) {
            return NextResponse.json({ error: 'Key is required' }, { status: 400 });
        }

        // Check if key exists and is unused
        const { data, error } = await supabase
            .from('premium_keys')
            .select('*')
            .eq('key_code', key)
            .eq('status', 'unused')
            .single();

        if (error || !data) {
            return NextResponse.json({ error: 'Invalid or already used access key.' }, { status: 400 });
        }

        // Mark as used
        const { error: updateError } = await supabase
            .from('premium_keys')
            .update({ status: 'used', used_at: new Date().toISOString() })
            .eq('id', data.id);

        if (updateError) {
            return NextResponse.json({ error: 'Failed to redeem key.' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Verify Key Error:', err);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
```

**Step 2: Commit**

```bash
git add src/app/api/verify-key/route.ts
git commit -m "feat(api): add verify-key endpoint for redemption"
```

---

### Task 5: Frontend UI & Redemption Integration

**Files:**

- Modify: `src/components/PremiumModal.tsx`

**Step 1: Update API call and UI text**

Update `handleSubmit` to hit the new API and rewrite the descriptive text to explain the process clearly to users.

```typescript
// Replace handleSubmit in src/components/PremiumModal.tsx
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
        setIsProcessing(true); // Re-using state for key verification
        const res = await fetch('/api/verify-key', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ key: code.trim().toUpperCase() }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
            onUnlock();
            onClose();
            play('success');
            triggerHaptic(HapticPatterns.success);
            showToast('Premium Access Unlocked! Welcome to the inner circle.', 'success');
        } else {
            throw new Error(data.error || 'Invalid code');
        }
    } catch (err: any) {
        setError(true);
        play('lock');
        triggerHaptic(HapticPatterns.error);
        showToast(err.message, 'error');
        setTimeout(() => setError(false), 2000);
    } finally {
        setIsProcessing(false);
    }
};

// Update the instructional text somewhere in the JSX
// E.g., adding this above the CTA:
// <p className="text-sm text-slate-400 text-center mb-4">
//   After secure checkout, an email will arrive instantly with your unique License Key. Paste it above to unlock the app.
// </p>
```

**Step 2: Commit**

```bash
git add src/components/PremiumModal.tsx
git commit -m "feat(ui): integrate real verify-key api and update ux copy"
```
