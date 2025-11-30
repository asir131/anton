# Webhook Configuration Guide - Stripe Payment Processing

## Current Status

✅ **The webhook endpoint is already implemented and working!**

The backend webhook endpoint is located at:
```
POST /api/v1/payments/webhook
```

**Note:** The endpoint path is `/api/v1/payments/webhook` (not `/api/v1/webhooks/stripe` as mentioned in some docs).

## The Problem

If payments are stuck at "pending" status, it's likely because:
1. **Stripe Dashboard webhook is not configured** to point to the correct URL
2. **Webhook secret is missing or incorrect** in backend environment variables
3. **Webhook events are not being received** (check Stripe Dashboard → Webhooks → Recent events)

## Backend Implementation (Already Done ✅)

The webhook handler is already implemented in:
- **Route:** `src/routes/api/v1/payments.js` → `/webhook`
- **Controller:** `src/controllers/paymentController.js` → `handleWebhook()`
- **Service:** `src/services/stripeService.js` → `verifyWebhookSignature()`

The webhook handler:
- ✅ Verifies Stripe webhook signatures
- ✅ Processes `payment_intent.succeeded` events
- ✅ Creates tickets automatically
- ✅ Updates payment status
- ✅ Awards points to users
- ✅ Clears cart after successful checkout

### 2. Webhook Handler Implementation

The webhook handler is already implemented and handles:
- `payment_intent.succeeded` - Creates tickets and updates payment status
- `payment_intent.payment_failed` - Marks payment as failed
- `payment_intent.canceled` - Marks payment as canceled

**Location:** `src/controllers/paymentController.js` → `handleWebhook()`

**What it does:**
1. Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
2. Processes payment success and creates tickets automatically
3. Updates payment status in database
4. Awards points to users
5. Clears cart after successful checkout
6. Updates competition ticket counts

### 3. Required Environment Variables (Backend)

Make sure these are set in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_...  # Your Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...  # Webhook signing secret (get from Stripe Dashboard)
```

**Important:** The `STRIPE_WEBHOOK_SECRET` must match the signing secret from your Stripe Dashboard webhook configuration.

### 4. Configure Webhook in Stripe Dashboard ⚠️ **THIS IS THE KEY STEP**

**The webhook endpoint exists, but you need to configure it in Stripe Dashboard:**

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/) → Developers → Webhooks
2. Click **"Add endpoint"** (or edit existing endpoint if one exists)
3. **Endpoint URL:** `https://your-backend-domain.com/api/v1/payments/webhook`
   - **Important:** Use `/api/v1/payments/webhook` (not `/webhooks/stripe`)
   - Example: `https://anton-backend.onrender.com/api/v1/payments/webhook`
4. **Events to listen for:** Select these events:
   - `payment_intent.succeeded` ✅ (Required)
   - `payment_intent.payment_failed` (Optional but recommended)
   - `payment_intent.canceled` (Optional but recommended)
5. Click **"Add endpoint"**
6. **Copy the "Signing secret"** (starts with `whsec_`)
7. **Add it to your backend `.env` file:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret_here
   ```
8. **Restart your backend server** to load the new environment variable

### 5. For Local Development

Use Stripe CLI to forward webhooks to your local server:

```bash
# Install Stripe CLI (if not installed)
# macOS: brew install stripe/stripe-cli/stripe
# Windows: Download from https://github.com/stripe/stripe-cli/releases
# Linux: See https://stripe.com/docs/stripe-cli

# Login to Stripe CLI
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

**Important:** The CLI will output a webhook secret like:
```
> Ready! Your webhook signing secret is whsec_... (^C to quit)
```

**Copy this secret** and add it to your local `.env` file:
```env
STRIPE_WEBHOOK_SECRET=whsec_...  # From Stripe CLI output
```

**Note:** This secret is different from the production webhook secret. Use the CLI secret for local development only.

## Testing

### Step-by-Step Test Process:

1. **Make a test payment** using test card `4242 4242 4242 4242`
2. **Check Stripe Dashboard:**
   - Go to Developers → Webhooks
   - Click on your webhook endpoint
   - Check "Recent events" tab
   - Look for `payment_intent.succeeded` event
   - Check if it shows "Succeeded" (green) or "Failed" (red)
3. **Check backend logs:**
   - Look for "Payment processed successfully and tickets created"
   - Check for any webhook errors
