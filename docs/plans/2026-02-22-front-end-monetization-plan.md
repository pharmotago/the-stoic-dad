# Implementation Plan: In-App Conversion Triggers & Lead Gen

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement front-end psychological triggers (Teasers & Countdowns) and connect the Lead Generation Modal to Resend to start capturing emails. This works independently of the Stripe License Key backend.

**Architecture:**

1. `ModuleCard` and `LessonView` will be updated to allow "Teaser Mode" for locked modules.
2. `PricingTable` will receive a visual countdown timer to drive urgency.
3. `LeadGenModal` and a new API route will connect to Resend's Audiences to capture emails.

**Tech Stack:** Next.js App Router, Tailwind CSS, Resend API.

---

### Task 1: Module Teaser Mode (The Psychology)

Instead of a hard lock on the `ModuleCard`, we allow them to click it. When they view the `LessonView`, we show the first paragraph, then blur the rest and show a strong CTA to upgrade.

**Files:**

- Modify: `src/components/ModuleCard.tsx`
- Modify: `src/components/LessonView.tsx`

**Step 1: Allow clicking locked modules**
In `ModuleCard.tsx`, change `isLocked && "cursor-not-allowed opacity-40"` to allow clicks but indicate it's premium.

**Step 2: Implement the blur overlay in LessonView**
In `LessonView.tsx`:

```tsx
// If the module is locked (id > 3 and not premium)
const isPreviewMode = !useCourseStore(state => state.isPremium) && module.id > 3;

// Wrap the main content:
<div className="relative">
    <div className={cn(isPreviewMode && "max-h-64 overflow-hidden blur-[2px] pointer-events-none select-none relative z-0 opacity-80 transition-all duration-1000")}>
        {/* Existing Content Mapping */}
    </div>
    
    {isPreviewMode && (
        <div className="absolute inset-x-0 bottom-0 top-32 flex flex-col justify-end items-center p-8 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10">
            <Lock className="w-12 h-12 text-amber-500 mb-4 animate-bounce" />
            <h3 className="text-2xl font-black text-white mb-2">Unlock The Protocol</h3>
            <p className="text-slate-400 text-center max-w-md mb-6">
                This tactic is reserved for the Inner Circle. Reclaim your peace and lead your family with unwavering strength.
            </p>
            <button 
                onClick={() => (window as any).dispatchEvent(new CustomEvent('open-premium-modal'))}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl shadow-xl shadow-amber-500/20 transform hover:-translate-y-1 transition-all"
            >
                Get Lifetime Access Now
            </button>
        </div>
    )}
</div>
```

**Step 3: Commit**

```bash
git add src/components/ModuleCard.tsx src/components/LessonView.tsx
git commit -m "feat(ui): implement content teasers for premium modules"
```

---

### Task 2: Pricing Table Scarcity Timer

Add a countdown timer to the $29 offer to increase conversion via urgency.

**Files:**

- Modify: `src/components/PricingTable.tsx`

**Step 1: Add Countdown Hook & UI**

```tsx
import { useState, useEffect } from 'react';

// Inside PricingTable component:
const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

useEffect(() => {
    const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
}, []);

const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return \`\${m.toString().padStart(2, '0')}:\${s.toString().padStart(2, '0')}\`;
};

// In the Pro Tier JSX, above the price:
<div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-lg">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
    </span>
    <span className="text-red-400 font-mono font-bold text-sm tracking-widest">
        OFFER EXPIRES IN: {formatTime(timeLeft)}
    </span>
</div>
```

**Step 2: Commit**

```bash
git add src/components/PricingTable.tsx
git commit -m "feat(ui): add scarcity countdown timer to pricing table"
```

---

### Task 3: Lead Gen Email Capture API

Wire the existing Lead Gen Modal to a real backend to collect emails using Resend Audiences.

**Files:**

- Create: `src/app/api/subscribe/route.ts`
- Modify: `src/components/LeadGenModal.tsx`

**Step 1: Create Subscription Route**

```typescript
// src/app/api/subscribe/route.ts
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
            audienceId: process.env.RESEND_AUDIENCE_ID!,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
```

**Step 2: Update LeadGenModal Form**
Update `handleSubmit` to call `/api/subscribe` instead of `console.log`.

**Step 3: Commit**

```bash
git add src/app/api/subscribe/route.ts src/components/LeadGenModal.tsx
git commit -m "feat(api): connect lead gen modal to resend audience"
```
