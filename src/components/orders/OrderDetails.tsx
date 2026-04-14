// 'use client';

// import { useEffect, useState } from 'react';
// import { Calendar, MapPin, ShoppingCart, CheckCircle, Package, ArrowLeft } from 'lucide-react';
// import OrderStatusBadge from './OrderStatusBadge';
// import api from '@/lib/api';

// interface OrderItem {
//   price: number;
//   quantity: number;
//   medicine: { name: string; imageUrl?: string };
// }

// export interface Order {
//   id: string;
//   status: string;
//   createdAt: string;
//   address?: string;
//   items: OrderItem[];
// }

// const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

// export default function OrderDetails({
//   orderId,
//   onBack,
// }: {
//   orderId: string;
//   onBack: () => void;
// }) {
//   const [order, setOrder]   = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]   = useState('');

//   useEffect(() => {
//     api.get(`/orders/${orderId}`)
//       .then((res) => setOrder(res.data))
//       .catch(() => setError('Failed to load order details'))
//       .finally(() => setLoading(false));
//   }, [orderId]);

//   if (loading) return (
//     <div className="space-y-3 p-4">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
//       ))}
//     </div>
//   );

//   if (error || !order) return (
//     <div className="p-6 text-center text-sm text-red-500">{error || 'Order not found'}</div>
//   );

//   const total     = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
//   const stepIndex = statusSteps.indexOf(order.status);

//   return (
//     <div className="max-w-2xl">
//       {/* Back button */}
//       <button onClick={onBack}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
//         <ArrowLeft className="h-4 w-4" /> Back to Orders
//       </button>

//       <div className="mb-5">
//         <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
//         <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

//         {/* Header */}
//         <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//           <div>
//             <p className="text-xs text-gray-400 font-medium mb-1">Placed on</p>
//             <p className="text-sm font-semibold text-gray-900">
//               {new Date(order.createdAt).toLocaleDateString('en-US', {
//                 year: 'numeric', month: 'short', day: 'numeric',
//               })}
//             </p>
//           </div>
//           <OrderStatusBadge status={order.status} />
//         </div>

//         <div className="p-6 space-y-6">

//           {/* Progress */}
//           {order.status !== 'CANCELLED' && (
//             <div>
//               <p className="text-xs font-semibold text-gray-500 mb-3">Order Progress</p>
//               <div className="flex items-center">
//                 {statusSteps.map((step, i) => (
//                   <div key={step} className="flex items-center flex-1 last:flex-none">
//                     <div className="flex flex-col items-center">
//                       <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
//                         i <= stepIndex
//                           ? 'bg-indigo-600 border-indigo-600 text-white'
//                           : 'bg-white border-gray-300 text-gray-400'
//                       }`}>
//                         {i < stepIndex
//                           ? <CheckCircle className="h-4 w-4" />
//                           : <span className="text-xs font-bold">{i + 1}</span>}
//                       </div>
//                       <span className="text-[10px] mt-1.5 text-gray-500 font-medium whitespace-nowrap">{step}</span>
//                     </div>
//                     {i < statusSteps.length - 1 && (
//                       <div className={`flex-1 h-0.5 mb-4 mx-1 ${i < stepIndex ? 'bg-indigo-600' : 'bg-gray-200'}`} />
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Meta */}
//           <div className="grid grid-cols-2 gap-3">
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
//               <div className="flex items-center gap-2 mb-1">
//                 <ShoppingCart className="h-3.5 w-3.5 text-gray-400" />
//                 <p className="text-xs text-gray-400 font-medium">Total Amount</p>
//               </div>
//               <p className="text-sm font-semibold text-indigo-600">${total.toFixed(2)}</p>
//             </div>
//             <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
//               <div className="flex items-center gap-2 mb-1">
//                 <Package className="h-3.5 w-3.5 text-gray-400" />
//                 <p className="text-xs text-gray-400 font-medium">Items</p>
//               </div>
//               <p className="text-sm font-semibold text-gray-900">{order.items?.length} item(s)</p>
//             </div>
//             {order.address && (
//               <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 col-span-2">
//                 <div className="flex items-center gap-2 mb-1">
//                   <MapPin className="h-3.5 w-3.5 text-gray-400" />
//                   <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
//                 </div>
//                 <p className="text-sm font-semibold text-gray-900">{order.address}</p>
//               </div>
//             )}
//           </div>

//           {/* Items breakdown */}
//           <div>
//             <p className="text-xs font-semibold text-gray-500 mb-2">Items Ordered</p>
//             <div className="border border-gray-100 rounded-lg overflow-hidden">
//               <div className="divide-y divide-gray-50">
//                 {order.items?.map((item, i) => (
//                   <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
//                     <div className="flex items-center gap-3">
//                       {item.medicine?.imageUrl ? (
//                         <img src={item.medicine.imageUrl} alt={item.medicine.name}
//                           className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
//                       ) : (
//                         <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
//                           <Package className="h-5 w-5 text-indigo-400" />
//                         </div>
//                       )}
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{item.medicine?.name}</p>
//                         <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
//                       </div>
//                     </div>
//                     <p className="text-sm font-bold text-gray-900">
//                       ${(item.price * item.quantity).toFixed(2)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//               <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
//                 <p className="text-sm font-semibold text-gray-700">Total</p>
//                 <p className="text-sm font-bold text-indigo-600">${total.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import { useEffect, useState } from 'react';
import { MapPin, ShoppingCart, CheckCircle, Package, ArrowLeft } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import api from '@/lib/api';

interface OrderItem {
  price: number;
  quantity: number;
  medicine: { name: string; imageUrl?: string };
}

export interface Order {
  id: string;
  status: string;
  price: number;
  createdAt: string;
  shippingAddress?: string;
  items: OrderItem[];
}

const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetails({
  orderId,
  onBack,
}: {
  orderId: string;
  onBack: () => void;
}) {
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Failed to load order details'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );

  if (error || !order) return (
    <div className="p-6 text-center text-sm text-red-500">{error || 'Order not found'}</div>
  );

  const total     = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
  const stepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="max-w-2xl">
      <button onClick={onBack}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </button>

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <p className="text-xs text-gray-400 font-mono mt-1">{order.id}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium mb-1">Placed on</p>
            <p className="text-sm font-semibold text-gray-900">
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                year: 'numeric', month: 'short', day: 'numeric',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="p-6 space-y-6">

          {/* Progress */}
          {order.status !== 'CANCELLED' && (
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-3">Order Progress</p>
              <div className="flex items-center">
                {statusSteps.map((step, i) => (
                  <div key={step} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                        i <= stepIndex
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {i < stepIndex
                          ? <CheckCircle className="h-4 w-4" />
                          : <span className="text-xs font-bold">{i + 1}</span>}
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
          )}

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <ShoppingCart className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs text-gray-400 font-medium">Total Amount</p>
              </div>
              <p className="text-sm font-semibold text-indigo-600">${total.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-3.5 w-3.5 text-gray-400" />
                <p className="text-xs text-gray-400 font-medium">Items</p>
              </div>
              <p className="text-sm font-semibold text-gray-900">{order.items?.length} item(s)</p>
            </div>
            {order.shippingAddress && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 col-span-2">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">{order.shippingAddress}</p>
              </div>
            )}
          </div>

          {/* Items breakdown */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-2">Items Ordered</p>
            <div className="border border-gray-100 rounded-lg overflow-hidden">
              <div className="divide-y divide-gray-50">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      {item.medicine?.imageUrl ? (
                        <img src={item.medicine.imageUrl} alt={item.medicine.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
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
    </div>
  );
}