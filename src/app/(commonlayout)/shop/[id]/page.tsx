
// import ProductDetails from "@/components/shop/ProductDetails";

// // This is a server component (no 'use client' here)
// interface PageProps {
//   params: { id: string };
// }

// export default async function Page({ params }: PageProps) {
//   const { id } = await params;
//   return <ProductDetails id={params.id} />;
// }


import ProductDetails from "@/components/shop/ProductDetails";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;  
  const { id } = resolvedParams;

  return <ProductDetails id={id} />;
}





