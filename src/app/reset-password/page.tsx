'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleReset = async () => {
    await authClient.resetPassword({
      newPassword: password,
      token: searchParams.get('token') ?? '', // Better Auth passes token in URL
    });
    router.push('/login');
  };

  return (
    <div>
      <h2>Set New Password</h2>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}