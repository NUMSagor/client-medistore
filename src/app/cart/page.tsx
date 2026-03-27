'use client';

import { useCart } from '@/app/provider/CartProvider';
import CartItem from '@/components/cart/CartItem';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { cart } = useCart();

  if (cart.length === 0) {
    return <p className="p-6">Your cart is empty</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      {cart.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
      <CartSummary />
    </div>
  );
}



// 'use client';

// import { useCart } from '@/app/provider/CartProvider';
// import CartItem from '@/components/cart/CartItem';
// import CartSummary from '@/components/cart/CartSummary';

// export default function CartPage() {
//   const { cart } = useCart();

//   if (cart.length === 0) {
//     return <p className="text-center mt-10">Your cart is empty</p>;
//   }

//   return (
//     <div className="container mx-auto p-6 grid md:grid-cols-3 gap-6">
//       <div className="md:col-span-2 space-y-4">
//         {cart.map((item) => (
//           <CartItem key={item.id} item={item} />
//         ))}
//       </div>

//       <CartSummary />
//     </div>
//   );
// }
