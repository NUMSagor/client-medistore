// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '@/app/provider/AuthProvider';
// import { useCart } from '@/app/provider/CartProvider';
// import api from '@/lib/api';


// export default function CheckoutPage() {
//   const router = useRouter();
//   const { user, loading: authLoading } = useAuth();
//   const { cart, clearCart } = useCart();

//   const [placing, setPlacing] = useState(false);
//   const [shippingAddress, setShippingAddress] = useState({
//     fullName: '',
//     address: '',
//     phone: '',
//     city: '',
//     postalCode: '',
//     country: ''
//   });

//   // Auto-fill fullName from logged-in user
//   useEffect(() => {
//     if (user) {
//       setShippingAddress(prev => ({
//         ...prev,
//         fullName: user.name || ''
//       }));
//     }
//   }, [user]);

//   // Redirect to login if not authenticated
//   useEffect(() => {
//     if (!authLoading && !user) {
//       router.push('/login?redirect=/checkout');
//     }
//   }, [user, authLoading, router]);

//   if (authLoading || !user) {
//     return <p className="p-6">Checking authentication...</p>;
//   }

//   if (cart.length === 0) {
//     return <p className="p-6">Your cart is empty.</p>;
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShippingAddress(prev => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };


//   const handlePlaceOrder = async () => {
   
//     const emptyFields = Object.entries(shippingAddress).filter(([_, v]) => !v);
//     if (emptyFields.length > 0) {
//       alert('Please fill all shipping details.');
//       return;
//     }

//     setPlacing(true);

//     try {
      
//       const shippingAddressStr = 
//       `${shippingAddress.fullName}, 
//       ${shippingAddress.address}, 
//       ${shippingAddress.city}, 
//       ${shippingAddress.postalCode}, 
//       ${shippingAddress.country}, 
//       Phone: ${shippingAddress.phone}`;

    
//       const payload = {
//         // customerId: user.id || (user as any).userId, 
//         items: cart.map(item => ({
//           medicineId: item.id, 
//           quantity: item.quantity,
//           price: item.price
//         })),
//         shippingAddress: shippingAddressStr 
//       };

//       console.log('Placing order payload:', payload);

//       console.log("TOKEN:", localStorage.getItem("token"));

     
//       const res = await api.post('/orders', payload);

      
//       clearCart();
//       router.push(`/orders/${res.data.id}`);
      
//     } catch (err: any) {
//       console.error('Order error:', err.response?.data || err.message);
//       alert(err.response?.data?.message || err.message || 'Failed to place order.');
//     } finally {
//       setPlacing(false);
//     }
//   };




//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-6">
//       <h1 className="text-2xl font-bold">Checkout</h1>

//       {/* Shipping Details */}
//       <div className="border rounded-lg p-4 space-y-4">
//         <h2 className="font-semibold">Shipping Information</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <input
//             type="text"
//             name="fullName"
//             placeholder="Full Name"
//             value={shippingAddress.fullName}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//           <input
//             type="text"
//             name="address"
//             placeholder="Address"
//             value={shippingAddress.address}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//           <input 
//            type="text"
//             name="phone"
//             placeholder="Type your phone number"
//              value={shippingAddress.phone}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//           <input
//             type="text"
//             name="city"
//             placeholder="City"
//             value={shippingAddress.city}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//           <input
//             type="text"
//             name="postalCode"
//             placeholder="Postal Code"
//             value={shippingAddress.postalCode}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//           <input
//             type="text"
//             name="country"
//             placeholder="Country"
//             value={shippingAddress.country}
//             onChange={handleChange}
//             className="border rounded p-2 w-full"
//           />
//         </div>
//       </div>

//       {/* Order Summary */}
//       <div className="border rounded-lg p-4">
//         <h2 className="font-semibold mb-2">Order Summary</h2>
//         {cart.map(item => (
//           <div key={item.id} className="flex justify-between py-2">
//             <span>{item.name} × {item.quantity}</span>
//             <span>${(item.price * item.quantity).toFixed(2)}</span>
//           </div>
//         ))}
//         <div className="flex justify-between font-bold mt-2">
//           <span>Total</span>
//           <span>${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
//         </div>
//       </div>

