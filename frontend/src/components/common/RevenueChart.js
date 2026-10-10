import React, { useState } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const BarChart = ({ data, valueKey, color, prefix = '₹', suffix = '' }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div className="flex items-end gap-2 h-40 mt-2">
      {data.map((d, i) => {
        const pct = ((d[valueKey] || 0) / max) * 100;
        const val = d[valueKey] || 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {/* Tooltip */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
              {prefix}{val >= 1000 ? `${(val/1000).toFixed(1)}k` : val}{suffix}
            </div>
            <div
              className="w-full rounded-t-lg transition-all duration-300 cursor-pointer"
              style={{ height: `${Math.max(pct, 2)}%`, background: color, opacity: 0.8 }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.8}
            />
            <span className="text-[10px] text-gray-400 truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
};

const RevenueChart = ({ monthlySales = [] }) => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [period, setPeriod]       = useState('6m');

  const labelled = monthlySales.map(m => ({
    ...m,
    label:   MONTHS[((m._id?.month ?? m.month ?? 1) - 1)],
    revenue: m.revenue || 0,
    orders:  m.orders  || m.count || 0,
    profit:  Math.round((m.revenue || 0) * 0.3),
  }));

  const periodSlice = { '3m': 3, '6m': 6, '1y': 12 };
  const filtered = labelled.slice(-(periodSlice[period] || 6));

  const tabs = [
    { key: 'revenue', label: 'Revenue',  color: '#f43f5e', valueKey: 'revenue', prefix: '₹' },
    { key: 'profit',  label: 'Profit',   color: '#10b981', valueKey: 'profit',  prefix: '₹' },
    { key: 'orders',  label: 'Orders',   color: '#6366f1', valueKey: 'orders',  prefix: '', suffix: ' orders' },
  ];

  const active = tabs.find(t => t.key === activeTab);
  const total  = filtered.reduce((a, m) => a + (m[active.valueKey] || 0), 0);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="font-semibold text-gray-800">Revenue & Growth</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {active.label} total: {active.prefix}{total >= 1000 ? `${(total/1000).toFixed(1)}k` : total}{active.suffix || ''}
          </p>
        </div>
        <div className="flex gap-2">
          {/* Tab switcher */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {tabs.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${activeTab === t.key ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {/* Period switcher */}
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {[['3m','3M'],['6m','6M'],['1y','1Y']].map(([v,l]) => (
              <button key={v} onClick={() => setPeriod(v)}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${period === v ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0
        ? <BarChart data={filtered} valueKey={active.valueKey} color={active.color} prefix={active.prefix} suffix={active.suffix} />
        : <div className="h-40 flex items-center justify-center text-gray-300 text-sm">No data yet</div>
      }
    </div>
  );
};

export default RevenueChart;