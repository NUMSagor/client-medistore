'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface OrderItem { price: number; quantity: number; medicine: { name: string } }
interface Order { id: string; status: string; createdAt: string; shippingAddress: string; items: OrderItem[] }

const statusColor: Record<string, string> = {
  PLACED: 'bg-blue-100 text-blue-700', PROCESSING: 'bg-yellow-100 text-yellow-700',
  SHIPPED: 'bg-indigo-100 text-indigo-700', DELIVERED: 'bg-green-100 text-green-700', CANCELLED: 'bg-red-100 text-red-700',
};

const nextStatus: Record<string, string> = {
  PLACED: 'PROCESSING', PROCESSING: 'SHIPPED', SHIPPED: 'DELIVERED',
};

export default function SellerOrdersPage() {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const load = () => {
    api.get('/seller/orders')
      .then((res) => setOrders(Array.isArray(res.data) ? res.data : []))
      .catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await api.patch(`/seller/orders/${id}`, { status });
      load();
    } catch {} finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and update your order statuses</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : orders.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Order ID', 'Items', 'Total', 'Address', 'Status', 'Date', 'Action'].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map((order) => {
                  const total = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
                  const next  = nextStatus[order.status];
                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-3 text-gray-500">{order.items?.length ?? 0} item(s)</td>
                      <td className="px-6 py-3 font-semibold text-indigo-600">${total.toFixed(2)}</td>
                      <td className="px-6 py-3 text-gray-500 max-w-37.5 truncate">{order.shippingAddress}</td>
                      <td className="px-6 py-3">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${statusColor[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-3">
                        {next && (
                          <button
                            onClick={() => updateStatus(order.id, next)}
                            disabled={updating === order.id}
                            className="text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {updating === order.id ? '...' : `Mark ${next}`}
                          </button>
                        )}
                      </td>
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