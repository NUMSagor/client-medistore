// 'use client';

// import { useState, useEffect, use } from 'react';
// import { useAuth } from '@/app/provider/AuthProvider';
// import { User, Mail, Lock, Phone, Check, Pencil, ArrowLeft } from 'lucide-react';
// import api from '@/lib/api';

// type Mode = 'view' | 'edit-info' | 'edit-password';

// export default function ProfileForm() {
//   const { user,loading } = useAuth();
//   const [mode, setMode] = useState<Mode>('view');

//   if (loading) return (
//   <div className="flex items-center justify-center py-20">
//     <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
//   </div>
// );

// if (!user) return null;

//   // const [form, setForm] = useState({
//   //   name:            user?.name     ?? '',
//   //   email:           user?.email    ?? '',
//   //   phone:           user?.phone    ?? '',
//   //   role:            user?.role     ?? 'CUSTOMER',
//   //   currentPassword: user?.password ?? '',
//   //   newPassword:     '',
//   //   confirmPassword: '',
//   // });

//   // useEffect(() => {
//   //   if (user) {
//   //     setForm((prev) => ({
//   //       ...prev,
//   //       name:  user.name  ?? '',
//   //       email: user.email ?? '',
//   //       phone: user.phone ?? '',
//   //       currentPassword: user.password ?? '',
//   //     }));
//   //   }
//   // }, [user]);


// // ✅ fix both useState and useEffect
// const [form, setForm] = useState<{
//   name: string;
//   email: string;
//   phone: string;
//   role: 'ADMIN' | 'SELLER' | 'CUSTOMER';
//   currentPassword: string;
//   newPassword: string;
//   confirmPassword: string;
// }>({
//   name:            '',
//   email:           '',
//   phone:           '',
//   role:            'CUSTOMER',
//   currentPassword: '',
//   newPassword:     '',
//   confirmPassword: '',
// });

// useEffect(() => {
//   if (user) {
//     setForm((prev) => ({
//       ...prev,
//       name:  user.name  ?? '',
//       email: user.email ?? '',
//       phone: user.phone ?? '',
//       role:  user.role  ?? 'CUSTOMER',
      
//     }));
//   }
// }, [user]);




//   const [savingInfo, setSavingInfo] = useState(false);
//   const [savingPass, setSavingPass] = useState(false);
//   const [infoSuccess, setInfoSuccess] = useState(false);
//   const [passSuccess, setPassSuccess] = useState(false);
//   const [infoError, setInfoError] = useState('');
//   const [passError, setPassError] = useState('');

//   const f = (k: keyof typeof form) =>
//     (e: React.ChangeEvent<HTMLInputElement>) =>
//       setForm((prev) => ({ ...prev, [k]: e.target.value }));

//   const handleSaveInfo = async () => {
//     setSavingInfo(true); setInfoError(''); setInfoSuccess(false);
//     try {
//       await api.patch('/users/profile', { name: form.name, email: form.email});
//       setInfoSuccess(true);
//       setTimeout(() => { setInfoSuccess(false); setMode('view'); }, 1500);
//     } catch (err: any) {
//       setInfoError(err.response?.data?.message || 'Failed to update profile');
//     } finally { setSavingInfo(false); }
//   };

//   const handleChangePassword = async () => {
//     setPassError(''); setPassSuccess(false);
//     if (!form.newPassword || !form.currentPassword) return setPassError('Please fill in all fields');
//     if (form.newPassword !== form.confirmPassword) return setPassError('New passwords do not match');
//     if (form.newPassword.length < 6) return setPassError('Password must be at least 6 characters');
//     setSavingPass(true);
//     try {
//       await api.patch('/users/password', {
//         currentPassword: form.currentPassword,
//         newPassword: form.newPassword,
//       });
//       setPassSuccess(true);
//       setForm((p) => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }));
//       setTimeout(() => { setPassSuccess(false); setMode('view'); }, 1500);
//     } catch (err: any) {
//       setPassError(err.response?.data?.message || 'Failed to change password');
//     } finally { setSavingPass(false); }
//   };

//   // ── Avatar ──────────────────────────────────────────────────────────────
//   const Avatar = () => (
//     <div className="w-20 h-20 rounded-full bg-linear-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
//       {user?.name?.charAt(0).toUpperCase()}
//     </div>
//   );

//   // ── VIEW MODE ────────────────────────────────────────────────────────────
//   if (mode === 'view') return (
//     <div className="max-w-2xl">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
//         <p className="text-sm text-gray-500 mt-1">Your account details</p>
//       </div>

//       {/* Profile card */}
//       <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
//         <div className="flex items-center gap-5 mb-6">
//           <Avatar />
//           <div>
//             <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
//             <p className="text-sm text-gray-500">{user?.email}</p>
//             <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1 inline-block">
//               {user?.role}
//             </span>
//           </div>
//         </div>

