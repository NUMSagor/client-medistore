import { Clock, Package, ShoppingCart, CheckCircle, XCircle } from 'lucide-react';

const config: Record<string, { color: string; icon: React.ReactNode }> = {
  PLACED:     { color: 'bg-blue-100 text-blue-700',   icon: <Clock className="h-3.5 w-3.5" /> },
  PROCESSING: { color: 'bg-yellow-100 text-yellow-700', icon: <Package className="h-3.5 w-3.5" /> },
  SHIPPED:    { color: 'bg-indigo-100 text-indigo-700', icon: <ShoppingCart className="h-3.5 w-3.5" /> },
  DELIVERED:  { color: 'bg-green-100 text-green-700',  icon: <CheckCircle className="h-3.5 w-3.5" /> },
  CANCELLED:  { color: 'bg-red-100 text-red-700',     icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function OrderStatusBadge({ status }: { status: string }) {
  const { color, icon } = config[status] ?? { color: 'bg-gray-100 text-gray-600', icon: null };
  return (
    <span className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${color}`}>
      {icon} {status}
    </span>
  );
}