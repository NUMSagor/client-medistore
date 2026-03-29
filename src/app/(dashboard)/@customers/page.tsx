'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Package, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/app/provider/AuthProvider';

interface OrderItem { price: number; quantity: number; medicine: { name: string; imageUrl?: string } }
interface Order { id: string; status: string; createdAt: string; items: OrderItem[] }

const statusColor: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700', PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

const statusIcon: Record<string, React.ReactNode> = {
  PLACED: <Clock className="h-3.5 w-3.5" />,
  PROCESSING: <Package className="h-3.5 w-3.5" />,
  SHIPPED: <ShoppingCart className="h-3.5 w-3.5" />,
  DELIVERED: <CheckCircle className="h-3.5 w-3.5" />,
};

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  const delivered  = orders.filter((o) => o.status === 'DELIVERED').length;
  const pending    = orders.filter((o) => ['PLACED', 'PROCESSING', 'SHIPPED'].includes(o.status)).length;
  const totalSpent = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + (o.items?.reduce((t, i) => t + i.price * i.quantity, 0) ?? 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your orders</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Orders',   value: orders.length, icon: ShoppingCart, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Orders',  value: pending,        icon: Clock,        color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Total Spent',    value: `$${totalSpent.toFixed(2)}`, icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              {loading
                ? <div className="h-6 w-12 bg-gray-100 rounded animate-pulse mt-1" />
                : <p className="text-2xl font-bold text-gray-900">{value}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Orders list */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">My Orders</h2>
          <Link href="/shop" className="text-xs font-semibold text-indigo-600 hover:text-pink-600">Shop more →</Link>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <ShoppingCart className="h-10 w-10 text-gray-200" />
            <p className="text-gray-400 text-sm">No orders yet</p>
            <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">Browse medicines →</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => {
              const total = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
              return (
                <div key={order.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</span>
                      <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {statusIcon[order.status]} {order.status}
                      </span>
                    </div>
                    <span className="font-bold text-indigo-600">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {order.items?.map((item, i) => (
                      <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {item.medicine?.name} ×{item.quantity}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}