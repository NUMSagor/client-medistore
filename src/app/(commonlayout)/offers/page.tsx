'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, PackageSearch, Timer, Tag, Zap } from 'lucide-react';
import api from '@/lib/api';
import { useCart } from '@/app/provider/CartProvider';
import { Product } from '@/types/products';

interface Category {
  id: string;
  name: string;
}

// ─── Countdown Timer Hook ─────────────────────────────────────────────────────
function useCountdown(hoursFromNow: number) {
  const end = Date.now() + hoursFromNow * 60 * 60 * 1000;
  const [timeLeft, setTimeLeft] = useState({ h: '00', m: '00', s: '00' });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({
        h: String(h).padStart(2, '0'),
        m: String(m).padStart(2, '0'),
        s: String(s).padStart(2, '0'),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function OfferCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const discount = product.discountPercent ?? 0;
  const finalPrice = product.price - (product.price * discount) / 100;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Image */}
      <Link href={`/shop/${product.id}`} className="block relative h-44 bg-gray-50 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl select-none">💊</div>
        )}
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -{discount}%
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-xs font-bold text-gray-500 border border-gray-300 px-3 py-1 rounded-full bg-white">
              Out of Stock
            </span>
          </div>
        )}
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs text-indigo-500 font-semibold uppercase tracking-wide mb-1">
          {product.category?.name}
        </p>
        <Link href={`/shop/${product.id}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-0.5 hover:text-indigo-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-gray-400 mb-3">{product.genericName}</p>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-indigo-600">${finalPrice.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className="mt-auto flex gap-2">
          <Link
            href={`/shop/${product.id}`}
            className="flex-1 text-center text-sm font-semibold bg-gradient-to-r from-indigo-600 to-pink-700 text-white py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Details
          </Link>
          <button
            disabled={product.stock === 0}
            onClick={() => addToCart(product)}
            className="flex items-center justify-center w-10 h-10 border border-gray-200 rounded-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to cart"
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
          <div className="h-44 bg-gray-100" />
          <div className="p-4 space-y-2">
            <div className="h-3 bg-gray-100 rounded w-1/3" />
            <div className="h-4 bg-gray-100 rounded w-2/3" />
            <div className="h-3 bg-gray-100 rounded w-1/2" />
            <div className="h-8 bg-gray-100 rounded mt-3" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function OffersPage() {
  const [allDiscounted, setAllDiscounted] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<Record<string, Product[]>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const countdown = useCountdown(6); // flash sale ends in 6 hours

  // Fetch categories + all discounted medicines
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/seller/medicines'),
        ]);

        const cats: Category[] = Array.isArray(catRes.data) ? catRes.data : [];
        const allProducts: Product[] = Array.isArray(prodRes.data) ? prodRes.data : [];

        // Only products with a discount
        const discounted = allProducts.filter((p) => (p.discountPercent ?? 0) > 0);
        setAllDiscounted(discounted);
        setCategories(cats);

        // Group discounted products by category
        const grouped: Record<string, Product[]> = {};
        for (const cat of cats) {
          const inCat = discounted.filter((p) => p.category?.name === cat.name);
          if (inCat.length > 0) grouped[cat.id] = inCat;
        }
        setCategoryProducts(grouped);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load offers');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const displayedProducts =
    selectedCategory === 'all'
      ? allDiscounted
      : (categoryProducts[selectedCategory] ?? []);

  const categoriesWithOffers = categories.filter((c) => categoryProducts[c.id]?.length > 0);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Offers & Deals</h1>
          <p className="text-sm text-gray-500 mt-1">Genuine medicines at discounted prices</p>
        </div>

        {/* ── Flash Sale Banner ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-pink-700 text-white px-8 py-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full bg-white/5 pointer-events-none" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase opacity-80">Flash Sale</p>
              <p className="text-lg font-bold">Up to 50% off — today only!</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="relative z-10 flex items-center gap-2">
            <Timer className="h-4 w-4 opacity-70" />
            <span className="text-xs opacity-70 mr-1">Ends in</span>
            {[countdown.h, countdown.m, countdown.s].map((val, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="bg-white/20 text-white font-bold text-lg px-3 py-1 rounded-lg min-w-[44px] text-center">
                  {val}
                </span>
                {i < 2 && <span className="font-bold opacity-60">:</span>}
              </span>
            ))}
          </div>
        </div>

        {/* ── Category Filter Pills ──────────────────────────────────────── */}
        {!loading && categoriesWithOffers.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                ${selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-indigo-600 to-pink-700 text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                }`}
            >
              <Tag className="h-3.5 w-3.5" />
              All Offers
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                {allDiscounted.length}
              </span>
            </button>

            {categoriesWithOffers.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200
                  ${selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-pink-700 text-white border-transparent shadow-sm'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600'
                  }`}
              >
                {cat.name}
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold
                  ${selectedCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {categoryProducts[cat.id]?.length}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* ── Product Grid ──────────────────────────────────────────────── */}
        {loading ? (
          <SkeletonGrid />
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-red-500 font-medium">{error}</p>
          </div>
        ) : displayedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
            <PackageSearch className="h-12 w-12 text-gray-300" />
            <p className="text-gray-500 font-medium">No offers available right now</p>
            <p className="text-gray-400 text-sm">Check back soon for new deals</p>
            <Link
              href="/shop"
              className="mt-2 text-sm font-semibold text-indigo-600 hover:text-pink-600 transition-colors"
            >
              Browse all products →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {displayedProducts.map((product) => (
              <OfferCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}