//         {/* Details */}
//         <div className="divide-y divide-gray-100">
//           <div className="flex items-center gap-3 py-3">
//             <User className="h-4 w-4 text-gray-400 shrink-0" />
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Full Name</p>
//               <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 py-3">
//             <Mail className="h-4 w-4 text-gray-400 shrink-0" />
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Email Address</p>
//               <p className="text-sm font-semibold text-gray-900">{user?.email}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 py-3">
//             <Phone className="h-4 w-4 text-gray-400 shrink-0" />
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Phone Number</p>
//               <p className="text-sm font-semibold text-gray-900">{form.phone || '—'}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3 py-3">
//             <Lock className="h-4 w-4 text-gray-400 shrink-0" />
//             <div>
//               <p className="text-xs text-gray-400 font-medium">Password</p>
//               <p className="text-sm font-semibold text-gray-900">••••••••</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Action buttons */}
//       <div className="flex gap-3">
//         <button
//           onClick={() => setMode('edit-info')}
//           className="flex items-center gap-2 flex-1 justify-center bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm"
//         >
//           <Pencil className="h-4 w-4" /> Edit Profile
//         </button>
//         <button
//           onClick={() => setMode('edit-password')}
//           className="flex items-center gap-2 flex-1 justify-center border bg-linear-to-r from-pink-700 to-indigo-700 text-white font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm"
//         >
//           <Lock className="h-4 w-4" /> Change Password
//         </button>
//       </div>
//     </div>
//   );

//   // ── EDIT INFO MODE ───────────────────────────────────────────────────────
//   if (mode === 'edit-info') return (
//     <div className="max-w-2xl ">
//       <button onClick={() => setMode('view')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
//         <ArrowLeft className="h-4 w-4" /> Back to Profile
//       </button>

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
//         <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
//       </div>

//       <div className="bg- border border-gray-200 rounded-xl p-6">
//         <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
//           <Avatar />
//           <div>
//             <p className="font-semibold text-gray-900">{user?.name}</p>
//             <p className="text-sm text-gray-400">{user?.email}</p>
//           </div>
//         </div>

//         <div className="flex flex-col gap-4">
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
//             <input type="text" value={form.name} onChange={f('name')} placeholder="Your name"
//               className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               <input type="email" value={form.email} onChange={f('email')} placeholder="your@email.com"
//                 className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
//             </div>
//           </div>
//           <div>
//             <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
//             <div className="relative">
//               <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
//               <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+1 234 567 8900"
//                 className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
//             </div>
//           </div>

//           {infoError && <p className="text-sm text-red-500">{infoError}</p>}

//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setMode('view')}
//               className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//               Cancel
//             </button>
//             <button onClick={handleSaveInfo} disabled={savingInfo}
//               className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity text-sm">
//               {savingInfo ? (
//                 <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               ) : infoSuccess ? (
//                 <><Check className="h-4 w-4" /> Saved!</>
//               ) : 'Save Changes'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   // ── EDIT PASSWORD MODE ───────────────────────────────────────────────────
//   return (
//     <div className="max-w-2xl">
//       <button onClick={() => setMode('view')}
//         className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
//         <ArrowLeft className="h-4 w-4" /> Back to Profile
//       </button>

//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
//         <p className="text-sm text-gray-500 mt-1">Keep your account secure</p>
//       </div>

//       <div className="bg-white border border-gray-200 rounded-xl p-6">
//         <div className="flex flex-col gap-4">
//           {[
//             { label: 'Current Password', key: 'currentPassword', placeholder: '••••••••' },
//             { label: 'New Password', key: 'newPassword', placeholder: '••••••••' },
//             { label: 'Confirm Password', key: 'confirmPassword', placeholder: '••••••••' },
//           ].map(({ label, key, placeholder }) => (
//             <div key={key}>
//               <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
//               <input type="password" value={form[key as keyof typeof form]}
//                 onChange={f(key as keyof typeof form)} placeholder={placeholder}
//                 className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
//             </div>
//           ))}

//           {passError && <p className="text-sm text-red-500">{passError}</p>}

//           <div className="flex gap-3 pt-2">
//             <button onClick={() => setMode('view')}
//               className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
//               Cancel
//             </button>
//             <button onClick={handleChangePassword} disabled={savingPass}
//               className="flex-1 flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity text-sm">
//               {savingPass ? (
//                 <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//               ) : passSuccess ? (
//                 <><Check className="h-4 w-4" /> Updated!</>
//               ) : 'Update Password'}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/app/provider/AuthProvider';
import { User, Mail, Lock, Phone, Check, Pencil, ArrowLeft } from 'lucide-react';
import api from '@/lib/api';

type Mode = 'view' | 'edit-info' | 'edit-password';

