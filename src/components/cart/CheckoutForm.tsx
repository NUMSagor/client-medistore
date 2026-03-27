'use client';
import { useCart } from '@/app/provider/CartProvider';
import { useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function CheckoutForm() {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await api.post('/orders', { items: cart });
      alert('Order placed successfully!');
      clearCart();
      // redirect to order confirmation page
    } catch (err: any) {
      alert(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-lg">Order Summary</h2>
      {cart.map((item) => (
        <div key={item.id} className="flex justify-between">
          <span>{item.name} x {item.quantity}</span>
          <span>${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <Button onClick={handlePlaceOrder} disabled={loading}>
        {loading ? 'Placing Order...' : 'Place Order'}
      </Button>
    </div>
  );
}
