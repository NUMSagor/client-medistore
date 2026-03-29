'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';
import api from '@/lib/api';

interface Medicine {
  id: string; name: string; genericName: string; price: number;
  discountPercent: number; stock: number; isActive: boolean;
  category: { name: string }; imageUrl?: string;
}
interface Category { id: string; name: string; }

const emptyForm = { name: '', genericName: '', manufacturer: '', description: '', price: '', discountPercent: '0', stock: '', categoryId: '', imageUrl: '' };

export default function SellerMedicinePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState(emptyForm);
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  const load = () => {
    Promise.all([api.get('/seller/medicines'), api.get('/categories')])
      .then(([medsRes, catsRes]) => {
        setMedicines(Array.isArray(medsRes.data) ? medsRes.data : []);
        setCategories(Array.isArray(catsRes.data) ? catsRes.data : []);
      }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowForm(true); setError(''); };
  const openEdit = (m: Medicine) => {
    setForm({ name: m.name, genericName: m.genericName, manufacturer: '', description: '', price: String(m.price), discountPercent: String(m.discountPercent), stock: String(m.stock), categoryId: '', imageUrl: m.imageUrl ?? '' });
    setEditId(m.id); setShowForm(true); setError('');
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      const payload = { ...form, price: Number(form.price), discountPercent: Number(form.discountPercent), stock: Number(form.stock) };
      if (editId) await api.put(`/seller/medicines/${editId}`, payload);
      else await api.post('/seller/medicines', payload);
      setShowForm(false); load();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this medicine?')) return;
    try { await api.delete(`/medicines/${id}`); load(); } catch {}
  };

  const f = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Medicines</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your medicine inventory</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-700 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity">
          <Plus className="h-4 w-4" /> Add Medicine
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="font-bold text-gray-900">{editId ? 'Edit Medicine' : 'Add Medicine'}</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {[
                { label: 'Name', key: 'name', placeholder: 'Amoxicillin 500mg' },
                { label: 'Generic Name', key: 'genericName', placeholder: 'Amoxicillin' },
                { label: 'Manufacturer', key: 'manufacturer', placeholder: 'Pharma Co.' },
                { label: 'Image URL', key: 'imageUrl', placeholder: 'https://...' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                  <input type="text" placeholder={placeholder} value={form[key as keyof typeof emptyForm]} onChange={f(key as keyof typeof emptyForm)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                <textarea rows={3} placeholder="Description..." value={form.description} onChange={f('description')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Price ($)', key: 'price', type: 'number' },
                  { label: 'Discount (%)', key: 'discountPercent', type: 'number' },
                  { label: 'Stock', key: 'stock', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
                    <input type={type} value={form[key as keyof typeof emptyForm]} onChange={f(key as keyof typeof emptyForm)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500" />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                <select value={form.categoryId} onChange={f('categoryId')}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-500 bg-white">
                  <option value="">Select category...</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button onClick={handleSave} disabled={saving}
                className="w-full bg-gradient-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity">
                {saving ? 'Saving...' : editId ? 'Update Medicine' : 'Add Medicine'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  {['Medicine', 'Category', 'Price', 'Discount', 'Stock', 'Actions'].map((h) => (
                    <th key={h} className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {medicines.map((med) => (
                  <tr key={med.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-xs text-gray-400">{med.genericName}</p>
                    </td>
                    <td className="px-6 py-3 text-gray-500">{med.category?.name}</td>
                    <td className="px-6 py-3 font-semibold text-indigo-600">${med.price.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      {med.discountPercent > 0
                        ? <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700">-{med.discountPercent}%</span>
                        : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${med.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {med.stock > 0 ? med.stock : 'Out'}
                      </span>
                    </td>
                    <td className="px-6 py-3 flex items-center gap-2">
                      <button onClick={() => openEdit(med)} className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(med.id)} className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {medicines.length === 0 && <div className="py-12 text-center text-gray-400 text-sm">No medicines yet. Add your first one!</div>}
          </div>
        )}
      </div>
    </div>
  );
}