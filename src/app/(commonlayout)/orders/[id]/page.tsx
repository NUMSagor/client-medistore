import OrderConfirmation from "@/components/orders/OrderConfirmation";


interface PageProps {
  params: { id: string };
}

export default async function OrderPage({ params }: PageProps) {
  const { id } = await params;
  return <OrderConfirmation orderId={id} />;
}