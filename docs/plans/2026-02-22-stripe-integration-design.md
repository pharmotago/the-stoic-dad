# Stripe Integration Design

## Objective

Implement a secure, end-to-end Stripe backend integration for the Stoic Dad application using the **Receipt "License Key"** approach.

## Selected Approach: Receipt "License Key"

Users checkout anonymously via Stripe.
Upon successful payment, Stripe fires a webhook to our backend.
Our backend generates a unique "License Key" (UUID), stores it in Supabase, and emails it to the user's provided Stripe checkout email.
The user copies this code and pastes it into the app's `PremiumModal`.
The app validates the code against our backend, marks it as "used", and grants lifetime premium access by updating the local state.

## Architecture & Data Flow

1. **Frontend Checkout Event:** User clicks "Get Lifetime Access" -> `/api/stripe/checkout` -> Redirects to Stripe.
2. **Stripe Webhook:** `/api/stripe/webhook` listens to `checkout.session.completed`.
3. **Key Generation & Storage:** Webhook generates a random `license_key`. It inserts a record into the Supabase table `premium_keys` `(id, key, email, status: 'unused', created_at)`.
4. **Email Delivery:** Webhook triggers an email via **Resend** to the customer's email address containing their unique `license_key`.
5. **Redemption Flow:** User pastes the `license_key` into `PremiumModal.tsx`.
6. **Validation API:** Frontend POSTs to `/api/verify-key` with the key. The API checks Supabase. If the key exists and `status === 'unused'`, it updates it to `status = 'used'` and returns success.
7. **Client State:** Frontend receives success, calls `setPremium(true)`, stores in localStorage, and shows a success toast.

## User Experience Context

We will ensure `PremiumModal.tsx` explicitly explains this process:
*"Secure Checkout via Stripe. After payment, your unique License Key will be emailed to you immediately. Paste it below to unlock the protocol."*