export default function ProfileForm() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<Mode>('view');

  // ✅ ALL hooks must be declared BEFORE any early returns
  const [form, setForm] = useState({
    name:            '',
    email:           '',
    phone:           '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });

  const [savingInfo,  setSavingInfo]  = useState(false);
  const [savingPass,  setSavingPass]  = useState(false);
  const [infoSuccess, setInfoSuccess] = useState(false);
  const [passSuccess, setPassSuccess] = useState(false);
  const [infoError,   setInfoError]   = useState('');
  const [passError,   setPassError]   = useState('');

  // ✅ Populate form once user loads
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name:  user.name  ?? '',
        email: user.email ?? '',
      }));
    }
  }, [user]);

  // ✅ Early returns AFTER all hooks
  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return null;

  const f = (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const handleSaveInfo = async () => {
    setSavingInfo(true); setInfoError(''); setInfoSuccess(false);
    try {
      await api.patch('/users/profile', { name: form.name, email: form.email, phone: form.phone });
      setInfoSuccess(true);
      setTimeout(() => { setInfoSuccess(false); setMode('view'); }, 1500);
    } catch (err: any) {
      setInfoError(err.response?.data?.message || 'Failed to update profile');
    } finally { setSavingInfo(false); }
  };

  const handleChangePassword = async () => {
    setPassError(''); setPassSuccess(false);
    if (!form.newPassword || !form.currentPassword) return setPassError('Please fill in all fields');
    if (form.newPassword !== form.confirmPassword)  return setPassError('New passwords do not match');
    if (form.newPassword.length < 6)                return setPassError('Password must be at least 6 characters');
    setSavingPass(true);
    try {
      await api.patch('/users/password', {
        currentPassword: form.currentPassword,
        newPassword:     form.newPassword,
      });
      setPassSuccess(true);
      setForm((p) => ({ ...p, currentPassword: '', newPassword: '', confirmPassword: '' }));
      setTimeout(() => { setPassSuccess(false); setMode('view'); }, 1500);
    } catch (err: any) {
      setPassError(err.response?.data?.message || 'Failed to change password');
    } finally { setSavingPass(false); }
  };

  const Avatar = () => (
    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-pink-600 flex items-center justify-center text-white text-3xl font-bold shrink-0">
      {user.name?.charAt(0).toUpperCase()}
    </div>
  );

  // ── VIEW MODE ─────────────────────────────────────────────────────────────
  if (mode === 'view') return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Your account details</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
        <div className="flex items-center gap-5 mb-6">
          <Avatar />
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 mt-1 inline-block">
              {user.role}
            </span>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="flex items-center gap-3 py-3">
            <User className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Mail className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Email Address</p>
              <p className="text-sm font-semibold text-gray-900">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Phone className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Phone Number</p>
              <p className="text-sm font-semibold text-gray-900">{form.phone || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-3">
            <Lock className="h-4 w-4 text-gray-400 shrink-0" />
            <div>
              <p className="text-xs text-gray-400 font-medium">Password</p>
              <p className="text-sm font-semibold text-gray-900">••••••••</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={() => setMode('edit-info')}
          className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity text-sm">
          <Pencil className="h-4 w-4" /> Edit Profile
        </button>
        <button onClick={() => setMode('edit-password')}
          className="flex items-center gap-2 flex-1 justify-center border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          <Lock className="h-4 w-4" /> Change Password
        </button>
      </div>
    </div>
  );

  // ── EDIT INFO MODE ────────────────────────────────────────────────────────
  if (mode === 'edit-info') return (
    <div className="max-w-2xl">
      <button onClick={() => setMode('view')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
          <Avatar />
          <div>
            <p className="font-semibold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
            <input type="text" value={form.name} onChange={f('name')} placeholder="Your name"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="email" value={form.email} onChange={f('email')} placeholder="your@email.com"
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+1 234 567 8900"
                className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
          </div>
          {infoError && <p className="text-sm text-red-500">{infoError}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setMode('view')}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button onClick={handleSaveInfo} disabled={savingInfo}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity text-sm">
              {savingInfo
                ? <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : infoSuccess ? <><Check className="h-4 w-4" /> Saved!</>
                : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── EDIT PASSWORD MODE ────────────────────────────────────────────────────
  return (
    <div className="max-w-2xl">
      <button onClick={() => setMode('view')}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-5">
        <ArrowLeft className="h-4 w-4" /> Back to Profile
      </button>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Change Password</h1>
        <p className="text-sm text-gray-500 mt-1">Keep your account secure</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex flex-col gap-4">
          {[
            { label: 'Current Password', key: 'currentPassword', placeholder: '••••••••' },
            { label: 'New Password',     key: 'newPassword',     placeholder: '••••••••' },
            { label: 'Confirm Password', key: 'confirmPassword', placeholder: '••••••••' },
          ].map(({ label, key, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
              <input type="password" value={form[key as keyof typeof form]}
                onChange={f(key as keyof typeof form)} placeholder={placeholder}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-indigo-500 transition-colors" />
            </div>
          ))}
          {passError && <p className="text-sm text-red-500">{passError}</p>}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setMode('view')}
              className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button onClick={handleChangePassword} disabled={savingPass}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-700 text-white font-semibold py-2.5 rounded-lg hover:opacity-90 disabled:opacity-60 transition-opacity text-sm">
              {savingPass
                ? <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : passSuccess ? <><Check className="h-4 w-4" /> Updated!</>
                : 'Update Password'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}