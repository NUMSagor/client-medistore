'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/app/provider/CartProvider';
import { useRouter } from 'next/navigation';

export default function CartSummary() {
  const { cart } = useCart();
  const router = useRouter();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between">
        <span>Items</span>
        <span>{totalItems}</span>
      </div>

      <div className="flex justify-between font-bold">
        <span>Total</span>
        <span>${totalPrice.toFixed(2)}</span>
      </div>

      <Button className="w-full" onClick={() => router.push('/checkout')}>
        Proceed to Checkout
      </Button>
    </div>
  );
}
