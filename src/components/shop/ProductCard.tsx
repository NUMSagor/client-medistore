'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCart } from '@/app/provider/CartProvider';
import { Product } from '@/types/products';


interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="border rounded-lg shadow-sm p-4 flex flex-col">
      {/* Product Image */}
      <div className="w-full h-48 relative mb-4">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-md text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
        <p className="font-bold text-indigo-600 text-lg mb-4">${product.price.toFixed(2)}</p>

        {/* Add to Cart Button */}
        <Button onClick={handleAddToCart} className="mt-auto w-full cursor-pointer">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
