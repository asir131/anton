# Environment Variables Setup Guide

## Frontend Environment Variables

Create a `.env` file in the root of your frontend project (same directory as `package.json`) with:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### How to Get Your Stripe Publishable Key:

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Click on **Developers** → **API keys**
3. Copy the **Publishable key** (starts with `pk_test_` for test mode or `pk_live_` for production)
4. Paste it in your `.env` file

### Important Notes:

- ✅ **DO** put `VITE_STRIPE_PUBLISHABLE_KEY` in frontend `.env` - this is safe to expose
- ❌ **DON'T** put `STRIPE_WEBHOOK_SECRET` in frontend - this is backend only!
- ❌ **DON'T** put `STRIPE_SECRET_KEY` in frontend - this is backend only!

## Backend Environment Variables

The webhook secret you have (`whsec_9839d1d898e1784ad15c91e063019bbe5f798b39e2a60f6b0a31b558410950b`) should go in your **backend** `.env` file:

```env
STRIPE_WEBHOOK_SECRET=whsec_9839d1d898e1784ad15c91e063019bbe5f798b39e2a60f6b0a31b558410950b
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
```

## Security Reminder

- **Frontend** = Public (anyone can see it) → Only publishable keys
- **Backend** = Private (server-side only) → Secret keys and webhook secrets

Never put secret keys or webhook secrets in frontend code or environment variables!

