import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import StatCards from '../../components/common/StateCards'
import RevenueChart from '../../components/common/RevenueChart';
import MonthlyAnalytics from '../../components/common/MonthlyAnalytics';
import OrdersPanel from '../../components/common/OrdersPanel';
import TopProducts from '../../components/common/TopProducts';
import QuickActions from '../../components/common/QuickActions';

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Shimmer = ({ h = 'h-32' }) => <div className={`${h} rounded-2xl bg-gray-100 animate-pulse`} />;

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <Shimmer key={i} />)}
      </div>
      <Shimmer h="h-64" />
      <Shimmer h="h-72" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Shimmer h="h-56" />
        <Shimmer h="h-56" />
        <Shimmer h="h-56" />
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-64 text-center">
      <div>
        <div className="text-4xl mb-3">⚠️</div>
        <p className="text-gray-600 font-medium">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-4 text-sm text-rose-600 underline">Retry</button>
      </div>
    </div>
  );

  const {
    stats = {},
    monthlySales = [],
    ordersByStatus = [],
    recentOrders = [],
    topProducts = [],
  } = data || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* 1. Key metrics */}
      <StatCards stats={stats} monthlySales={monthlySales} />

      {/* 2. Revenue / Orders / Profit bar chart with period filter */}
      {/* <RevenueChart monthlySales={monthlySales} /> */}

      {/* 3. Monthly analytics — click any month to see details + sparklines */}
      <MonthlyAnalytics monthlySales={monthlySales} />

      {/* 4. Recent orders table + status breakdown */}
      {/* <OrdersPanel recentOrders={recentOrders} ordersByStatus={ordersByStatus} /> */}

      {/* 5. Top products + quick actions side by side */}

      <TopProducts topProducts={topProducts} />
      <QuickActions />

    </div>
  );
};

export default AdminDashboard;