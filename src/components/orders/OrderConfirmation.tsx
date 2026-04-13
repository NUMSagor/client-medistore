// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';
// import {
//   CheckCircle, Package, MapPin, ShoppingCart,
//   ArrowRight, Clock, Truck, BadgeCheck,
// } from 'lucide-react';
// import api from '@/lib/api';
// import OrderStatusBadge from './OrderStatusBadge';

// interface OrderItem {
//   price: number;
//   quantity: number;
//   medicine: { name: string; imageUrl?: string };
// }

// interface Order {
//   id: string;
//   status: string;
//   createdAt: string;
//   shippingAddress?: string;
//   items: OrderItem[];
// }

// const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

// export default function OrderConfirmation({ orderId }: { orderId: string }) {
//   const [order, setOrder]     = useState<Order | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError]     = useState('');

//   useEffect(() => {
//     api.get(`/orders/${orderId}`)
//       .then((res) => setOrder(res.data))
//       .catch(() => setError('Failed to load order'))
//       .finally(() => setLoading(false));
//   }, [orderId]);

//   if (loading) return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//       <div className="flex flex-col items-center gap-3">
//         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//         <p className="text-sm text-gray-500">Loading your order...</p>
//       </div>
//     </div>
//   );

//   if (error || !order) return (
//     <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
//       <p className="text-red-500 font-medium">{error || 'Order not found'}</p>
//       <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">
//         Back to Shop →
//       </Link>
//     </div>
//   );

//   const total      = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
//   const stepIndex  = statusSteps.indexOf(order.status);

//   return (
//     <div className="min-h-screen bg-gray-50 py-10">
//       <div className="max-w-2xl mx-auto px-4">

//         {/* Success banner */}
//         <div className="bg-linear-to-r from-indigo-600 to-pink-700 rounded-2xl p-8 text-white text-center mb-6">
//           <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4">
//             <CheckCircle className="h-9 w-9 text-white" />
//           </div>
//           <h1 className="text-2xl font-bold mb-1">Order Placed Successfully!</h1>
//           <p className="text-white/80 text-sm">Thank you for your purchase. We'll process it shortly.</p>
//           <p className="font-mono text-xs text-white/60 mt-3">{order.id}</p>
//         </div>

//         {/* Order card */}
//         <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">

//           {/* Header */}
//           <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//             <div>
//               <p className="text-xs text-gray-400 mb-1">Placed on</p>
//               <p className="text-sm font-semibold text-gray-900">
//                 {new Date(order.createdAt).toLocaleDateString('en-US', {
//                   year: 'numeric', month: 'long', day: 'numeric',
//                 })}
//               </p>
//             </div>
//             <OrderStatusBadge status={order.status} />
//           </div>

//           <div className="p-6 space-y-6">

//             {/* Progress tracker */}
//             <div>
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Order Progress</p>
//               <div className="flex items-center">
//                 {statusSteps.map((step, i) => (
//                   <div key={step} className="flex items-center flex-1 last:flex-none">
//                     <div className="flex flex-col items-center">
//                       <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-colors ${
//                         i <= stepIndex
//                           ? 'bg-indigo-600 border-indigo-600 text-white'
//                           : 'bg-white border-gray-200 text-gray-400'
//                       }`}>
//                         {i < stepIndex
//                           ? <CheckCircle className="h-4 w-4" />
//                           : i === 0 ? <ShoppingCart className="h-4 w-4" />
//                           : i === 1 ? <Package className="h-4 w-4" />
//                           : i === 2 ? <Truck className="h-4 w-4" />
//                           : <BadgeCheck className="h-4 w-4" />
//                         }
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

