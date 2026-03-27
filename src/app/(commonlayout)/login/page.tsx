'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import LoginForm from '@/components/login-form';

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams(); // hook
  const redirect = searchParams?.get('redirect') || '/';

  useEffect(() => {
    // router.push(redirect);
  }, [redirect]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
