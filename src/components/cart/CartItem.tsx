'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/app/provider/CartProvider';
import { CartItem as CartItemType } from '@/types/cart';

interface CartItemProps {
  item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
  const { removeFromCart } = useCart();

  return (
    <div className="flex gap-4 items-center border rounded-lg p-4">
      {/* Image */}
      <div className="relative w-20 h-20">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover rounded"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">
            No Image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-gray-500">
          ${item.price.toFixed(2)} × {item.quantity}
        </p>
      </div>

      {/* Total */}
      <p className="font-bold">
        ${(item.price * item.quantity).toFixed(2)}
      </p>

      {/* Remove */}
      <Button
        variant="destructive"
        size="sm"
        onClick={() => removeFromCart(item.id)}
      >
        Remove
      </Button>
    </div>
  );
}
