'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Clock, CheckCircle } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';
import { useAuth } from '@/app/provider/AuthProvider';
import OrderList from '@/components/orders/OrderList';
import { Order } from '@/components/orders/OrderDetails';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending    = orders.filter((o) => ['PLACED', 'PROCESSING', 'SHIPPED'].includes(o.status)).length;
  const totalSpent = orders
    // .filter((o) => o.status === 'DELIVERED')
    .reduce((s, o) => s + (o.items?.reduce((t, i) => t + i.price * i.quantity, 0) ?? 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name} 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Here's an overview of your orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[
          { label: 'Total Orders',  value: orders.length,               icon: ShoppingCart, color: 'bg-indigo-50 text-indigo-600' },
          { label: 'Active Orders', value: pending,                     icon: Clock,        color: 'bg-yellow-50 text-yellow-600' },
          { label: 'Total Spent',   value: `$${totalSpent.toFixed(2)}`, icon: CheckCircle,  color: 'bg-emerald-50 text-emerald-600' },
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

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">My Orders</h2>
          <Link href="/shop" className="text-xs font-semibold text-indigo-600 hover:text-pink-600">
            Shop more →
          </Link>
        </div>
        <OrderList orders={orders} loading={loading} />
      </div>
    </div>
  );
}