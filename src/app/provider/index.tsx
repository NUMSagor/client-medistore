// 'use client';

// import { AuthProvider } from './AuthProvider';

// export default function Providers({ children }: { children: React.ReactNode }) {
//   return <AuthProvider>{children}</AuthProvider>;
// }



import { CartProvider } from './CartProvider';
import { AuthProvider } from './AuthProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  );
}
