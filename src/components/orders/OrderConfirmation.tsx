'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Package, MapPin, ShoppingCart,
  ArrowRight, Clock, Truck, BadgeCheck,
} from 'lucide-react';
import api from '@/lib/api';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderItem {
  price: number;
  quantity: number;
  medicine: { name: string; imageUrl?: string };
}

interface Order {
  id: string;
  status: string;
  createdAt: string;
  shippingAddress?: string;
  items: OrderItem[];
}

const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderConfirmation({ orderId }: { orderId: string }) {
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading your order...</p>
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
      <p className="text-red-500 font-medium">{error || 'Order not found'}</p>
      <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">
        Back to Shop →
      </Link>
    </div>
  );

  const total      = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
  const stepIndex  = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">

        {/* Success banner */}
        <div className="bg-linear-to-r from-indigo-600 to-pink-700 rounded-2xl p-8 text-white text-center mb-6">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Order Placed Successfully!</h1>
          <p className="text-white/80 text-sm">Thank you for your purchase. We'll process it shortly.</p>
          <p className="font-mono text-xs text-white/60 mt-3">{order.id}</p>
        </div>

        {/* Order card */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <p className="text-xs text-gray-400 mb-1">Placed on</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="p-6 space-y-6">

            {/* Progress tracker */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Progress</p>
              <div className="flex items-center">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
                        i <= stepIndex
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-200 text-gray-400'
                      }`}>
                        {i < stepIndex
                          ? <CheckCircle className="h-4 w-4" />
                          : i === 0 ? <ShoppingCart className="h-4 w-4" />
                          : i === 1 ? <Package className="h-4 w-4" />
                          : i === 2 ? <Truck className="h-4 w-4" />
                          : <BadgeCheck className="h-4 w-4" />
                        }
                      </div>
                      <span className="text-[10px] mt-1.5 text-gray-500 font-medium whitespace-nowrap">{step}</span>
                    </div>
                    {i < statusSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < stepIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <ShoppingCart className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Total Amount</p>
                </div>
                <p className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-1">
                  <Package className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Items Ordered</p>
                </div>
                <p className="text-lg font-bold text-gray-900">{order.items?.length}</p>
              </div>
              {order.shippingAddress && (
                <div className="col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" />
                    <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 leading-relaxed">{order.shippingAddress}</p>
                </div>
              )}
            </div>

            {/* Items list */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items</p>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <div className="divide-y divide-gray-50">
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.medicine?.imageUrl ? (
                          <img src={item.medicine.imageUrl} alt={item.medicine.name}
                            className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                            <Package className="h-5 w-5 text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.medicine?.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-700">Total</p>
                  <p className="text-sm font-bold text-indigo-600">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Link href="/dashboard"
            className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            View My Orders
          </Link>
          <Link href="/shop"
            className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}