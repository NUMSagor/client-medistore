
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
