import React, { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCardIcon, CheckCircleIcon, LockIcon, TrophyIcon } from 'lucide-react';
export function Checkout() {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [usePoints, setUsePoints] = useState(false);
  const cartItems = [{
    id: '1',
    title: 'Luxury Sports Car Giveaway',
    tickets: 2,
    price: 24.99
  }, {
    id: '2',
    title: 'Dream Vacation Package',
    tickets: 1,
    price: 14.99
  }];
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.tickets, 0);
  const pointsDiscount = usePoints ? 25 : 0;
  const total = subtotal - pointsDiscount;
  const handleComplete = () => {
    setStep(3);
  };
  return <div className="py-8">
      <div className="container-premium max-w-4xl">
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map(s => <Fragment key={s}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= s ? 'bg-accent' : 'bg-gradient-end'} transition-colors`}>
                  {step > s ? <CheckCircleIcon className="w-6 h-6" /> : <span>{s}</span>}
                </div>
                {s < 3 && <div className={`w-24 h-1 ${step > s ? 'bg-accent' : 'bg-gradient-end'} transition-colors`} />}
              </Fragment>)}
          </div>
        </motion.div>
        <AnimatePresence mode="wait">
          {/* Step 1: Order Review */}
          {step === 1 && <motion.div key="step1" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="space-y-6">
              <div className="card-premium p-6">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map(item => <div key={item.id} className="flex justify-between items-center p-4 bg-gradient-end rounded-xl">
                      <div>
                        <div className="font-semibold mb-1">{item.title}</div>
                        <div className="text-sm text-text-secondary">
                          {item.tickets}{' '}
                          {item.tickets === 1 ? 'ticket' : 'tickets'}
                        </div>
                      </div>
                      <div className="text-lg font-bold">
                        £{(item.price * item.tickets).toFixed(2)}
                      </div>
                    </div>)}
                </div>
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer p-4 bg-gradient-end rounded-xl">
                    <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} className="w-5 h-5 rounded border-gray-700 text-accent focus:ring-accent" />
                    <span className="ml-3">
                      Use 2,500 points (Save £{pointsDiscount.toFixed(2)})
                    </span>
                  </label>
                </div>
                <div className="space-y-2 p-4 bg-gradient-end rounded-xl mb-6">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Subtotal</span>
                    <span>£{subtotal.toFixed(2)}</span>
                  </div>
                  {usePoints && <div className="flex justify-between text-accent">
                      <span>Points Discount</span>
                      <span>-£{pointsDiscount.toFixed(2)}</span>
                    </div>}
                  <div className="flex justify-between text-xl font-bold pt-2 border-t border-gray-700">
                    <span>Total</span>
                    <span>£{total.toFixed(2)}</span>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="w-full btn-premium">
                  Continue to Payment
                </button>
              </div>
            </motion.div>}
          {/* Step 2: Payment */}
          {step === 2 && <motion.div key="step2" initial={{
          opacity: 0,
          x: 20
        }} animate={{
          opacity: 1,
          x: 0
        }} exit={{
          opacity: 0,
          x: -20
        }} className="space-y-6">
              <div className="card-premium p-6">
                <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
                <div className="space-y-4 mb-6">
                  {[{
                id: 'card',
                label: 'Credit / Debit Card',
                icon: CreditCardIcon
              }, {
                id: 'paypal',
                label: 'PayPal',
                icon: CreditCardIcon
              }, {
                id: 'apple',
                label: 'Apple Pay',
                icon: CreditCardIcon
              }].map(method => <label key={method.id} className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${paymentMethod === method.id ? 'bg-accent/20 border-2 border-accent' : 'bg-gradient-end border-2 border-transparent hover:bg-gray-800'}`}>
                      <input type="radio" name="payment" value={method.id} checked={paymentMethod === method.id} onChange={e => setPaymentMethod(e.target.value)} className="w-5 h-5" />
                      <method.icon className="w-6 h-6 mx-3" />
                      <span className="font-medium">{method.label}</span>
                    </label>)}
                </div>
                {paymentMethod === 'card' && <motion.div initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }} className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Card Number
                      </label>
                      <input type="text" placeholder="1234 5678 9012 3456" className="w-full px-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          CVV
                        </label>
                        <input type="text" placeholder="123" className="w-full px-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Cardholder Name
                      </label>
                      <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
                    </div>
                  </motion.div>}
                <div className="flex items-center justify-center text-sm text-text-secondary mb-6">
                  <LockIcon className="w-4 h-4 mr-2" />
                  Your payment information is secure and encrypted
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl bg-gradient-end hover:bg-gray-700 transition-colors">
                    Back
                  </button>
                  <button onClick={handleComplete} className="flex-1 btn-premium">
                    Complete Purchase
                  </button>
                </div>
              </div>
            </motion.div>}
          {/* Step 3: Confirmation */}
          {step === 3 && <motion.div key="step3" initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} className="card-premium p-8 text-center">
              <motion.div initial={{
            scale: 0
          }} animate={{
            scale: 1
          }} transition={{
            delay: 0.2,
            type: 'spring'
          }} className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6">
                <TrophyIcon className="w-12 h-12 text-accent" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4">Purchase Complete!</h2>
              <p className="text-text-secondary mb-8">
                Thank you for your purchase. Your tickets have been confirmed
                and you'll receive a confirmation email shortly.
              </p>
              <div className="card-premium p-6 bg-gradient-start mb-8 text-left">
                <h3 className="font-semibold mb-4">Order Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Order Number</span>
                    <span className="font-medium">#ORD-2024-001</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Total Tickets</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Amount Paid</span>
                    <span className="font-medium">£{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button onClick={() => window.location.href = '/entries'} className="flex-1 btn-premium">
                  View My Entries
                </button>
                <button onClick={() => window.location.href = '/competitions'} className="flex-1 py-3 rounded-xl bg-gradient-end hover:bg-gray-700 transition-colors">
                  Browse More
                </button>
              </div>
            </motion.div>}
        </AnimatePresence>
      </div>
    </div>;
}