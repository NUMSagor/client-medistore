'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import api from '@/lib/api';

interface OrderItem { price: number; quantity: number; medicine: { name: string } }
interface Order {
  id: string;
  status: string;
  createdAt: string;
  shippingAddress: string;
  customer: { name: string; email: string };
  items: OrderItem[];
}

const statusColor: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    api.get('/orders/admin/all')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setOrders(data); setFiltered(data);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = orders;
    if (search) data = data.filter((o) => o.customer?.name.toLowerCase().includes(search.toLowerCase()) || o.id.includes(search));
    if (statusFilter) data = data.filter((o) => o.status === statusFilter);
    setFiltered(data);
  }, [search, statusFilter, orders]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
        <p className="text-sm text-gray-500 mt-1">View and monitor all customer orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Search customer or order ID..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-500 w-64" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white">
          <option value="">All Statuses</option>
          {['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((order) => {
                  const total = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-3">
                        <p className="font-medium text-gray-900">{order.customer?.name}</p>
                        <p className="text-xs text-gray-400">{order.customer?.email}</p>
                      </td>
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
            {filtered.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No orders found</div>}
          </div>
        )}
      </div>
    </div>
  );
}