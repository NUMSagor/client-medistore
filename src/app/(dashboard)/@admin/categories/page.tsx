'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '@/lib/api';

interface Category { id: string; name: string; slug: string; isActive: boolean; _count?: { medicines: number } }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);
  const [newName, setNewName]       = useState('');
  const [adding, setAdding]         = useState(false);
  const [editId, setEditId]         = useState<string | null>(null);
  const [editName, setEditName]     = useState('');
  const [saving, setSaving]         = useState(false);

  const load = () => {
    api.get('/categories')
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      await api.post('/categories', { name: newName.trim() });
      setNewName(''); setAdding(false); load();
    } catch {} finally { setSaving(false); }
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    try {
      await api.patch(`/categories/${id}`, { name: editName.trim() });
      setEditId(null); load();
    } catch {} finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch {}
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage medicine categories</p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <input
            autoFocus
            type="text"
            placeholder="Category name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500"
          />
          <button onClick={handleAdd} disabled={saving}
            className="flex items-center gap-1 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50">
            <Check className="h-4 w-4" /> Save
          </button>
          <button onClick={() => { setAdding(false); setNewName(''); }}
            className="p-2 rounded-lg hover:bg-indigo-100 transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                {editId === cat.id ? (
                  <div className="flex items-center gap-3 flex-1">
                    <input autoFocus type="text" value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id)}
                      className="border border-indigo-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-indigo-500 flex-1 max-w-xs"
                    />
                    <button onClick={() => handleEdit(cat.id)} disabled={saving}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Save</button>
                    <button onClick={() => setEditId(null)}
                      className="text-xs font-semibold text-gray-400 hover:text-gray-600">Cancel</button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-gray-900">{cat.name}</span>
                    <span className="text-xs text-gray-400">/{cat.slug}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {cat.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }}
                    className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {categories.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No categories yet</div>}
          </div>
        )}
      </div>
    </div>
  );
}