'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import api from '@/lib/api';
import { Role } from '@/types/role';

export default function RegisterForm() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<Role>('CUSTOMER');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await api.post('/register', {
        name,    
        email,
        password,
        role,
      });

      router.push('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>
           Register to access MediStore
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-sm text-red-600">{error}</p>}

            {/* Name */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" required />
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>

            {/* Password */}
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>

            {/* Role */}
            <div className="space-y-1">
              <Label>Account Type</Label>
              <Select value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CUSTOMER">Customer</SelectItem>
                  <SelectItem value="SELLER">Seller</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

