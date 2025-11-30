# Stripe Checkout Setup Guide

This guide will help you complete the Stripe checkout implementation.

## Step 1: Install Dependencies

Run the following command to install Stripe packages:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

If you encounter PowerShell execution policy errors on Windows, you can:
- Run PowerShell as Administrator and execute: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
- Or use `npx` directly: `npx npm install @stripe/stripe-js @stripe/react-stripe-js`

## Step 2: Configure Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

Replace `pk_test_...` with your actual Stripe publishable key from the Stripe Dashboard.

## Step 3: Implementation Summary

The following has been implemented:

### ✅ Completed

1. **Stripe Elements Provider** - Added to `App.tsx` to wrap the entire application
2. **Payment API Endpoints** - Added to `cartApi.ts`:
   - `createCheckoutIntent` - For cart checkout
   - `createSinglePurchaseIntent` - For single competition purchase
   - `getPaymentStatus` - To check payment status
   - `clearCart` - To clear cart after successful payment

3. **Payment Status Hook** - Created `usePaymentStatus.ts` for polling payment status

4. **Checkout Page** - Updated `Checkout.tsx` to:
   - Use real cart data from API
   - Integrate Stripe Elements
   - Handle points redemption
   - Poll for ticket creation after payment

5. **Payment Success Page** - Created `PaymentSuccess.tsx` to:
   - Display payment confirmation
   - Poll for ticket creation
   - Redirect to entries page

6. **Single Purchase Modal** - Created `SinglePurchaseModal.tsx` for:
   - Direct purchase from competition page
   - Stripe payment integration
   - Payment status polling

7. **Competition Details** - Updated to support single purchase flow

## Step 4: Testing

### Test Cards (Stripe Test Mode)

Use these cards in test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

### Testing Flow

1. **Test Single Purchase**
   - Go to a competition page
   - Answer the question
   - Click "Buy Now"
   - Use test card `4242 4242 4242 4242`
   - Verify payment succeeds and tickets are created

2. **Test Cart Checkout**
   - Add multiple competitions to cart
   - Go to checkout
   - Apply points redemption (if available)
   - Complete checkout with test card
   - Verify all tickets created and cart is cleared

## API Endpoints Used

- `POST /api/v1/payments/create-intent/single` - Single purchase
- `POST /api/v1/payments/create-intent/checkout` - Cart checkout
- `GET /api/v1/payments/status/:payment_intent_id` - Payment status
- `GET /api/v1/user/cart` - Get cart
- `DELETE /api/v1/user/cart/clear` - Clear cart

## Notes

- The implementation follows the CHECKOUT_GUIDE.md specifications
- All payments are processed through Stripe Elements for security
- Payment status is polled every 2 seconds until tickets are created
- Cart is automatically cleared after successful payment
- Points redemption: 100 points = $1.00 discount

## Troubleshooting

### Stripe Elements not loading
- Verify `VITE_STRIPE_PUBLISHABLE_KEY` is set in `.env`
- Check that Stripe provider is wrapping your app (it's in `App.tsx`)

### Payment succeeds but tickets not created
- Check webhook is configured in Stripe dashboard
- Verify backend webhook secret is set
- Check backend logs for webhook errors
- Payment status polling will continue until tickets are created

### TypeScript errors
- Run `npm install` to install Stripe packages
- Restart your TypeScript server/IDE
- The `vite-env.d.ts` file provides type definitions for `import.meta.env`