4. **Verify in database:**
   - Check `Payment` collection: `status` should be `"succeeded"` and `tickets_created` should be `true`
   - Check `Ticket` collection: New tickets should exist for the user
5. **Check payment status API:**
   ```bash
   GET /api/v1/payments/status/:payment_intent_id
   ```
   Should return `tickets_created: true`

## Common Issues & Solutions

### Issue: Webhook not receiving events

**Symptoms:**
- Payments stuck at "pending" status
- No webhook events in Stripe Dashboard

**Solutions:**
- ✅ **Check webhook URL is correct:** Must be `/api/v1/payments/webhook`
- ✅ **Verify URL is publicly accessible:** Use HTTPS in production (not HTTP)
- ✅ **For local dev:** Use Stripe CLI (`stripe listen --forward-to ...`)
- ✅ **Check webhook is enabled:** In Stripe Dashboard → Webhooks → Your endpoint should be "Enabled"
- ✅ **Check firewall/security:** Ensure your server allows incoming POST requests to webhook endpoint

### Issue: Webhook signature verification fails

**Symptoms:**
- Backend logs show "Webhook signature verification failed"
- 400 error in Stripe Dashboard webhook events

**Solutions:**
- ✅ **Verify `STRIPE_WEBHOOK_SECRET` matches** the signing secret from Stripe Dashboard
- ✅ **Check environment variable is loaded:** Restart server after adding to `.env`
- ✅ **For local dev:** Use the secret from Stripe CLI output (different from production)
- ✅ **Verify raw body:** Backend already handles this correctly in `app.js`

### Issue: Payment not found in database

**Symptoms:**
- Webhook receives event but logs show "Payment record not found"

**Solutions:**
- ✅ **Verify payment is saved:** Check `Payment` collection has record with matching `payment_intent_id`
- ✅ **Check payment_intent_id matches:** Compare Stripe Dashboard payment intent ID with database
- ✅ **Verify payment was created:** Check logs when creating payment intent

### Issue: Tickets not being created

**Symptoms:**
- Payment status is "succeeded" but `tickets_created` is still `false`
- No tickets in database

**Solutions:**
- ✅ **Check backend logs:** Look for errors in `handlePaymentSuccess` function
- ✅ **Verify competition is active:** Check competition status in database
- ✅ **Check ticket availability:** Ensure competition has available tickets
- ✅ **Check max_per_person limit:** User might have reached ticket limit
- ✅ **Verify webhook processing:** Check if webhook handler completed successfully

### Issue: Webhook returns 500 error

**Symptoms:**
- Stripe Dashboard shows webhook delivery failed with 500 error

**Solutions:**
- ✅ **Check backend logs:** Look for detailed error messages
- ✅ **Verify database connection:** Ensure MongoDB is connected
- ✅ **Check transaction support:** Some operations require MongoDB replica set
- ✅ **Verify all required data exists:** Competition, User, Cart items, etc.

## Quick Fix Checklist

### Backend (Already Done ✅)
- [x] Webhook endpoint exists at `/api/v1/payments/webhook`
- [x] Webhook handler processes `payment_intent.succeeded` events
- [x] Webhook signature verification is implemented
- [x] Ticket creation logic is implemented
- [x] Payment status update logic is implemented

### Configuration (You Need to Do ⚠️)
- [ ] **`STRIPE_WEBHOOK_SECRET` is set in backend `.env`** (get from Stripe Dashboard)
- [ ] **Webhook is configured in Stripe Dashboard** pointing to `/api/v1/payments/webhook`
- [ ] **Webhook URL is publicly accessible** (HTTPS in production)
- [ ] **For local dev:** Stripe CLI is running and forwarding webhooks
- [ ] **Backend server restarted** after adding `STRIPE_WEBHOOK_SECRET`

### Verification
- [ ] Test payment completes successfully
- [ ] Webhook events appear in Stripe Dashboard
- [ ] Payment status updates to "succeeded" in database
- [ ] Tickets are created in database
- [ ] User receives tickets after payment

## Summary

**The webhook is already implemented!** You just need to:
1. **Configure the webhook in Stripe Dashboard** pointing to `/api/v1/payments/webhook`
2. **Add the webhook signing secret** to your backend `.env` file
3. **Restart your backend server**

Once configured, payments will complete automatically and tickets will be created!

