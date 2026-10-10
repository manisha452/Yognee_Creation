import React from 'react';

const StatCard = ({ icon, label, value, sub, subColor = 'text-green-600', color }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    {/* <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>
      {icon}
    </div> */}
    <div className="text-sm text-gray-500 mt-0.5">{label}</div>
    <div className="text-sm font-bold text-gray-900">{value}</div>
    {sub && <div className={`text-xs mt-1 font-medium ${subColor}`}>{sub}</div>}
  </div>
);

const StatCards = ({ stats = {}, monthlySales = [] }) => {
  const totalRevenue    = stats.totalRevenue || 0;
  const estimatedProfit = Math.round(totalRevenue * 0.3);
  const avgOrderValue   = stats.totalOrders > 0 ? Math.round(totalRevenue / stats.totalOrders) : 0;

  // MoM growth from last 2 months
  const lastTwo  = monthlySales.slice(-2);
  const momGrowth = lastTwo.length === 2 && lastTwo[0].revenue > 0
    ? (((lastTwo[1].revenue - lastTwo[0].revenue) / lastTwo[0].revenue) * 100).toFixed(1)
    : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Revenue" 
        value={`₹${totalRevenue.toLocaleString()}`}
        sub={momGrowth !== null ? `${momGrowth >= 0 ? '↑' : '↓'} ${Math.abs(momGrowth)}% vs last month` : 'No previous data'}
        subColor={momGrowth >= 0 ? 'text-green-600' : 'text-red-500'}
      />
      <StatCard
        label="Est. Profit (30%)" 
        value={`₹${estimatedProfit.toLocaleString()}`}
        sub="Based on 30% margin"
        subColor="text-emerald-600"
      />
      <StatCard
        label="Total Orders" 
        value={stats.totalOrders || 0}
        sub={`Avg ₹${avgOrderValue.toLocaleString()} / order`}
        subColor="text-blue-600"
      />
      <StatCard
        label="Products Live" 
        value={stats.totalProducts || 0}
        sub={`${stats.totalUsers || 0} customers`}
        subColor="text-rose-600"
      />
    </div>
  );
};

export default StatCards;