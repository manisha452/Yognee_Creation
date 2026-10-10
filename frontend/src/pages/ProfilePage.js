import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [addrForm, setAddrForm] = useState({ name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('Profile updated!');
    } catch (err) { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setSaving(false); }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.addAddress(addrForm);
      updateUser({ ...user, addresses: res.data.addresses });
      toast.success('Address added!');
      setAddrForm({ name: '', phone: '', street: '', city: '', state: '', pincode: '', isDefault: false });
    } catch (err) { toast.error('Failed to add address'); }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-8">My Account</h1>

      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-500 rounded-2xl p-6 text-white mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-display font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">{user?.name}</h2>
          <p className="text-rose-100 text-sm">{user?.email}</p>
          {user?.role === 'admin' && <span className="inline-block mt-1 bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 overflow-x-auto">
        {[['profile', '👤 Profile'], ['password', '🔒 Password'], ['addresses', '📍 Addresses']].map(([val, label]) => (
          <button key={val} onClick={() => setTab(val)}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${tab === val ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'profile' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-5">Personal Information</h2>
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" value={user?.email} disabled className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500" />
            </div>
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>
        </div>
      )}

      {tab === 'password' && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-slide-up">
          <h2 className="font-display text-lg font-semibold text-gray-900 mb-5">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
            {[
              { key: 'currentPassword', label: 'Current Password' },
              { key: 'newPassword', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input type="password" value={pwForm[field.key]} onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
              </div>
            ))}
            <button type="submit" disabled={saving} className="btn-primary py-3 px-8 disabled:opacity-50">{saving ? 'Updating...' : 'Update Password'}</button>
          </form>
        </div>
      )}

      {tab === 'addresses' && (
        <div className="space-y-4 animate-slide-up">
          {user?.addresses?.length > 0 && (
            <div className="space-y-3">
              {user.addresses.map((addr, i) => (
                <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{addr.name} · {addr.phone}</p>
                      <p className="text-sm text-gray-600 mt-0.5">{addr.street}, {addr.city}, {addr.state} - {addr.pincode}</p>
                    </div>
                    {addr.isDefault && <span className="bg-rose-100 text-rose-600 text-xs px-2 py-0.5 rounded-full font-medium">Default</span>}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-4">Add New Address</h3>
            <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'name', label: 'Full Name', col: 1 },
                { key: 'phone', label: 'Phone', col: 1 },
                { key: 'street', label: 'Street Address', col: 2 },
                { key: 'city', label: 'City', col: 1 },
                { key: 'state', label: 'State', col: 1 },
                { key: 'pincode', label: 'Pincode', col: 1 },
              ].map(field => (
                <div key={field.key} className={field.col === 2 ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                  <input type="text" value={addrForm[field.key]} onChange={e => setAddrForm(p => ({ ...p, [field.key]: e.target.value }))} required
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
                </div>
              ))}
              <div className="sm:col-span-2 flex items-center gap-2">
                <input type="checkbox" id="default" checked={addrForm.isDefault} onChange={e => setAddrForm(p => ({ ...p, isDefault: e.target.checked }))} className="text-rose-600" />
                <label htmlFor="default" className="text-sm text-gray-700">Set as default address</label>
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-primary py-2.5 px-6">Add Address</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
