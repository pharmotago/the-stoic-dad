# Production Deployment Guide 🚀

Follow these steps to launch the **Stoic Dad** and **Language Coach AI** applications to production.

## 1. Environment Setup
Both applications require specific environment variables to function correctly in production.
- Copy `.env.example` to `.env.local` for local testing.
- Add the variables to your deployment platform (Vercel, Netlify, etc.) under **Project Settings > Environment Variables**.

### Required Keys:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Found in Stripe Dashboard (Developers > API Keys).
- `STRIPE_SECRET_KEY`: Found in Stripe Dashboard. **Keep this secret!**
- `NEXT_PUBLIC_ANALYTICS_ID`: Your Google Analytics or standardized tracking ID.

## 2. Deploying to Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Import the project into [Vercel](https://vercel.com).
3. Vercel will automatically detect the Next.js project.
4. Add the Environment Variables during the import step.
5. Click **Deploy**.

## 3. Stripe Production Checklist
- Switch your Stripe Dashboard from **Test Mode** to **Live Mode**.
- Update the API keys in your production environment variables to the "pk_live_..." and "sk_live_..." versions.
- Ensure your `SUCCESS_URL` and `CANCEL_URL` in the code point to your production domain (e.g., `https://stoic-dad.vercel.app`).

## 4. Multi-Platform Support (PWA)
Both apps are optimized as Progressive Web Apps.
- Ensure the site is served over **HTTPS** (automatic on Vercel).
- Test the "Add to Home Screen" functionality on iOS and Android.
- Verify that icons and manifest branding are appearing correctly.

## 5. Analytics & Monitoring
- Check your analytics dashboard after the first few visits to ensure events like `checkout_initiated` and `referral_shared` are firing correctly.
- Monitor build logs on your deployment platform for any edge-case runtime errors.

---
*The Stoic Ecosystem is ready for the world. Good luck with the launch!*
