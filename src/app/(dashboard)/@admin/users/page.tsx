'use client';

import { useEffect, useState } from 'react';
import { Search, Shield, Ban, ChevronDown } from 'lucide-react';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
  status: 'ACTIVE' | 'BANNED';
  createdAt: string;
}

const roleColor: Record<string, string> = {
  ADMIN:    'bg-purple-100 text-purple-700',
  SELLER:   'bg-indigo-100 text-indigo-700',
  CUSTOMER: 'bg-emerald-100 text-emerald-700',
};

export default function AdminUsersPage() {
  const [users, setUsers]     = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setUsers(data);
        setFiltered(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) =>
      u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    ));
  }, [search, users]);

  const toggleStatus = async (user: User) => {
    const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    setUpdating(user.id);
    try {
      await api.patch(`/admin/users/${user.id}`, { status: newStatus });
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, status: newStatus } : u));
    } catch {}
    finally { setUpdating(null); }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <p className="text-sm text-gray-500 mt-1">Manage all registered users</p>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                  <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-gray-900">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{user.email}</td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${roleColor[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-3">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => toggleStatus(user)}
                          disabled={updating === user.id}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50
                            ${user.status === 'ACTIVE'
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                            }`}
                        >
                          {user.status === 'ACTIVE' ? <><Ban className="h-3 w-3" /> Ban</> : <><Shield className="h-3 w-3" /> Unban</>}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-sm">No users found</div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}