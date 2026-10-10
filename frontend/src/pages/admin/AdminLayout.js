import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories'},
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/chat', label: 'Support Chat'},
  { to: '/admin/users', label: 'Users' },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out');
    navigate('/');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center font-display font-bold text-lg">Z</div>
          <div>
            <p className="font-display font-bold text-white leading-tight">YogneeCreation</p>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.to} to={item.to} end={item.end} onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-rose-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-rose-600/20 rounded-full flex items-center justify-center text-rose-400 font-bold text-sm">{user?.name?.charAt(0)}</div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
        </div>
        <NavLink to="/" className="flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors mb-1">
          ← View Store
        </NavLink>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-gray-800 transition-colors">
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-60 flex-col flex-shrink-0 shadow-xl">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 shadow-xl">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-600 hover:text-rose-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">Welcome back, <span className="font-medium text-gray-900">{user?.name}</span> 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <NavLink to="/" className="text-xs text-gray-500 hover:text-rose-600 border border-gray-200 px-3 py-1.5 rounded-full transition-colors">← View Store</NavLink>
            <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-sm">{user?.name?.charAt(0)}</div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