//       {/* Place Order */}
//       <button
//         className={`bg-indigo-600 text-white px-6 py-3 rounded-md w-full ${placing ? 'opacity-70 cursor-not-allowed' : ''}`}
//         onClick={handlePlaceOrder}
//         disabled={placing}
//       >
//         {placing ? 'Placing Order...' : 'Place Order'}
//       </button>
//     </div>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/provider/AuthProvider';
import { useCart } from '@/app/provider/CartProvider';
import api from '@/lib/api';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, Truck, ShoppingBag, CheckCircle } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutContent() {
  const router              = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();
  const stripe              = useStripe();
  const elements            = useElements();

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'stripe'>('cod');
  const [placing, setPlacing]   = useState(false);
  const [error, setError]       = useState('');
  const [success, setSuccess]   = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '', address: '', phone: '', city: '', postalCode: '', country: '',
  });

  useEffect(() => {
    if (user) setShippingAddress(prev => ({ ...prev, fullName: user.name || '' }));
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/checkout');
  }, [user, authLoading, router]);

  if (authLoading || !user) return <p className="p-6">Checking authentication...</p>;
  if (cart.length === 0) return <p className="p-6 text-center text-gray-500">Your cart is empty.</p>;

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setShippingAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handlePlaceOrder = async () => {
    const empty = Object.entries(shippingAddress).filter(([_, v]) => !v.trim());
    if (empty.length > 0) { setError('Please fill all shipping details.'); return; }

    setPlacing(true); setError('');

    try {
      const shippingAddressStr = `${shippingAddress.fullName}, ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.postalCode}, ${shippingAddress.country}, Phone: ${shippingAddress.phone}`;

      // ── STRIPE ──────────────────────────────────────────────────────
      if (paymentMethod === 'stripe') {
        if (!stripe || !elements) return;

        const { data } = await api.post('/payment/create-payment-intent', { amount: total });

        const result = await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: elements.getElement(CardElement)! },
        });

        if (result.error) {
          setError(result.error.message || 'Payment failed');
          setPlacing(false); return;
        }
      }

      // ── PLACE ORDER ──────────────────────────────────────────────────
      const res = await api.post('/orders', {
        items: cart.map(i => ({ medicineId: i.id, quantity: i.quantity })),
        shippingAddress: shippingAddressStr,
        paymentMethod,
      });

      clearCart();
      setSuccess(true);
      setTimeout(() => router.push(`/orders/${res.data.id}`), 2000);

    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  // ── Success ──────────────────────────────────────────────────────────
  if (success) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
      <p className="text-sm text-gray-500">Redirecting to your order...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* LEFT — Shipping + Payment */}
        <div className="flex flex-col gap-6">

          {/* Shipping */}
          <div className="bg-white border-2 border-indigo-100 rounded-2xl shadow-lg shadow-indigo-50 overflow-hidden">
            <div className="absolute-top h-1.5 bg-linear-to-r from-indigo-600 to-pink-600 rounded-t-2xl" />
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Shipping Information</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'fullName',   placeholder: 'Full Name' },
                { name: 'phone',      placeholder: 'Phone Number' },
                { name: 'address',    placeholder: 'Address' },
                { name: 'city',       placeholder: 'City' },
                { name: 'postalCode', placeholder: 'Postal Code' },
                { name: 'country',    placeholder: 'Country' },
              ].map(({ name, placeholder }) => (
                <input key={name} type="text" name={name} placeholder={placeholder}
                  value={shippingAddress[name as keyof typeof shippingAddress]}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-500 w-full"
                />
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border-2 border-pink-100 rounded-2xl shadow-lg shadow-pink-50 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <button onClick={() => setPaymentMethod('cod')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'cod' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300'
                }`}>
                <Truck className={`h-6 w-6 ${paymentMethod === 'cod' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-semibold ${paymentMethod === 'cod' ? 'text-indigo-600' : 'text-gray-500'}`}>
                  Cash on Delivery
                </span>
              </button>
              <button onClick={() => setPaymentMethod('stripe')}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === 'stripe' ? 'border-pink-600 bg-pink-50' : 'border-gray-200 hover:border-pink-300'
                }`}>
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
                   hidePostalCode: true,
                  style: {
                    base: { fontSize: '14px', color: '#374151', '::placeholder': { color: '#9CA3AF' } },
                    invalid: { color: '#EF4444' },
                  },
                }} />
              </div>
            )}
          </div>
        </div>

        {/* RIGHT — Order Summary */}
        <div className="flex flex-col gap-4">
          <div className="bg-white border-2 border-emerald-100 rounded-2xl shadow-lg shadow-emerald-50 overflow-hidden sticky top-6">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-emerald-600" />
              <h2 className="font-semibold text-gray-900">Order Summary</h2>
            </div>
            <div className="p-6 flex flex-col gap-3">
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

            {error && <p className="px-6 pb-3 text-sm text-red-500 text-center">{error}</p>}

            <div className="px-6 pb-6">
              <button onClick={handlePlaceOrder} disabled={placing}
                className="w-full bg-linear-to-r from-indigo-600 to-pink-700 text-white font-bold py-4 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity text-sm">
                {placing ? 'Processing...' : paymentMethod === 'cod' ? '🚚 Place Order (COD)' : '💳 Pay & Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}