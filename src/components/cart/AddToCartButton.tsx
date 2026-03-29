'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/app/provider/CartProvider';
import { Product } from '@/types/products';

interface AddToCartButtonProps {
  product: Product;
  quantity?: number;
}

export default function AddToCartButton({
  product,
  quantity = 1,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleClick = () => {
    addToCart(product, quantity);
  };

  return (
    <Button
      disabled={product.stock === 0}
      onClick={handleClick}
      className='cursor-pointer'
    >
      Add to Cart
    </Button>
  );
}