//             {/* Summary cards */}
//             <div className="grid grid-cols-2 gap-3">
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                 <div className="flex items-center gap-2 mb-1">
//                   <ShoppingCart className="h-3.5 w-3.5 text-gray-400" />
//                   <p className="text-xs text-gray-400 font-medium">Total Amount</p>
//                 </div>
//                 <p className="text-lg font-bold text-indigo-600">${total.toFixed(2)}</p>
//               </div>
//               <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
//                 <div className="flex items-center gap-2 mb-1">
//                   <Package className="h-3.5 w-3.5 text-gray-400" />
//                   <p className="text-xs text-gray-400 font-medium">Items Ordered</p>
//                 </div>
//                 <p className="text-lg font-bold text-gray-900">{order.items?.length}</p>
//               </div>
//               {order.shippingAddress && (
//                 <div className="col-span-2 bg-gray-50 rounded-xl p-4 border border-gray-100">
//                   <div className="flex items-center gap-2 mb-1">
//                     <MapPin className="h-3.5 w-3.5 text-gray-400" />
//                     <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
//                   </div>
//                   <p className="text-sm font-semibold text-gray-900 leading-relaxed">{order.shippingAddress}</p>
//                 </div>
//               )}
//             </div>

//             {/* Items list */}
//             <div>
//               <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items</p>
//               <div className="border border-gray-100 rounded-xl overflow-hidden">
//                 <div className="divide-y divide-gray-50">
//                   {order.items?.map((item, i) => (
//                     <div key={i} className="flex items-center justify-between px-4 py-3">
//                       <div className="flex items-center gap-3">
//                         {item.medicine?.imageUrl ? (
//                           <img src={item.medicine.imageUrl} alt={item.medicine.name}
//                             className="w-10 h-10 rounded-lg object-cover border border-gray-100" />
//                         ) : (
//                           <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
//                             <Package className="h-5 w-5 text-indigo-400" />
//                           </div>
//                         )}
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">{item.medicine?.name}</p>
//                           <p className="text-xs text-gray-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
//                         </div>
//                       </div>
//                       <p className="text-sm font-bold text-gray-900">
//                         ${(item.price * item.quantity).toFixed(2)}
//                       </p>
//                     </div>
//                   ))}
//                 </div>
//                 <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-100">
//                   <p className="text-sm font-semibold text-gray-700">Total</p>
//                   <p className="text-sm font-bold text-indigo-600">${total.toFixed(2)}</p>
//                 </div>
//               </div>
//             </div>

//           </div>
//         </div>

//         {/* Actions */}
//         <div className="flex gap-3">
//           <Link href="/dashboard"
//             className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm">
//             View My Orders
//           </Link>
//           <Link href="/shop"
//             className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-3 rounded-xl hover:opacity-90 transition-opacity text-sm">
//             Continue Shopping <ArrowRight className="h-4 w-4" />
//           </Link>
//         </div>

//       </div>
//     </div>
//   );
// }



'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Package, MapPin, ShoppingCart,
  ArrowRight, Truck, BadgeCheck, Download, Printer,
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
  paymentMethod: string;
  shippingAddress?: string;
  items: OrderItem[];
}

