'use client';

import { useAuth } from '@/app/provider/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Users, ShoppingBag, Tag,
  Package, ClipboardList, LogOut, Menu, X,
  User, ShoppingCart, Heart,
} from 'lucide-react';
import { useState } from 'react';

// ─── Sidebar nav per role ──────────────────────────────────────────────────
const navItems = {
  ADMIN: [
     { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Users', href: '/users', icon: Users },
    { label: 'Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Categories', href: '/categories', icon: Tag },
  ],
  SELLER: [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Medicines', href: '/medecines', icon: Package },
    { label: 'Orders', href: '/orders', icon: ClipboardList },
  ],
  CUSTOMER: [
    // { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Orders', href: '/orders', icon: ShoppingCart },
    { label: 'Profile', href: '/profile', icon: User },
  ],
};

const roleBadgeColor = {
  ADMIN: 'bg-purple-100 text-purple-700',
  SELLER: 'bg-indigo-100 text-indigo-700',
  CUSTOMER: 'bg-emerald-100 text-emerald-700',
};

export default function DashboardLayout({
  children,
  admin,
  seller,
  customers,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  seller: React.ReactNode;
  customers: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading]);

 

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!user) return null;

  const items = navItems[user.role];
  const slot = user.role === 'ADMIN' ? admin : user.role === 'SELLER' ? seller : customers;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Mobile overlay ──────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900">
            <span className="w-7 h-7 rounded-lg bg-linear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-xs font-black">M</span>
            MEDISTORE
          </Link>
          <button className="md:hidden p-1" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${roleBadgeColor[user.role]}`}>
                {user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {items.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors group"
                >
                  <Icon className="h-4 w-4 shrink-0 group-hover:text-indigo-600 transition-colors" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-gray-100">
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-bold text-sm text-gray-900">MEDISTORE</span>
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-sm font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
        </header>

        {/* Page slot */}
        <main className="flex-1 p-6 overflow-auto">
          {slot}
        </main>
      </div>
    </div>
  );
}