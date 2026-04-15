// 'use client';

// import api from '@/lib/api';
// import { createContext, useContext, useEffect, useState } from 'react';


// export type User = {
//   id: string;
//   name: string;  
//   email: string;
//   phone?: string;
//   password: string;
//   role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
// };

// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   login: (data: { email: string; password: string }) => Promise<void>;
//   register: (data: {
//     email: string;
//     password: string;
//     role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
//   }) => Promise<void>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   // ✅ Load user from token
//   useEffect(() => {
//   const token = localStorage.getItem('token');
//   if (!token) {
//     setLoading(false);
//     return;
//   }

//   api
//     .get('/auth/me')
//     .then((res) => setUser(res.data))
//     .catch(() => {
//       // localStorage.removeItem('token');
//       setUser(null);
//     })
//     .finally(() => setLoading(false));
// }, []);

//   // ✅ LOGIN
//   const login = async (data: { email: string; password: string }) => {
//     const res = await api.post('/auth/login', data);
//     localStorage.setItem('token', res.data.token);
//     setUser(res.data.user);
//   };

//   // ✅ REGISTER (THIS FIXES YOUR ERROR)
//   const register = async (data: {
//     email: string;
//     password: string;
//     role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
//   }) => {
//     await api.post('/auth/register', data);
//   };

//   // ✅ LOGOUT
//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, loading, login, register, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// // ✅ Hook
// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) {
//     throw new Error('useAuth must be used inside AuthProvider');
//   }
//   return ctx;
// };





'use client';

import api from '@/lib/api';
import { authClient } from '@/lib/auth-client';
import { createContext, useContext, useEffect, useState } from 'react';

export type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: 'ADMIN' | 'SELLER' | 'CUSTOMER'; }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load user from JWT (existing)
  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) { setLoading(false); return; }

  //   api.get('/v1/auth/me')
  //     .then((res) => setUser(res.data))
  //     .catch(() => setUser(null))
  //     .finally(() => setLoading(false));
  // }, []);


// useEffect(() => {
//   const initAuth = async () => {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await api.get('/v1/jwt-auth/me');
//       setUser(res.data);
//     } catch (err: any) {
//       // ✅ If 401, token is expired/invalid — clear it silently
//       if (err.response?.status === 401) {
//         localStorage.removeItem('token');
//       }
//       setUser(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   initAuth();
// }, []);


  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }

      try {
        const res = await api.get('/v1/jwt-auth/me');
        setUser(res.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token'); // ✅ auto-clear expired token
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);



  // ✅ JWT Login (existing)
  const login = async (data: { email: string; password: string }) => {
    const res = await api.post('/v1/jwt-auth/login', data);
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  // ✅ JWT Register (existing)
  const register = async (data: { email: string; password: string; role: 'ADMIN' | 'SELLER' | 'CUSTOMER'; }) => {
    await api.post('/v1/jwt-auth/register', data);
  };

  // ✅ NEW — Google Login via Better Auth
  const loginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/dashboard`, // redirect after login
    });
  };

  // ✅ NEW — Forgot Password via Better Auth
  const forgotPassword = async (email: string) => {
    await authClient.requestPasswordReset({
      email,
      redirectTo: `${window.location.origin}/reset-password`, // page where user sets new password
    });
  };

  // ✅ Logout both
  const logout = () => {
    localStorage.removeItem('token');
    authClient.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, forgotPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};