// 'use client';

// import { Button } from '@/components/ui/button';
// import { useCart } from '@/app/provider/CartProvider';
// import { Product } from '@/types/products';

// interface AddToCartButtonProps {
//   product: Product;
//   quantity?: number;
//   fullWidth?: boolean;
// }

// export default function AddToCartButton({
//   product,
//   quantity = 1,
//   fullWidth = false,
// }: AddToCartButtonProps) {
//   const { addToCart } = useCart();

//   return (
//     <Button
//       onClick={() => addToCart(product, quantity)}
//       className={fullWidth ? 'w-full' : ''}
//     >
//       Add to Cart
//     </Button>
//   );
// }


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
