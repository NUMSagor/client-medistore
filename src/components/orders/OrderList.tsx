// 'use client';

// import { useState } from 'react';
// import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
// import OrderStatusBadge from './OrderStatusBadge';
// import OrderDetails, { Order } from './OrderDetails';
// import Link from 'next/link';

// export default function OrderList({ orders, loading }: { orders: Order[]; loading: boolean }) {
//   const [expandedId, setExpandedId] = useState<string | null>(null);

//   if (loading) return (
//     <div className="p-6 space-y-3">
//       {Array.from({ length: 4 }).map((_, i) => (
//         <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
//       ))}
//     </div>
//   );

//   if (orders.length === 0) return (
//     <div className="py-16 flex flex-col items-center gap-3">
//       <ShoppingCart className="h-10 w-10 text-gray-200" />
//       <p className="text-gray-400 text-sm">No orders yet</p>
//       <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">
//         Browse medicines →
//       </Link>
//     </div>
//   );

//   return (
//     <div className="divide-y divide-gray-100">
//       {orders.map((order) => {
//         const total      = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
//         const isExpanded = expandedId === order.id;

//         return (
//           <div key={order.id}>
//             {/* Row */}
//             <div
//               onClick={() => setExpandedId(isExpanded ? null : order.id)}
//               className="px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
//             >
//               <div className="flex items-center justify-between mb-2">
//                 <div className="flex items-center gap-2">
//                   <span className="font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</span>
//                   <OrderStatusBadge status={order.status} />
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="font-bold text-indigo-600">${total.toFixed(2)}</span>
//                   {isExpanded
//                     ? <ChevronUp className="h-4 w-4 text-gray-400" />
//                     : <ChevronDown className="h-4 w-4 text-gray-400" />}
//                 </div>
//               </div>
//               <div className="flex items-center gap-2 flex-wrap">
//                 {order.items?.map((item, i) => (
//                   <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                     {item.medicine?.name} ×{item.quantity}
//                   </span>
//                 ))}
//               </div>
//               <p className="text-xs text-gray-400 mt-1">
//                 {new Date(order.createdAt).toLocaleDateString()}
//               </p>
//             </div>

//             {/* Expanded details */}
//             {isExpanded && (
//               <div className="px-6 pb-5 bg-gray-50 border-t border-gray-100">
//                 <OrderDetails
//                   orderId={order.id}
//                   onBack={() => setExpandedId(null)}
//                 />
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { ShoppingCart, ChevronDown, ChevronUp } from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';
import OrderDetails, { Order } from './OrderDetails';
import Link from 'next/link';

export default function OrderList({ orders, loading }: { orders: Order[]; loading: boolean }) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) return (
    <div className="p-6 space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="py-16 flex flex-col items-center gap-3">
      <ShoppingCart className="h-10 w-10 text-gray-200" />
      <p className="text-gray-400 text-sm">No orders yet</p>
      <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">
        Browse medicines →
      </Link>
    </div>
  );

  return (
    <div className="divide-y divide-gray-100">
      {orders.map((order) => {
        const total      = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
        const isExpanded = expandedId === order.id;

        return (
          <div key={order.id}>
            {/* Clickable row */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : order.id)}
              className="w-full text-left px-6 py-4 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-gray-400">{order.id.slice(0, 8)}...</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-indigo-600">${total.toFixed(2)}</span>
                  {isExpanded
                    ? <ChevronUp className="h-4 w-4 text-gray-700 text-md" />
                    : <ChevronDown className="h-4 w-4 text-gray-700 text-md" />
                  }
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {order.items?.map((item, i) => (
                  <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.medicine?.name} ×{item.quantity}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </button>

            {/* Expanded details */}
            {isExpanded && (
              <div className="px-6 pb-6 bg-gray-50 border-t border-gray-100">
                <OrderDetails
                  orderId={order.id}
                  onBack={() => setExpandedId(null)}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}