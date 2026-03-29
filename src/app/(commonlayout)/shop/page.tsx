'use client';

import { Suspense } from 'react';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductFilters from '@/components/shop/ProductFilters';

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">All Products</h1>
          <p className="text-sm text-gray-500 mt-1">Browse our full range of medicines & health products</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Filters Sidebar */}
          <aside className="hidden md:block w-56 shrink-0">
            <ProductFilters />
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <Suspense fallback={<p className="text-gray-500">Loading products...</p>}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}