# Quick Start: Configure Stripe Webhook (5 Minutes)

## ✅ Good News!

Your backend webhook is **already implemented and ready**! You just need to configure it in Stripe Dashboard.

## Step-by-Step Configuration

### Step 1: Configure Webhook in Stripe Dashboard

1. **Go to Stripe Dashboard:**
   - Visit: https://dashboard.stripe.com/
   - Navigate to: **Developers** → **Webhooks**

2. **Add New Endpoint:**
   - Click **"Add endpoint"** button
   - **Endpoint URL:** Enter your backend URL + `/api/v1/payments/webhook`
     - Example: `https://your-backend-domain.com/api/v1/payments/webhook`
     - Example: `https://anton-backend.onrender.com/api/v1/payments/webhook`
   - **Important:** Use `/api/v1/payments/webhook` (exact path)

3. **Select Events:**
   - Click **"Select events"**
   - Check: `payment_intent.succeeded` ✅ (Required)
   - Optional but recommended:
     - `payment_intent.payment_failed`
     - `payment_intent.canceled`
   - Click **"Add events"**

4. **Save Endpoint:**
   - Click **"Add endpoint"** to save

5. **Copy Signing Secret:**
   - After creating the endpoint, you'll see a **"Signing secret"**
   - It starts with `whsec_`
   - Click **"Reveal"** and copy it

### Step 2: Add Webhook Secret to Backend

1. **Open your backend `.env` file**

2. **Add the webhook secret:**
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_copied_secret_here
   ```
   
   Replace `whsec_your_copied_secret_here` with the secret you copied from Stripe Dashboard.

3. **Save the `.env` file**

### Step 3: Restart Backend Server

- **Restart your backend server** to load the new environment variable
- The webhook will now work!

## For Local Development

If you're testing locally, use Stripe CLI:

```bash
# Install Stripe CLI (if not installed)
# Then run:
stripe listen --forward-to localhost:5000/api/v1/payments/webhook
```

The CLI will output a different webhook secret - use that one in your local `.env` file.

## Test It!

1. Make a test payment using card: `4242 4242 4242 4242`
2. Check Stripe Dashboard → Webhooks → Recent events
3. You should see `payment_intent.succeeded` event with green checkmark
4. Payment should complete and tickets should be created!

## Troubleshooting

### Webhook events show as "Failed"
- Check that `STRIPE_WEBHOOK_SECRET` in backend `.env` matches the secret from Stripe Dashboard
- Restart backend server after adding the secret

### No webhook events appear
- Verify the endpoint URL is correct: `/api/v1/payments/webhook`
- Check that your backend is publicly accessible (for production)
- For local dev, make sure Stripe CLI is running

### Payment still stuck at "pending"
- Check Stripe Dashboard → Webhooks → Recent events
- Look for any error messages
- Check backend logs for webhook processing errors

## That's It!

Once configured, payments will complete automatically and tickets will be created! 🎉