const statusSteps = ['PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderConfirmation({ orderId }: { orderId: string }) {
  const [order, setOrder]     = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const invoiceRef            = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.get(`/orders/${orderId}`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Failed to load order'))
      .finally(() => setLoading(false));
  }, [orderId]);


  // const handleDownloadPDF = async () => {
  //   if (!invoiceRef.current || !order) return;
  //   const { default: jsPDF } = await import('jspdf');
  //   const { default: html2canvas } = await import('html2canvas');

  //   const canvas = await html2canvas(invoiceRef.current, {
  //     scale: 2,
  //     useCORS: true,
  //     logging: false,
  //     onclone: (clonedDoc) => {
  //       // gradient এর বদলে solid color দিন
  //       const gradients = clonedDoc.querySelectorAll<HTMLElement>('[class*="bg-linear"]');
  //       gradients.forEach((el) => {
  //         el.style.background = 'linear-gradient(to right, #4f46e5, #db2777)';
  //       });
  //       const indigo = clonedDoc.querySelectorAll<HTMLElement>('[class*="bg-indigo-50"]');
  //       indigo.forEach((el) => { el.style.backgroundColor = '#eef2ff'; });
  //       const pink = clonedDoc.querySelectorAll<HTMLElement>('[class*="bg-pink-50"]');
  //       pink.forEach((el) => { el.style.backgroundColor = '#fdf2f8'; });
  //       const gray = clonedDoc.querySelectorAll<HTMLElement>('[class*="bg-gray-50"]');
  //       gray.forEach((el) => { el.style.backgroundColor = '#f9fafb'; });
  //     },
  //   });

  //   const imgData = canvas.toDataURL('image/png');
  //   const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  //   const pdfW = pdf.internal.pageSize.getWidth();
  //   const pdfH = (canvas.height * pdfW) / canvas.width;
  //   pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
  //   pdf.save(`invoice-${order.id.slice(0, 8)}.pdf`);
  // };



  const handleDownloadPDF = async () => {
    if (!order) return;
    const { default: jsPDF } = await import('jspdf');

    const pdf  = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pw   = pdf.internal.pageSize.getWidth();
    let y      = 0;

    // ── Header ──────────────//
    pdf.setFillColor(79, 70, 229);
    pdf.rect(0, 0, pw, 28, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18); pdf.setFont('helvetica', 'bold');
    pdf.text('MEDISTORE', 14, 12);
    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal');
    pdf.text('Your Trusted Online Pharmacy', 14, 19);
    pdf.setFontSize(11); pdf.setFont('helvetica', 'bold');
    pdf.text('INVOICE', pw - 14, 12, { align: 'right' });
    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal');
    pdf.text(`#${order.id.slice(0, 8).toUpperCase()}`, pw - 14, 19, { align: 'right' });
    y = 38;

    // ── Order Info ─────────────//
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(9); pdf.setFont('helvetica', 'normal');
    pdf.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 14, y);
    pdf.text(`Status: ${order.status}`, pw - 14, y, { align: 'right' });
    y += 7;

    // ── Payment Method ──────────────//
    const paymentLabel = (order as any).paymentMethod === 'stripe' ? 'Paid (Credit/Debit Card)' : 'Cash on Delivery (COD)';
    pdf.setFontSize(9);
    pdf.text(`Payment: ${paymentLabel}`, 14, y);
    y += 10;

    // ── Shipping Address ─────────────//
    if (order.shippingAddress) {
      pdf.setFillColor(238, 242, 255);
      pdf.roundedRect(14, y, pw - 28, 18, 2, 2, 'F');
      pdf.setTextColor(79, 70, 229);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'bold');
      pdf.text('DELIVERY ADDRESS', 18, y + 6);
      pdf.setTextColor(50, 50, 50);
      pdf.setFont('helvetica', 'normal');
      const lines = pdf.splitTextToSize(order.shippingAddress, pw - 36);
      pdf.text(lines[0] || '', 18, y + 13);
      y += 25;
    }

    // ── Items Table Header ───────────────────────────────────────────
    pdf.setFillColor(79, 70, 229);
    pdf.rect(14, y, pw - 28, 8, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(8); pdf.setFont('helvetica', 'bold');
    pdf.text('Medicine', 18, y + 5.5);
    pdf.text('Qty', pw - 65, y + 5.5, { align: 'center' });
    pdf.text('Unit Price', pw - 45, y + 5.5, { align: 'center' });
    pdf.text('Total', pw - 14, y + 5.5, { align: 'right' });
    y += 10;

    // ── Items Rows ───────────────────────────────────────────────────
    order.items?.forEach((item, i) => {
      if (i % 2 === 0) {
        pdf.setFillColor(249, 250, 251);
        pdf.rect(14, y - 2, pw - 28, 9, 'F');
      }
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(8); pdf.setFont('helvetica', 'normal');
      pdf.text(item.medicine?.name || '', 18, y + 4);
      pdf.text(String(item.quantity), pw - 65, y + 4, { align: 'center' });
      pdf.text(`$${item.price.toFixed(2)}`, pw - 45, y + 4, { align: 'center' });
      pdf.text(`$${(item.price * item.quantity).toFixed(2)}`, pw - 14, y + 4, { align: 'right' });
      y += 9;
    });

    // ── Total ────────────────────────────────────────────────────────
    y += 2;
    pdf.setFillColor(238, 242, 255);
    pdf.rect(14, y, pw - 28, 10, 'F');
    pdf.setTextColor(79, 70, 229);
    pdf.setFontSize(10); pdf.setFont('helvetica', 'bold');
    pdf.text('Grand Total', pw - 50, y + 7);
    pdf.text(`$${total.toFixed(2)}`, pw - 14, y + 7, { align: 'right' });
    y += 18;

    // ── Footer ───────────────────────────────────────────────────────
    pdf.setDrawColor(220, 220, 220);
    pdf.line(14, y, pw - 14, y);
    y += 6;
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(8); pdf.setFont('helvetica', 'normal');
    pdf.text('Thank you for shopping with MEDISTORE', pw / 2, y, { align: 'center' });
    y += 5;
    pdf.text('support@medistore.com  ·  +1 (800) 123-4567', pw / 2, y, { align: 'center' });

    pdf.save(`invoice-${order.id.slice(0, 8)}.pdf`);
};


  const handlePrint = () => {
    const printContent = invoiceRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) return;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Invoice #${order?.id.slice(0, 8).toUpperCase()}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: Arial, sans-serif; padding: 20px; background: white; }
                .invoice-header { background: linear-gradient(to right, #4f46e5, #db2777); padding: 20px; border-radius: 12px; color: white; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .invoice-header h1 { font-size: 22px; font-weight: 900; }
                .invoice-header p { font-size: 11px; opacity: 0.7; }
                .invoice-header .right { text-align: right; }
                .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
                .meta-box { background: #eef2ff; border-radius: 8px; padding: 12px; }
                .meta-box.pink { background: #fdf2f8; }
                .meta-box label { font-size: 10px; color: #818cf8; font-weight: 600; display: block; margin-bottom: 4px; }
                .meta-box.pink label { color: #f472b6; }
                .meta-box span { font-size: 13px; font-weight: 700; color: #111; }
                .payment-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 10px 14px; margin-bottom: 16px; font-size: 12px; color: #166534; font-weight: 600; }
                .address-box { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; margin-bottom: 16px; }
                .address-box label { font-size: 10px; color: #9ca3af; font-weight: 600; display: block; margin-bottom: 4px; }
                .address-box span { font-size: 13px; font-weight: 600; color: #111; }
                table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
                thead tr { background: #4f46e5; color: white; }
                thead th { padding: 8px 12px; font-size: 11px; text-align: left; }
                thead th:last-child, thead th:nth-child(2), thead th:nth-child(3) { text-align: right; }
                tbody tr:nth-child(even) { background: #f9fafb; }
                tbody td { padding: 8px 12px; font-size: 12px; color: #333; border-bottom: 1px solid #f3f4f6; }
                tbody td:last-child, tbody td:nth-child(2), tbody td:nth-child(3) { text-align: right; }
                .total-row { background: #eef2ff !important; }
                .total-row td { font-weight: 700; color: #4f46e5; font-size: 13px; padding: 10px 12px; }
                .footer { margin-top: 20px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 12px; }
                .footer p { font-size: 11px; color: #9ca3af; }
            </style>
        </head>
        <body>
            <div class="invoice-header">
                <div>
                    <h1>MEDISTORE</h1>
                    <p>Your Trusted Online Pharmacy</p>
                </div>
                <div class="right">
                    <h1 style="font-size:14px">INVOICE</h1>
                    <p>#${order?.id.slice(0, 8).toUpperCase()}</p>
                </div>
            </div>

            <div class="meta">
                <div class="meta-box">
                    <label>ORDER DATE</label>
                    <span>${new Date(order!.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div class="meta-box pink">
                    <label>ORDER STATUS</label>
                    <span>${order?.status}</span>
                </div>
            </div>

            <div class="payment-box">
                💳 Payment: ${(order as any)?.paymentMethod === 'stripe' ? 'Paid — Credit/Debit Card' : 'Cash on Delivery (COD)'}
            </div>

            ${order?.shippingAddress ? `
            <div class="address-box">
                <label>📍 DELIVERY ADDRESS</label>
                <span>${order.shippingAddress}</span>
            </div>` : ''}

            <table>
                <thead>
                    <tr>
                        <th>Medicine</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order?.items?.map(item => `
                        <tr>
                            <td>${item.medicine?.name}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                    <tr class="total-row">
                        <td colspan="3" style="text-align:right">Grand Total</td>
                        <td>$${total.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>

            <div class="footer">
                <p>Thank you for shopping with MEDISTORE</p>
                <p>support@medistore.com · +1 (800) 123-4567</p>
            </div>
        </body>
        </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };


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
      <Link href="/shop" className="text-sm font-semibold text-indigo-600 hover:text-pink-600">Back to Shop →</Link>
    </div>
  );

  const total     = order.items?.reduce((s, i) => s + i.price * i.quantity, 0) ?? 0;
  const stepIndex = statusSteps.indexOf(order.status);

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

        {/* Download/Print buttons */}
        <div className="flex gap-3 mb-5">
          <button onClick={handleDownloadPDF}
            className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
            <Download className="h-4 w-4" /> Download Invoice
          </button>
          <button onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 border-2 border-indigo-200 text-indigo-600 font-semibold py-3 rounded-xl hover:bg-indigo-50 transition-colors text-sm">
            <Printer className="h-4 w-4" /> Print Invoice
          </button>
        </div>

        {/* ── INVOICE (this gets captured for PDF) ── */}
        <div ref={invoiceRef} className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">

          {/* Invoice Header */}
          <div className="bg-linear-to-r from-indigo-600 to-pink-700 px-6 py-5 flex items-center justify-between">
            <div>
              <p className="text-white font-black text-xl tracking-wide">MEDISTORE</p>
              <p className="text-white/70 text-xs">Your Trusted Online Pharmacy</p>
            </div>
            <div className="text-right">
              <p className="text-white font-bold text-sm">INVOICE</p>
              <p className="text-white/70 text-xs font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
            </div>
          </div>

          <div className="p-6 space-y-6">

            {/* Invoice Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <p className="text-xs text-indigo-400 font-medium mb-1">Order Date</p>
                <p className="text-sm font-bold text-gray-900">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                <p className="text-xs text-pink-400 font-medium mb-1">Order Status</p>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>

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
                        {i < stepIndex ? <CheckCircle className="h-4 w-4" />
                          : i === 0 ? <ShoppingCart className="h-4 w-4" />
                          : i === 1 ? <Package className="h-4 w-4" />
                          : i === 2 ? <Truck className="h-4 w-4" />
                          : <BadgeCheck className="h-4 w-4" />}
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

            {/* Shipping Address */}
            {order.shippingAddress && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  <p className="text-xs text-gray-400 font-medium">Delivery Address</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 leading-relaxed">{order.shippingAddress}</p>
              </div>
            )}

            {/* Items Table */}
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items Ordered</p>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-12 bg-gray-50 px-4 py-2 border-b border-gray-100">
                  <p className="col-span-6 text-xs font-semibold text-gray-500">Medicine</p>
                  <p className="col-span-2 text-xs font-semibold text-gray-500 text-center">Qty</p>
                  <p className="col-span-2 text-xs font-semibold text-gray-500 text-center">Price</p>
                  <p className="col-span-2 text-xs font-semibold text-gray-500 text-right">Total</p>
                </div>
                {/* Rows */}
                {order.items?.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 px-4 py-3 border-b border-gray-50 hover:bg-gray-50">
                    <div className="col-span-6 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                        <Package className="h-4 w-4 text-indigo-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">{item.medicine?.name}</p>
                    </div>
                    <p className="col-span-2 text-sm text-gray-500 text-center self-center">{item.quantity}</p>
                    <p className="col-span-2 text-sm text-gray-500 text-center self-center">${item.price.toFixed(2)}</p>
                    <p className="col-span-2 text-sm font-bold text-gray-900 text-right self-center">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
                {/* Total Row */}
                <div className="grid grid-cols-12 px-4 py-3 bg-indigo-50 border-t border-indigo-100">
                  <p className="col-span-10 text-sm font-bold text-gray-700 text-right pr-4">Grand Total</p>
                  <p className="col-span-2 text-sm font-black text-indigo-600 text-right">${total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Footer note */}
            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">Thank you for shopping with MEDISTORE</p>
              <p className="text-xs text-gray-400">support@medistore.com · +1 (800) 123-4567</p>
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