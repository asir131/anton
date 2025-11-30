# Payment Webhook Troubleshooting Guide

## Problem
Payments are stuck at "pending" status and tickets are not being created, even though the payment was confirmed successfully on the frontend.

## Root Cause
The Stripe webhook is not processing the `payment_intent.succeeded` event, which means:
- The payment succeeded in Stripe
- But the backend hasn't created the tickets yet
- The payment status remains "pending" in your database

## Backend Checks Required

### 1. Verify Webhook Configuration in Stripe Dashboard

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Navigate to **Developers** → **Webhooks**
3. Check if a webhook endpoint is configured for your backend
4. The webhook should listen for: `payment_intent.succeeded`
5. The endpoint URL should be: `https://your-backend-domain.com/api/v1/webhooks/stripe` (or similar)

### 2. Check Webhook Endpoint Accessibility

The webhook endpoint must be:
- Publicly accessible (not behind localhost)
- Using HTTPS (Stripe requires HTTPS for webhooks)
- Returning 200 status code

**For Development:**
- Use [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks to localhost:
  ```bash
  stripe listen --forward-to localhost:5000/api/v1/webhooks/stripe
  ```

### 3. Verify Webhook Secret

Check your backend environment variables:
```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

This should match the webhook signing secret from Stripe Dashboard.

### 4. Check Backend Logs

Look for:
- Webhook events being received
- Errors in webhook processing
- Payment intent processing logs

### 5. Test Webhook Manually

You can test the webhook using Stripe CLI:
```bash
stripe trigger payment_intent.succeeded
```

## Frontend Workaround

The frontend now includes:
- Better error messages
- Status display
- Option to check entries page manually
- Timeout handling after 60 seconds

## Immediate Solution

If webhooks are not working, you have two options:

### Option 1: Fix Webhook (Recommended)
Follow the steps above to configure the webhook properly.

### Option 2: Manual Ticket Creation (Temporary)
If the payment succeeded in Stripe but tickets weren't created:
1. Check Stripe Dashboard to confirm payment succeeded
2. Manually create tickets in your admin panel
3. Or implement a manual retry endpoint in your backend

## Verification Steps

1. **Check Stripe Dashboard:**
   - Go to Payments in Stripe Dashboard
   - Find the payment intent (ID: `pi_...`)
   - Verify status is "Succeeded"

2. **Check Backend Database:**
   - Query the payments table
   - Check if `tickets_created` is `false`
   - Check if `status` is still "pending"

3. **Check Webhook Events:**
   - In Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Check "Recent events" tab
   - Look for `payment_intent.succeeded` events
   - Check if they were successful (green) or failed (red)

## Common Issues

### Issue 1: Webhook Not Configured
**Solution:** Add webhook endpoint in Stripe Dashboard

### Issue 2: Webhook Secret Mismatch
**Solution:** Update `STRIPE_WEBHOOK_SECRET` in backend to match Stripe Dashboard

### Issue 3: Webhook Endpoint Not Accessible
**Solution:** 
- For production: Ensure HTTPS is enabled
- For development: Use Stripe CLI to forward webhooks

### Issue 4: Backend Webhook Handler Not Processing
**Solution:** Check backend code that handles `payment_intent.succeeded` event

### Issue 5: Payment Requires 3D Secure
**Solution:** The payment might require additional authentication. Check if `paymentIntent.status` is `requires_action` after confirmation.

## Testing

After fixing the webhook:

1. Make a test payment using Stripe test card: `4242 4242 4242 4242`
2. Check Stripe Dashboard for webhook events
3. Verify tickets are created in your database
4. Check that payment status updates to "succeeded" and `tickets_created` becomes `true`

## Support

If issues persist:
1. Check Stripe Dashboard webhook logs for error details
2. Review backend logs for webhook processing errors
3. Verify the webhook handler code is correct
4. Test webhook manually using Stripe CLI

