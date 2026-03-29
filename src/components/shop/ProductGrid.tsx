
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/app/provider/CartProvider';
import { Product } from '@/types/products';




export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // endpoint backend
        const res = await api.get('/seller/medicines'); 
      
        const medicines = Array.isArray(res.data) ? res.data : [];
        setProducts(medicines);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Card key={product.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardDescription>{product.category?.name}</CardDescription>
            <CardTitle className='text-2xl'>{product.name}</CardTitle>
            <CardDescription className='text-sm'>{product.genericName}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-2">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
            ) : (
              <div className="w-full h-40 bg-gray-200 rounded-md flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <p className="font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>

            <div className="flex w-full justify-between mt-2">
              <Link href={`/shop/${product.id}`}>
                <Button size="sm" className='cursor-pointer'>Details</Button>
              </Link>
              <Button
                size="sm"
                variant="outline"
                onClick={() => addToCart(product)}
                className='cursor-pointer'
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}


// 'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import Link from 'next/link';
// import { ShoppingCart, PackageSearch } from 'lucide-react';
// import api from '@/lib/api';
// import { useCart } from '@/app/provider/CartProvider';
// import { Product } from '@/types/products';

// export default function ProductGrid() {
//   const searchParams = useSearchParams();
//   const { addToCart } = useCart();

//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   // Re-fetch whenever URL params change
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       setError('');
//       try {
//         const params: Record<string, string> = {};
//         const search   = searchParams.get('search');
//         const category = searchParams.get('category');
//         const minPrice = searchParams.get('minPrice');
//         const maxPrice = searchParams.get('maxPrice');
//         const sort     = searchParams.get('sort');

//         if (search)   params.search   = search;
//         if (category) params.category = category;
//         if (minPrice) params.minPrice = minPrice;
//         if (maxPrice) params.maxPrice = maxPrice;
//         if (sort)     params.sort     = sort;

//         const res = await api.get('/seller/medicines', { params });
//         setProducts(Array.isArray(res.data) ? res.data : []);
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to load products');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, [searchParams]);

//   // ── States ─────────────────────────────────────────────────────────────────
//   if (loading) return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//       {Array.from({ length: 8 }).map((_, i) => (
//         <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
//           <div className="h-44 bg-gray-100" />
//           <div className="p-4 space-y-2">
//             <div className="h-3 bg-gray-100 rounded w-1/3" />
//             <div className="h-4 bg-gray-100 rounded w-2/3" />
//             <div className="h-3 bg-gray-100 rounded w-1/2" />
//             <div className="h-8 bg-gray-100 rounded mt-3" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );

//   if (error) return (
//     <div className="flex flex-col items-center justify-center py-24 text-center">
//       <p className="text-red-500 font-medium">{error}</p>
//     </div>
//   );

//   if (products.length === 0) return (
//     <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
//       <PackageSearch className="h-12 w-12 text-gray-300" />
//       <p className="text-gray-500 font-medium">No products found</p>
//       <p className="text-gray-400 text-sm">Try adjusting your filters or search term</p>
//     </div>
//   );

//   // ── Grid ───────────────────────────────────────────────────────────────────
//   return (
//     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//       {products.map((product) => {
//         const discounted = product.discountPercent > 0;
//         const finalPrice = discounted
//           ? product.price - (product.price * product.discountPercent) / 100
//           : product.price;

//         return (
//           <div
//             key={product.id}
//             className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
//           >
//             {/* Image */}
//             <Link href={`/shop/${product.id}`} className="block relative h-44 bg-gray-50 overflow-hidden">
//               {product.imageUrl ? (
//                 <img
//                   src={product.imageUrl}
//                   alt={product.name}
//                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//                 />
//               ) : (
//                 <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl select-none">
//                   💊
//                 </div>
//               )}
//               {/* Discount badge */}
//               {discounted && (
//                 <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
//                   -{product.discountPercent}%
//                 </span>
//               )}
//               {/* Out of stock overlay */}
//               {product.stock === 0 && (
//                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
//                   <span className="text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded-full bg-white">
//                     Out of Stock
//                   </span>
//                 </div>
//               )}
//             </Link>

//             {/* Body */}
//             <div className="flex flex-col flex-1 p-4">
//               <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
//                 {product.category?.name}
//               </p>
//               <Link href={`/shop/${product.id}`}>
//                 <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 hover:text-indigo-600 transition-colors line-clamp-2">
//                   {product.name}
//                 </h3>
//               </Link>
//               <p className="text-xs text-gray-400 mb-3">{product.genericName}</p>

//               {/* Price */}
//               <div className="flex items-baseline gap-2 mb-4">
//                 <span className="text-lg font-bold text-indigo-600">${finalPrice.toFixed(2)}</span>
//                 {discounted && (
//                   <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
//                 )}
//               </div>

//               {/* Actions */}
//               <div className="mt-auto flex gap-2">
//                 <Link
//                   href={`/shop/${product.id}`}
//                   className="flex-1 text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-700 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
//                 >
//                   Details
//                 </Link>
//                 <button
//                   disabled={product.stock === 0}
//                   onClick={() => addToCart(product)}
//                   className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
//                   title="Add to cart"
//                 >
//                   <ShoppingCart className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }