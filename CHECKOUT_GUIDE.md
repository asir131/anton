# Stripe Card Checkout Implementation Guide

**For Frontend Developers - Next.js Implementation**

This comprehensive guide will help you implement the Stripe card checkout system in your Next.js application. The backend is fully configured and ready - you just need to integrate the frontend.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Payment Flow](#payment-flow)
3. [API Endpoints](#api-endpoints)
4. [Stripe Integration](#stripe-integration)
5. [Cart Management](#cart-management)
6. [Points Redemption](#points-redemption)
7. [Implementation Examples](#implementation-examples)
8. [Error Handling](#error-handling)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

### System Components

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│   Next.js App   │────────▶│   Backend API    │────────▶│   Stripe    │
│   (Frontend)    │         │   (Express.js)   │         │   (Payment) │
└─────────────────┘         └──────────────────┘         └─────────────┘
       │                              │
       │                              │
       │                              ▼
       │                      ┌──────────────┐
       │                      │   MongoDB    │
       │                      │  (Database)  │
       │                      └──────────────┘
       │
       └──────────────────────────────┘
              (WebSocket/Webhook)
```

### Payment Types

The system supports two payment flows:

1. **Single Purchase** - Buy tickets directly from a competition page
2. **Cart Checkout** - Buy multiple tickets from different competitions at once

### Key Concepts

- **Payment Intent**: Stripe's object representing a payment attempt
- **Client Secret**: Secure token used by Stripe.js to confirm payment
- **Webhook**: Backend automatically processes successful payments and creates tickets
- **Points System**: Users can redeem points for discounts (100 points = $1)

---

## Payment Flow

### Single Purchase Flow

```
1. User clicks "Buy Tickets" on competition page
   ↓
2. Frontend calls: POST /api/v1/payments/create-intent/single
   Body: { competition_id, quantity }
   ↓
3. Backend returns: { payment_intent_id, client_secret, amount }
   ↓
4. Frontend uses Stripe.js to confirm payment with client_secret
   ↓
5. Stripe processes payment
   ↓
6. Backend webhook receives payment_intent.succeeded event
   ↓
7. Backend creates tickets automatically
   ↓
8. Frontend polls: GET /api/v1/payments/status/:payment_intent_id
   ↓
9. When tickets_created = true, show success page
```

### Cart Checkout Flow

```
1. User clicks "Checkout" in cart
   ↓
2. Frontend calls: POST /api/v1/payments/create-intent/checkout
   Body: { points_to_redeem: 500 } (optional)
   ↓
3. Backend calculates total, applies discount, returns payment intent
   ↓
4. Frontend uses Stripe.js to confirm payment
   ↓
5. Backend webhook processes payment and creates tickets
   ↓
6. Frontend polls status until tickets_created = true
   ↓
7. Show success page with ticket details
```

---

## API Endpoints

### Base URL

```
Production: https://your-api-domain.com/api/v1
Development: http://localhost:5000/api/v1
```

### Authentication

All payment endpoints require authentication:

```javascript
headers: {
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
}
```

---

### 1. Create Payment Intent - Single Purchase

**Endpoint:** `POST /payments/create-intent/single`

**Purpose:** Create a payment intent for buying tickets from a single competition.

**Request:**
```json
{
  "competition_id": "b706d2c6-a5e8-4346-91cd-64964d69ac9b",
  "quantity": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "payment_intent_id": "pi_3ABC123def456",
    "client_secret": "pi_3ABC123def456_secret_xyz789",
    "amount": 4.95,
    "currency": "usd"
  }
}
```

**Fields:**
- `payment_intent_id` - Use this to check payment status
- `client_secret` - Use this with Stripe.js to confirm payment
- `amount` - Total amount in USD (ticket_price × quantity)
- `currency` - Always "usd"

**Error Responses:**
- `400` - Competition not active / Not enough tickets / Max tickets exceeded
- `404` - Competition not found

---

### 2. Create Payment Intent - Cart Checkout

**Endpoint:** `POST /payments/create-intent/checkout`

**Purpose:** Create a payment intent for checking out all items in the cart.

**Request:**
```json
{
  "points_to_redeem": 500
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "payment_intent_id": "pi_3ABC123def789",
    "client_secret": "pi_3ABC123def789_secret_xyz123",
    "amount": 24.50,
    "currency": "usd",
    "cart_total": 29.50,
    "discount_amount": 5.00,
    "points_redeemed": 500
  }
}
```

**Fields:**
- `payment_intent_id` - Stripe payment intent ID
- `client_secret` - Use with Stripe.js
- `amount` - Final amount after discount
- `cart_total` - Total before discount
- `discount_amount` - Discount applied
- `points_redeemed` - Points used for discount

**Points Redemption Rules:**
- Minimum: 100 points
- Conversion: 100 points = $1.00 discount
- Maximum discount = cart total

**Error Responses:**
- `400` - Cart empty / No active competitions / Insufficient points / Amount too low

---

### 3. Get Payment Status

**Endpoint:** `GET /payments/status/:payment_intent_id`

**Purpose:** Check if payment succeeded and tickets were created.

**Response (200):**
```json
{
  "success": true,
  "message": "Payment status retrieved successfully",
  "data": {
    "payment_intent_id": "pi_3ABC123def456",
    "status": "succeeded",
    "amount": 4.95,
    "currency": "usd",
    "tickets_created": true,
    "created_at": "2025-11-29T23:28:23.905Z",
    "updated_at": "2025-11-29T23:28:24.298Z"
  }
}
```

**Status Values:**
- `pending` - Payment intent created, awaiting payment
- `processing` - Payment being processed
- `succeeded` - Payment succeeded, tickets being created
- `completed` - Payment completed and tickets created
- `failed` - Payment failed
- `canceled` - Payment canceled
- `refunded` - Payment refunded

**Important:** Poll this endpoint until `tickets_created` is `true` before showing success.

---

## Stripe Integration

### Installation

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### Setup Stripe Provider

```typescript
// app/layout.tsx or pages/_app.tsx
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RootLayout({ children }) {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
}
```

### Environment Variables

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Cart Management

### Get Cart

**Endpoint:** `GET /user/cart`

**Response:**
```json
{
  "success": true,
  "data": {
    "cart_items": [
      {
        "_id": "cart-item-id",
        "competition_id": "comp-id",
        "competition_title": "BMW 3 Series",
        "ticket_price": 0.99,
        "quantity": 3,
        "total_price": 2.97,
        "max_per_person": 100,
        "existing_tickets": 5,
        "available_to_add": 95,
        "remaining_tickets": 500
      }
    ],
    "summary": {
      "total_items": 3,
      "total_price": 2.97,
      "item_count": 1
    }
  }
}
```

### Add to Cart

**Endpoint:** `POST /user/cart`

**Request:**
```json
{
  "competition_id": "comp-id",
  "quantity": 2
}
```

### Update Cart Item

**Endpoint:** `PUT /user/cart/:id`

**Request:**
```json
{
  "quantity": 5
}
```

### Remove from Cart

**Endpoint:** `DELETE /user/cart/:id`

### Clear Cart

**Endpoint:** `DELETE /user/cart/clear`

---

## Points Redemption

### Points System

- **Earning**: Users earn points when purchasing tickets
- **Redemption**: 100 points = $1.00 discount
- **Minimum**: 100 points required to redeem
- **Maximum**: Discount cannot exceed cart total

### Get User Points

**Endpoint:** `GET /user/profile` (includes `total_points`)

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "total_points": 1500,
      "total_earned": 2000,
      "total_redeemed": 500
    }
  }
}
```

### Points Calculation

```javascript
// Calculate discount from points
const discountAmount = Math.floor(pointsToRedeem / 100); // $1 per 100 points

// Calculate final amount
const finalAmount = Math.max(0, cartTotal - discountAmount);
```

---

## Implementation Examples

### Example 1: Single Purchase with Stripe Elements

```typescript
'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useRouter } from 'next/navigation';

interface SinglePurchaseProps {
  competitionId: string;
  quantity: number;
  ticketPrice: number;
}

export default function SinglePurchase({ competitionId, quantity, ticketPrice }: SinglePurchaseProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-intent/single`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          competition_id: competitionId,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      const { payment_intent_id, client_secret } = data.data;
      setPaymentIntentId(payment_intent_id);

      // Step 2: Confirm payment with Stripe
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?payment_intent_id=${payment_intent_id}`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Step 3: Poll for ticket creation
      await pollPaymentStatus(payment_intent_id);

      // Step 4: Redirect to success page
      router.push(`/payment/success?payment_intent_id=${payment_intent_id}`);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentIntentId: string) => {
    const maxAttempts = 30;
    const interval = 2000; // 2 seconds

    for (let i = 0; i < maxAttempts; i++) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/status/${paymentIntentId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );

      const data = await response.json();

      if (data.success && data.data.tickets_created) {
        return; // Tickets created successfully
      }

      if (data.data.status === 'failed') {
        throw new Error('Payment failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error('Timeout waiting for tickets to be created');
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Pay $${(ticketPrice * quantity).toFixed(2)}`}
      </button>
    </form>
  );
}
```

### Example 2: Cart Checkout with Points Redemption

```typescript
'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

interface CartCheckoutProps {
  pointsToRedeem: number;
  onSuccess: () => void;
}

export default function CartCheckout({ pointsToRedeem, onSuccess }: CartCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment intent with points redemption
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/create-intent/checkout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
          body: JSON.stringify({
            points_to_redeem: pointsToRedeem,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to create payment intent');
      }

      const { payment_intent_id, client_secret, amount, discount_amount } = data.data;

      // Step 2: Confirm payment
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: client_secret,
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Step 3: Poll for completion
      await pollPaymentStatus(payment_intent_id);

      // Step 4: Success
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentIntentId: string) => {
    // Same polling logic as Example 1
    // ... (see Example 1)
  };

  return (
    <div>
      <PaymentElement />
      {error && <div className="error">{error}</div>}
      <button onClick={handleCheckout} disabled={!stripe || loading}>
        {loading ? 'Processing...' : 'Complete Checkout'}
      </button>
    </div>
  );
}
```

### Example 3: Payment Status Polling Hook

```typescript
import { useState, useEffect } from 'react';

interface PaymentStatus {
  status: string;
  tickets_created: boolean;
  amount: number;
}

export function usePaymentStatus(paymentIntentId: string | null) {
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentIntentId) return;

    const pollStatus = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/payments/status/${paymentIntentId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }
        );

        const data = await response.json();

        if (data.success) {
          setStatus(data.data);
          if (data.data.tickets_created) {
            setLoading(false);
          }
        } else {
          setError(data.message);
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    pollStatus();
    const interval = setInterval(pollStatus, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [paymentIntentId]);

  return { status, loading, error };
}
```

### Example 4: Success Page

```typescript
'use client';

import { useSearchParams } from 'next/navigation';
import { usePaymentStatus } from '@/hooks/usePaymentStatus';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent_id');
  const { status, loading, error } = usePaymentStatus(paymentIntentId);
  const router = useRouter();

  useEffect(() => {
    if (status?.tickets_created) {
      // Redirect to tickets page after 3 seconds
      setTimeout(() => {
        router.push('/my-tickets');
      }, 3000);
    }
  }, [status, router]);

  if (loading) {
    return (
      <div>
        <h1>Processing your payment...</h1>
        <p>Please wait while we create your tickets.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Payment Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (status?.tickets_created) {
    return (
      <div>
        <h1>Payment Successful! 🎉</h1>
        <p>Your tickets have been created successfully.</p>
        <p>Amount: ${status.amount.toFixed(2)}</p>
        <p>Redirecting to your tickets...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Payment Status: {status?.status}</h1>
      <p>Waiting for tickets to be created...</p>
    </div>
  );
}
```

---

## Error Handling

### Common Errors

1. **Payment Failed**
   ```json
   {
     "success": false,
     "message": "Payment failed"
   }
   ```
   - Show user-friendly message
   - Allow retry
   - Don't create tickets

2. **Insufficient Tickets**
   ```json
   {
     "success": false,
     "message": "Not enough tickets available"
   }
   ```
   - Refresh competition data
   - Update UI to show available tickets

3. **Max Tickets Exceeded**
   ```json
   {
     "success": false,
     "message": "Maximum 100 tickets per person..."
   }
   ```
   - Show how many tickets user already has
   - Allow user to adjust quantity

4. **Insufficient Points**
   ```json
   {
     "success": false,
     "message": "Insufficient points. You have 50 points..."
   }
   ```
   - Show user's current points balance
   - Allow adjustment

### Error Handling Pattern

```typescript
try {
  const response = await fetch(url, options);
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.message || 'An error occurred');
  }

  return data.data;
} catch (error: any) {
  // Log error
  console.error('Payment error:', error);
  
  // Show user-friendly message
  setError(error.message || 'Payment failed. Please try again.');
  
  // Optionally report to error tracking service
  // reportError(error);
}
```

---

## Testing

### Test Cards (Stripe Test Mode)

Use these cards in test mode:

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, and any ZIP code.

### Testing Flow

1. **Test Single Purchase**
   - Add competition to cart or buy directly
   - Use test card `4242 4242 4242 4242`
   - Verify payment succeeds
   - Verify tickets are created
   - Check user's ticket list

2. **Test Cart Checkout**
   - Add multiple competitions to cart
   - Apply points redemption
   - Complete checkout
   - Verify all tickets created
   - Verify cart is cleared

3. **Test Error Cases**
   - Use declined card
   - Try to buy more than max tickets
   - Try to redeem more points than available

### Test Environment

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/v1
```

---

## Troubleshooting

### Issue: Payment succeeds but tickets not created

**Solution:**
- Check webhook is configured in Stripe dashboard
- Verify `STRIPE_WEBHOOK_SECRET` is set in backend
- Check backend logs for webhook errors
- Poll payment status - tickets may be created asynchronously

### Issue: "Payment intent not found"

**Solution:**
- Ensure you're using the correct `payment_intent_id`
- Check payment intent was created successfully
- Verify authentication token is valid

### Issue: "Cart is empty" error

**Solution:**
- Refresh cart before checkout
- Ensure items are added to cart
- Check cart items haven't expired

### Issue: Points redemption not working

**Solution:**
- Verify user has enough points
- Minimum redemption is 100 points
- Check points calculation: `discount = Math.floor(points / 100)`

### Issue: Stripe Elements not loading

**Solution:**
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set
- Check Stripe provider is wrapping your app
- Ensure you're using Stripe test keys in development

---

## Best Practices

1. **Always poll payment status** after confirming payment
2. **Show loading states** during payment processing
3. **Handle errors gracefully** with user-friendly messages
4. **Clear cart** after successful checkout
5. **Refresh data** after payment (tickets, points, etc.)
6. **Log errors** for debugging
7. **Test thoroughly** with Stripe test cards
8. **Handle edge cases** (network errors, timeouts, etc.)

---

## API Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/payments/create-intent/single` | POST | Create payment for single competition |
| `/payments/create-intent/checkout` | POST | Create payment for cart checkout |
| `/payments/status/:id` | GET | Check payment status |
| `/user/cart` | GET | Get cart items |
| `/user/cart` | POST | Add to cart |
| `/user/cart/:id` | PUT | Update cart item |
| `/user/cart/:id` | DELETE | Remove from cart |
| `/user/cart/clear` | DELETE | Clear entire cart |

---

## Support

If you encounter issues:

1. Check backend logs for errors
2. Verify API endpoints are accessible
3. Test with Stripe test cards
4. Check network requests in browser DevTools
5. Verify authentication tokens are valid

---

**Last Updated:** November 2025
**Backend Version:** 1.0.0
**Stripe API Version:** Latest

