'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/provider/AuthProvider';
import { useCart } from '@/app/provider/CartProvider';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { cart, clearCart } = useCart();

  const [placing, setPlacing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    phone: '',
    city: '',
    postalCode: '',
    country: ''
  });

  // Auto-fill fullName from logged-in user
  useEffect(() => {
    if (user) {
      setShippingAddress(prev => ({
        ...prev,
        fullName: user.name || ''
      }));
    }
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return <p className="p-6">Checking authentication...</p>;
  }

  if (cart.length === 0) {
    return <p className="p-6">Your cart is empty.</p>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };


  const handlePlaceOrder = async () => {
   
    const emptyFields = Object.entries(shippingAddress).filter(([_, v]) => !v);
    if (emptyFields.length > 0) {
      alert('Please fill all shipping details.');
      return;
    }

    setPlacing(true);

    try {
      
      const shippingAddressStr = 
      `${shippingAddress.fullName}, 
      ${shippingAddress.address}, 
      ${shippingAddress.city}, 
      ${shippingAddress.postalCode}, 
      ${shippingAddress.country}, 
      Phone: ${shippingAddress.phone}`;

    
      const payload = {
        customerId: user.id, 
        items: cart.map(item => ({
          medicineId: item.id, 
          quantity: item.quantity
        })),
        shippingAddress: shippingAddressStr 
      };

      console.log('Placing order payload:', payload);

     
      const res = await api.post('/orders', payload);

      
      clearCart();
      router.push(`/orders/${res.data.id}`);
      
    } catch (err: any) {
      console.error('Order error:', err.response?.data || err.message);
      alert(err.response?.data?.message || err.message || 'Failed to place order.');
    } finally {
      setPlacing(false);
    }
  };




  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Checkout</h1>

      {/* Shipping Details */}
      <div className="border rounded-lg p-4 space-y-4">
        <h2 className="font-semibold">Shipping Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={shippingAddress.fullName}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingAddress.address}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input 
           type="text"
            name="phone"
            placeholder="Type your phone number"
             value={shippingAddress.phone}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingAddress.city}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingAddress.country}
            onChange={handleChange}
            className="border rounded p-2 w-full"
          />
        </div>
      </div>

      {/* Order Summary */}
      <div className="border rounded-lg p-4">
        <h2 className="font-semibold mb-2">Order Summary</h2>
        {cart.map(item => (
          <div key={item.id} className="flex justify-between py-2">
            <span>{item.name} × {item.quantity}</span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>${cart.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order */}
      <button
        className={`bg-indigo-600 text-white px-6 py-3 rounded-md w-full ${placing ? 'opacity-70 cursor-not-allowed' : ''}`}
        onClick={handlePlaceOrder}
        disabled={placing}
      >
        {placing ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}


