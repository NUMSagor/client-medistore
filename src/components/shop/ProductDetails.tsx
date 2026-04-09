// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Image from 'next/image';
// import api from '@/lib/api';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { useCart } from '@/app/provider/CartProvider';
// import AddToCartButton from '../cart/AddToCartButton';

// interface Medicine {
//   id: string;
//   name: string;
//   genericName: string;
//   manufacturer: string;
//   description?: string;
//   price: number;
//   discountPercent: number;
//   stock: number;
//   imageUrl?: string;
//   category: { name: string };
// }

// export default function ProductDetails({ id }: { id: string }) {
//   const router = useRouter();
//   const { addToCart } = useCart();

//   const [product, setProduct] = useState<Medicine | null>(null);
//   const [qty, setQty] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await api.get(`/seller/medicines/${id}`);
//         setProduct(res.data);
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to load product');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//   }, [id]);

//   if (loading) return <p>Loading product...</p>;
//   if (error) return <p className="text-red-600">{error}</p>;
//   if (!product) return null;

//   const finalPrice =
//     product.price - (product.price * product.discountPercent) / 100;

//   const handleAddToCart = () => {
//     addToCart({ ...product, quantity: qty });
//   };

//   const handleBuyNow = () => {
//     addToCart({ ...product, quantity: qty });
//     router.push('/checkout');
//   };

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-20 max-w-7xl items-center justify-center mx-auto">
//       {/* IMAGE */}
//       <div className="bg-white rounded-lg border p-4">
//         <Image
//           src={product.imageUrl || '/placeholder.png'}
//           alt={product.name}
//           width={500}
//           height={400}
//           className="w-full h-80 object-cover rounded-md"
//         />
//       </div>

//       {/* DETAILS */}
//       <div className="space-y-4">
//         <h1 className="text-2xl font-bold">{product.name}</h1>
//         <p className="text-sm text-gray-500">
//           Generic: {product.genericName}
//         </p>

//         <Badge variant="secondary">{product.category.name}</Badge>

//         <p className="text-sm text-gray-600">
//           Manufacturer: {product.manufacturer}
//         </p>

//         {/* PRICE */}
//         <div className="flex items-center gap-3">
//           {product.discountPercent > 0 && (
//             <span className="line-through text-gray-400">
//               ${product.price.toFixed(2)}
//             </span>
//           )}
//           <span className="text-2xl font-bold text-indigo-600">
//             ${finalPrice.toFixed(2)}
//           </span>
//           {product.discountPercent > 0 && (
//             <Badge variant="destructive">
//               -{product.discountPercent}%
//             </Badge>
//           )}
//         </div>

//         {/* STOCK */}
//         <p
//           className={`text-sm font-medium ${
//             product.stock > 0 ? 'text-green-600' : 'text-red-600'
//           }`}
//         >
//           {product.stock > 0
//             ? `In Stock (${product.stock})`
//             : 'Out of Stock'}
//         </p>

//         {/* QUANTITY */}
//         <div className="flex items-center gap-2">
//           <span className="text-sm">Quantity</span>
//           <Input
//             type="number"
//             min={1}
//             max={product.stock}
//             value={qty}
//             onChange={(e) => setQty(Number(e.target.value))}
//             className="w-20"
//           />
//         </div>


//         {/* ACTIONS */}
//         <div className="flex gap-4">
//           <AddToCartButton
//             product={product}
//             quantity={qty}
            
//           />

//           <Button
//             variant="outline"
//             disabled={product.stock === 0}
//             onClick={() => {
//               addToCart(product, qty);
//               router.push('/cart');
//             }}
//             className='cursor-pointer'
//           >
//             Buy Now
//           </Button>
//         </div>


//         {/* DESCRIPTION */}
//         <div className="pt-6">
//           <h3 className="font-semibold mb-2">Description</h3>
//           <p className="text-sm text-gray-600">
//             {product.description || 'No description available.'}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useCart } from '@/app/provider/CartProvider';
import AddToCartButton from '../cart/AddToCartButton';
import ReviewForm from '@/components/review/ReviewForm';
import ReviewList from '@/components/review/ReviewList';

interface Medicine {
  id: string;
  name: string;
  genericName: string;
  manufacturer: string;
  description?: string;
  price: number;
  discountPercent: number;
  stock: number;
  imageUrl?: string;
  category: { name: string };
}

export default function ProductDetails({ id }: { id: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Medicine | null>(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewRefresh, setReviewRefresh] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/seller/medicines/${id}`);
        setProduct(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading product...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!product) return null;

  const discount = product.discountPercent ?? 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">

      {/* ── Product Info ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        {/* IMAGE */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <Image
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            width={500}
            height={400}
            className="w-full h-80 object-cover rounded-md"
          />
        </div>

        {/* DETAILS */}
        <div className="space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-sm text-gray-500">Generic: {product.genericName}</p>

          <Badge variant="secondary">{product.category.name}</Badge>

          <p className="text-sm text-gray-600">Manufacturer: {product.manufacturer}</p>

          {/* PRICE */}
          <div className="flex items-center gap-3">
            {discount > 0 && (
              <span className="line-through text-gray-400">${product.price.toFixed(2)}</span>
            )}
            <span className="text-2xl font-bold text-indigo-600">${finalPrice.toFixed(2)}</span>
            {discount > 0 && (
              <Badge variant="destructive">-{discount}%</Badge>
            )}
          </div>

          {/* STOCK */}
          <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </p>

          {/* QUANTITY */}
          <div className="flex items-center gap-2">
            <span className="text-sm">Quantity</span>
            <Input
              type="number"
              min={1}
              max={product.stock}
              value={qty}
              onChange={(e) => setQty(Number(e.target.value))}
              className="w-20"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            <AddToCartButton product={product} quantity={qty} />
            <Button
              variant="outline"
              disabled={product.stock === 0}
              onClick={() => { addToCart(product, qty); router.push('/cart'); }}
              className="cursor-pointer"
            >
              Buy Now
            </Button>
          </div>

          {/* DESCRIPTION */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-semibold mb-2 text-gray-900">Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description || 'No description available.'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Reviews Section ───────────────────────────────────────────────── */}
      <div className="border-t border-gray-100 pt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Existing reviews */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Customer Reviews</h3>
            <ReviewList
              medicineId={id}
              refresh={reviewRefresh}
            />
          </div>

          {/* Write a review */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-4">Write a Review</h3>
            <ReviewForm
              medicineId={id}
              onReviewSubmitted={() => setReviewRefresh((r) => r + 1)}
            />
          </div>

        </div>
      </div>

    </div>
  );
}