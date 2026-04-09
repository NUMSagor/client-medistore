'use client';

import api from '@/lib/api';
import { createContext, useContext, useEffect, useState } from 'react';


export type User = {
  id: string;
  name: string;  
  email: string;
  phone?: string;
  password: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from token
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    setLoading(false);
    return;
  }

  api
    .get('/auth/me')
    .then((res) => setUser(res.data))
    .catch(() => {
      // localStorage.removeItem('token');
      setUser(null);
    })
    .finally(() => setLoading(false));
}, []);

  // ✅ LOGIN
  const login = async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  // ✅ REGISTER (THIS FIXES YOUR ERROR)
  const register = async (data: {
    email: string;
    password: string;
    role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  }) => {
    await api.post('/auth/register', data);
  };

  // ✅ LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
};
