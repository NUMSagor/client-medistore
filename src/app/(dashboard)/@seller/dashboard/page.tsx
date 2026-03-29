'use client';

import { useEffect, useState } from 'react';
import { Package, ClipboardList, TrendingUp, DollarSign, Clock } from 'lucide-react';
import api from '@/lib/api';
import Link from 'next/link';

interface Order {
  id: string; status: string; createdAt: string;
  items: { price: number; quantity: number; medicine: { name: string } }[];
}

const statusColor: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700', PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

export default function SellerDashboardPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [orders, setOrders]       = useState<Order[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/seller/medicines'),
      api.get('/seller/orders'),
    ]).then(([medsRes, ordersRes]) => {
      setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
      setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === 'DELIVERED')
    .reduce((sum, o) => sum + (o.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0), 0);

  const pendingOrders = orders.filter((o) => ['PLACED', 'PROCESSING'].includes(o.status)).length;

  const statCards = [
    { label: 'My Medicines',    value: medicines.length,          icon: Package,       color: 'bg-indigo-50 text-indigo-600',  href: '/dashboard/medecine' },
    { label: 'Total Orders',    value: orders.length,             icon: ClipboardList, color: 'bg-pink-50 text-pink-600',      href: '/dashboard/orders' },
    { label: 'Pending Orders',  value: pendingOrders,             icon: Clock,         color: 'bg-yellow-50 text-yellow-600',  href: '/dashboard/orders' },
    { label: 'Revenue',         value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600', href: '/dashboard' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your medicines and orders</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href}
            className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              {loading
                ? <div className="h-6 w-12 bg-gray-100 rounded animate-pulse mt-1" />
                : <p className="text-2xl font-bold text-gray-900">{value}</p>
              }
            </div>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-xs font-semibold text-indigo-600 hover:text-pink-600">View all →</Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Order ID', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.slice(0, 6).map((order) => {
                  const total = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-3 text-gray-500">{order.items?.length ?? 0} item(s)</td>
                      <td className="px-6 py-3 font-semibold text-indigo-600">${total.toFixed(2)}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}