// 'use client';
// import { useCart } from '@/app/provider/CartProvider';
// import { useState } from 'react';
// import api from '@/lib/api';
// import { Button } from '@/components/ui/button';

// export default function CheckoutForm() {
//   const { cart, clearCart } = useCart();
//   const [loading, setLoading] = useState(false);

//   const handlePlaceOrder = async () => {
//     setLoading(true);
//     try {
//       const res = await api.post('/orders', { items: cart });
//       alert('Order placed successfully!');
//       clearCart();
//       // redirect to order confirmation page
//     } catch (err: any) {
//       alert(err.response?.data?.message || 'Order failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="font-semibold text-lg">Order Summary</h2>
//       {cart.map((item) => (
//         <div key={item.id} className="flex justify-between">
//           <span>{item.name} x {item.quantity}</span>
//           <span>${(item.price * item.quantity).toFixed(2)}</span>
//         </div>
//       ))}
//       <Button onClick={handlePlaceOrder} disabled={loading}>
//         {loading ? 'Placing Order...' : 'Place Order'}
//       </Button>
//     </div>
//   );
// }




'use client';

import { useState } from 'react';
import { useCart } from '@/app/provider/CartProvider';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Truck, ShoppingBag, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// ── Inner form (needs Elements context) ──────────────────────────────────
function InnerCheckoutForm() {
  const { cart, clearCart } = useCart();
  const router              = useRouter();
  const stripe              = useStripe();
  const elements            = useElements();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      setError('Shipping address is required'); return;
    }
    if (cart.length === 0) {
      setError('Your cart is empty'); return;
    }

    setLoading(true); setError('');

    try {
      // ── STRIPE PAYMENT ──────────────────────────────────────────────
      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) return;

        // 1. Create payment intent
        const { data } = await api.post('/payment/create-payment-intent', { amount: total });

        // 2. Confirm card payment
        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

        if (result.error) {
          setError(result.error.message || 'Payment failed');
          setLoading(false); return;
        }
      }

      // ── PLACE ORDER (both COD and Stripe) ───────────────────────────
      await api.post('/orders', {
        items: cart.map((i) => ({ medicineId: i.id, quantity: i.quantity })),
        shippingAddress,
        paymentMethod,
      });

      setSuccess(true);
      clearCart();
      setTimeout(() => router.push('/dashboard'), 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────
  if (success) return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">

      {/* Order Summary */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-indigo-600" />
          <h2 className="font-semibold text-gray-900">Order Summary</h2>
        </div>
        <div className="px-6 py-4 flex flex-col gap-3">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">{item.name} <span className="text-gray-400">×{item.quantity}</span></span>
              <span className="font-semibold text-indigo-600">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-gray-900">
            <span>Total</span>
            <span className="text-indigo-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
        <textarea
          rows={3}
          placeholder="Enter your full shipping address..."
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500 resize-none"
        />
      </div>

      {/* Payment Method */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Method</h3>
        <div className="grid grid-cols-2 gap-3 mb-5">

          {/* COD */}
          <button
            onClick={() => setPaymentMethod('cod')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'cod'
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-300'
            }`}
          >
            <Truck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-indigo-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-semibold ${paymentMethod === 'cod' ? 'text-indigo-600' : 'text-gray-500'}`}>
              Cash on Delivery
            </span>
          </button>

          {/* Stripe */}
          <button
            onClick={() => setPaymentMethod('stripe')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
              paymentMethod === 'stripe'
                ? 'border-pink-600 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <CreditCard className={`h-6 w-6 ${paymentMethod === 'stripe' ? 'text-pink-600' : 'text-gray-400'}`} />
            <span className={`text-sm font-semibold ${paymentMethod === 'stripe' ? 'text-pink-600' : 'text-gray-500'}`}>
              Credit / Debit Card
            </span>
          </button>
        </div>

        {/* Stripe Card Input */}
        {paymentMethod === 'stripe' && (
          <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50">
            <CardElement options={{
              style: {
                base: { fontSize: '14px', color: '#374151', '::placeholder': { color: '#9CA3AF' } },
                invalid: { color: '#EF4444' },
              },
            }} />
          </div>
        )}
      </div>

      {/* Error */}
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || cart.length === 0}
        className="w-full bg-linear-to-r from-indigo-600 to-pink-700 text-white font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity text-sm"
      >
        {loading ? 'Processing...' : paymentMethod === 'cod' ? '🚚 Place Order (COD)' : '💳 Pay & Place Order'}
      </button>

    </div>
  );
}

// ── Wrapper with Stripe Elements ─────────────────────────────────────────
export default function CheckoutForm() {
  return (
    <Elements stripe={stripePromise}>
      <InnerCheckoutForm />
    </Elements>
  );
}