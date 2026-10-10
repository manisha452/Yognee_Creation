// // // import React, { useState } from 'react';

// // // const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// // // const Sparkline = ({ data, color = '#10b981' }) => {
// // //   if (data.length < 2) return null;
// // //   const max   = Math.max(...data, 1);
// // //   const min   = Math.min(...data, 0);
// // //   const range = max - min || 1;
// // //   const W = 300, H = 60;
// // //   const pts = data.map((v, i) => {
// // //     const x = (i / (data.length - 1)) * W;
// // //     const y = H - ((v - min) / range) * (H - 8) - 4;
// // //     return `${x},${y}`;
// // //   }).join(' ');
// // //   const area = `0,${H} ${pts} ${W},${H}`;
// // //   return (
// // //     <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-12" preserveAspectRatio="none">
// // //       <defs>
// // //         <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
// // //           <stop offset="0%" stopColor={color} stopOpacity="0.3" />
// // //           <stop offset="100%" stopColor={color} stopOpacity="0" />
// // //         </linearGradient>
// // //       </defs>
// // //       <polygon points={area} fill="url(#sg)" />
// // //       <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// // //     </svg>
// // //   );
// // // };

// // // const MonthlyAnalytics = ({ monthlySales = [] }) => {
// // //   const labelled = monthlySales.map((m, i) => {
// // //     const prev    = monthlySales[i - 1];
// // //     const revenue = m.revenue || 0;
// // //     const orders  = m.orders  || m.count || 0;
// // //     const profit  = Math.round(revenue * 0.3);
// // //     const growth  = prev && prev.revenue > 0
// // //       ? (((revenue - prev.revenue) / prev.revenue) * 100).toFixed(1)
// // //       : null;
// // //     return {
// // //       label: MONTHS[((m._id?.month ?? m.month ?? 1) - 1)],
// // //       year:  m._id?.year ?? m.year ?? '',
// // //       revenue, orders, profit, growth,
// // //     };
// // //   });

// // //   // Selected month detail
// // //   const [selectedIdx, setSelectedIdx] = useState(labelled.length - 1);
// // //   const selected = labelled[selectedIdx] || {};

// // //   const revenueVals = labelled.map(m => m.revenue);
// // //   const profitVals  = labelled.map(m => m.profit);

// // //   return (
// // //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
// // //       <div className="p-5 border-b border-gray-50">
// // //         <h2 className="font-semibold text-gray-800">Monthly Analytics</h2>
// // //         <p className="text-xs text-gray-400 mt-0.5">Click any month to view detailed stats</p>
// // //       </div>

// // //       <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">

// // //         {/* Month picker list */}
// // //         <div className="overflow-y-auto max-h-72 lg:max-h-none">
// // //           {labelled.length === 0 && (
// // //             <p className="text-sm text-gray-300 text-center py-8">No data yet</p>
// // //           )}
// // //           {labelled.map((m, i) => (
// // //             <button key={i} onClick={() => setSelectedIdx(i)}
// // //               className={`w-full flex items-center justify-between px-5 py-3 text-left transition-colors border-b border-gray-50 last:border-0 ${selectedIdx === i ? 'bg-rose-50' : 'hover:bg-gray-50'}`}>
// // //               <div className="flex items-center gap-3">
// // //                 <span className={`text-sm font-semibold ${selectedIdx === i ? 'text-rose-600' : 'text-gray-700'}`}>{m.label} {m.year}</span>
// // //                 {m.growth !== null && (
// // //                   <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${parseFloat(m.growth) >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
// // //                     {parseFloat(m.growth) >= 0 ? '↑' : '↓'}{Math.abs(m.growth)}%
// // //                   </span>
// // //                 )}
// // //               </div>
// // //               <span className="text-sm font-bold text-gray-900">₹{m.revenue.toLocaleString()}</span>
// // //             </button>
// // //           ))}
// // //         </div>

// // //         {/* Selected month detail */}
// // //         <div className="p-5 lg:col-span-2">
// // //           {selected.label ? (
// // //             <>
// // //               <div className="flex items-center justify-between mb-4">
// // //                 <h3 className="font-semibold text-gray-900 text-lg">{selected.label} {selected.year}</h3>
// // //                 {selected.growth !== null && (
// // //                   <span className={`text-sm font-semibold px-3 py-1 rounded-full ${parseFloat(selected.growth) >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
// // //                     {parseFloat(selected.growth) >= 0 ? '↑' : '↓'} {Math.abs(selected.growth)}% vs prev month
// // //                   </span>
// // //                 )}
// // //               </div>

// // //               {/* 3 metric cards */}
// // //               <div className="grid grid-cols-3 gap-3 mb-5">
// // //                 {[
// // //                   { label: 'Revenue',  value: `₹${selected.revenue.toLocaleString()}`, color: 'bg-rose-50  text-rose-600'   },
// // //                   { label: 'Profit',   value: `₹${selected.profit.toLocaleString()}`,  color: 'bg-green-50 text-green-600'  },
// // //                   { label: 'Orders',   value: selected.orders,                          color: 'bg-blue-50  text-blue-600'   },
// // //                 ].map(card => (
// // //                   <div key={card.label} className={`rounded-xl p-3 text-center ${card.color}`}>
// // //                     <div className="text-lg font-bold">{card.value}</div>
// // //                     <div className="text-xs font-medium opacity-75 mt-0.5">{card.label}</div>
// // //                   </div>
// // //                 ))}
// // //               </div>

// // //               {/* Sparklines */}
// // //               <div className="space-y-3">
// // //                 <div>
// // //                   <div className="flex justify-between text-xs text-gray-400 mb-1">
// // //                     <span>Revenue trend</span>
// // //                     <span>₹{Math.max(...revenueVals).toLocaleString()} peak</span>
// // //                   </div>
// // //                   <Sparkline data={revenueVals} color="#f43f5e" />
// // //                 </div>
// // //                 <div>
// // //                   <div className="flex justify-between text-xs text-gray-400 mb-1">
// // //                     <span>Profit trend</span>
// // //                     <span>₹{Math.max(...profitVals).toLocaleString()} peak</span>
// // //                   </div>
// // //                   <Sparkline data={profitVals} color="#10b981" />
// // //                 </div>
// // //               </div>
// // //             </>
// // //           ) : (
// // //             <div className="h-full flex items-center justify-center text-gray-300 text-sm py-12">
// // //               Select a month to see details
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default MonthlyAnalytics;



// // import React, { useState, useMemo } from 'react';

// // const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// // // Mini bar chart: Sales, Revenue, Profit
// // const BarChart = ({ sales, revenue, profit }) => {
// //   const bars = [
// //     { label: 'Sales',   value: sales,   color: '#d1d5db' },
// //     { label: 'Revenue', value: revenue, color: '#6b7280' },
// //     { label: 'Profit',  value: profit,  color: '#f43f5e' },
// //   ];
// //   const max = Math.max(sales, revenue, profit, 1);
// //   const H = 100; // max bar height in px

// //   return (
// //     <div className="flex items-end gap-3 h-28 px-2">
// //       {bars.map(b => {
// //         const h = Math.max(4, Math.round((b.value / max) * H));
// //         return (
// //           <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
// //             <div
// //               className="w-full rounded-t-md transition-all duration-500"
// //               style={{ height: h, backgroundColor: b.color }}
// //             />
// //             <span
// //               className="text-[10px] font-medium text-gray-500 text-center leading-tight"
// //               style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', height: 52 }}
// //             >
// //               {b.label}
// //             </span>
// //           </div>
// //         );
// //       })}
// //     </div>
// //   );
// // };

// // const MonthlyAnalytics = ({ monthlySales = [] }) => {
// //   // Build a lookup: "YYYY-M" → data
// //   const dataMap = useMemo(() => {
// //     const map = {};
// //     monthlySales.forEach(m => {
// //       const year  = m._id?.year  ?? m.year  ?? new Date().getFullYear();
// //       const month = m._id?.month ?? m.month ?? (new Date().getMonth() + 1);
// //       map[`${year}-${month}`] = m;
// //     });
// //     return map;
// //   }, [monthlySales]);

// //   // Build unique year list from data (plus current year as fallback)
// //   const years = useMemo(() => {
// //     const ys = new Set(monthlySales.map(m => m._id?.year ?? m.year ?? new Date().getFullYear()));
// //     ys.add(new Date().getFullYear());
// //     return [...ys].sort((a, b) => b - a);
// //   }, [monthlySales]);

// //   const now = new Date();
// //   const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1); // 1-12
// //   const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

// //   const key     = `${selectedYear}-${selectedMonth}`;
// //   const raw     = dataMap[key];

// //   const revenue = raw?.revenue ?? 0;
// //   const orders  = raw?.orders  ?? raw?.count ?? 0;
// //   const profit  = Math.round(revenue * 0.3);
// //   const sales   = orders; // treat orders as "sales units" for the bar

// //   // Growth vs prev month
// //   const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
// //   const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
// //   const prevRaw   = dataMap[`${prevYear}-${prevMonth}`];
// //   const prevRev   = prevRaw?.revenue ?? 0;
// //   const growth    = prevRev > 0
// //     ? (((revenue - prevRev) / prevRev) * 100).toFixed(1)
// //     : null;

// //   const isUp = growth !== null && parseFloat(growth) >= 0;

// //   return (
// //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
// //       {/* Header */}
// //       <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-50">
// //         <h2 className="font-semibold text-gray-800 text-sm">Monthly Analytics</h2>

// //         {/* Month + Year selectors */}
// //         <div className="flex items-center gap-2">
// //           <select
// //             value={selectedMonth}
// //             onChange={e => setSelectedMonth(Number(e.target.value))}
// //             className="text-xs font-medium border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
// //           >
// //             {MONTHS.map((m, i) => (
// //               <option key={m} value={i + 1}>{m}</option>
// //             ))}
// //           </select>

// //           <select
// //             value={selectedYear}
// //             onChange={e => setSelectedYear(Number(e.target.value))}
// //             className="text-xs font-medium border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
// //           >
// //             {years.map(y => (
// //               <option key={y} value={y}>{y}</option>
// //             ))}
// //           </select>
// //         </div>
// //       </div>

// //       {/* Body */}
// //       <div className="flex gap-0 divide-x divide-gray-50">

// //         {/* Left — Bar chart */}
// //         <div className="flex flex-col justify-end px-4 pt-4 pb-3 flex-shrink-0" style={{ minWidth: 110 }}>
// //           <p className="text-[11px] font-semibold text-gray-400 mb-3 uppercase tracking-wide">Profit</p>
// //           <BarChart sales={sales} revenue={revenue} profit={profit} />
// //         </div>

// //         {/* Right — Metrics */}
// //         <div className="flex-1 px-5 py-4 flex flex-col justify-center gap-3">

// //           {/* Profit amount */}
// //           <div className="flex items-center justify-between">
// //             <span className="text-xs text-gray-400 font-medium">Profit amount</span>
// //             <span className="text-sm font-bold text-gray-900">₹{profit.toLocaleString()}</span>
// //           </div>

// //           {/* Growth */}
// //           <div className="flex items-center justify-between">
// //             <span className="text-xs text-gray-400 font-medium">vs prev month</span>
// //             {growth !== null ? (
// //               <span className={`text-sm font-bold flex items-center gap-0.5 ${isUp ? 'text-green-600' : 'text-red-500'}`}>
// //                 <span className="text-base leading-none">{isUp ? '↑' : '↓'}</span>
// //                 {Math.abs(growth)}%
// //               </span>
// //             ) : (
// //               <span className="text-xs text-gray-300">—</span>
// //             )}
// //           </div>

// //           <div className="h-px bg-gray-50" />

// //           {/* Revenue */}
// //           <div className="flex items-center justify-between">
// //             <span className="text-xs text-gray-400 font-medium">Revenue</span>
// //             <span className="text-sm font-bold text-gray-700">₹{revenue.toLocaleString()}</span>
// //           </div>

// //           {/* Total sales */}
// //           <div className="flex items-center justify-between">
// //             <span className="text-xs text-gray-400 font-medium">Total sales</span>
// //             <span className="text-sm font-bold text-rose-600 flex items-center gap-0.5">
// //               <span className="text-base leading-none">↑</span>
// //               {orders.toLocaleString()}
// //             </span>
// //           </div>

// //           {/* No data notice */}
// //           {!raw && (
// //             <p className="text-[10px] text-gray-300 mt-1">No data for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
// //           )}
// //         </div>
// //       </div>

// //       {/* Footer label */}
// //       <div className="px-5 pb-3 pt-1 text-[10px] text-gray-300">
// //         {MONTHS[selectedMonth - 1]} {selectedYear}
// //       </div>
// //     </div>
// //   );
// // };

// // export default MonthlyAnalytics;

// import React, { useState, useMemo } from 'react';

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

// const MonthlyAnalytics = ({ monthlySales = [] }) => {
//   const dataMap = useMemo(() => {
//     const map = {};
//     monthlySales.forEach(m => {
//       const year  = m._id?.year  ?? m.year  ?? new Date().getFullYear();
//       const month = m._id?.month ?? m.month ?? (new Date().getMonth() + 1);
//       map[`${year}-${month}`] = m;
//     });
//     return map;
//   }, [monthlySales]);

//   const years = useMemo(() => {
//     const ys = new Set(monthlySales.map(m => m._id?.year ?? m.year ?? new Date().getFullYear()));
//     ys.add(new Date().getFullYear());
//     return [...ys].sort((a, b) => b - a);
//   }, [monthlySales]);

//   const now = new Date();
//   const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
//   const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

//   const key    = `${selectedYear}-${selectedMonth}`;
//   const raw    = dataMap[key];
//   const revenue = raw?.revenue ?? 0;
//   const orders  = raw?.orders  ?? raw?.count ?? 0;
//   const profit  = Math.round(revenue * 0.3);

//   const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
//   const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
//   const prevRaw   = dataMap[`${prevYear}-${prevMonth}`];
//   const prevRev   = prevRaw?.revenue ?? 0;
//   const growth    = prevRev > 0
//     ? (((revenue - prevRev) / prevRev) * 100).toFixed(1)
//     : null;
//   const isUp = growth !== null && parseFloat(growth) >= 0;

//   const metrics = [
//     { label: 'Sales',        value: orders.toLocaleString(),          color: 'text-gray-800' },
//     { label: 'Revenue',      value: `₹${revenue.toLocaleString()}`,   color: 'text-gray-800' },
//     { label: 'Profit',       value: `₹${profit.toLocaleString()}`,    color: 'text-rose-600' },
//   ];

//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden w-full">
//       {/* Header */}
//       <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
//         <h2 className="font-semibold text-gray-800 text-m">Monthly Analytics</h2>
//         <div className="flex items-center gap-2">
//           <select
//             value={selectedMonth}
//             onChange={e => setSelectedMonth(Number(e.target.value))}
//             className="text-xs font-medium border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
//           >
//             {MONTHS.map((m, i) => (
//               <option key={m} value={i + 1}>{m}</option>
//             ))}
//           </select>
//           <select
//             value={selectedYear}
//             onChange={e => setSelectedYear(Number(e.target.value))}
//             className="text-xs font-medium border border-gray-200 rounded-lg px-2 py-1.5 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 cursor-pointer"
//           >
//             {years.map(y => (
//               <option key={y} value={y}>{y}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* Metrics */}
//       <div className="px-5 py-4 flex flex-col gap-3">
//         {metrics.map(m => (
//           <div key={m.label} className="flex items-center justify-between">
//             <span className="text-m text-gray-600 font-medium">{m.label}</span>
//             <span className={`text-sm font-bold ${m.color}`}>{m.value}</span>
//           </div>
//         ))}

//         <div className="h-px bg-gray-100" />

//         {/* Growth */}
//         <div className="flex items-center justify-between">
//           <span className="text-s text-gray-500 font-medium">vs Prev Month</span>
//           {growth !== null ? (
//             <span className={`text-sm font-bold ${isUp ? 'text-green-600' : 'text-red-500'}`}>
//               {isUp ? '↑' : '↓'} {Math.abs(growth)}%
//             </span>
//           ) : (
//             <span className="text-xs text-gray-400">—</span>
//           )}
//         </div>

//         {/* {!raw && (
//           <p className="text-[10px] text-gray-300">No data for {MONTHS[selectedMonth - 1]} {selectedYear}</p>
//         )} */}
//       </div>

//       {/* Footer */}
//       {/* <div className="px-5 pb-3 text-[10px] text-gray-300">
//         {MONTHS[selectedMonth - 1]} {selectedYear}
//       </div> */}
//     </div>
//   );
// };

// export default MonthlyAnalytics;


import React, { useState, useMemo } from 'react';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const MonthlyAnalytics = ({ monthlySales = [] }) => {
  const dataMap = useMemo(() => {
    const map = {};
    monthlySales.forEach(m => {
      const year  = m._id?.year  ?? m.year  ?? new Date().getFullYear();
      const month = m._id?.month ?? m.month ?? (new Date().getMonth() + 1);
      map[`${year}-${month}`] = m;
    });
    return map;
  }, [monthlySales]);

  const years = useMemo(() => {
    const ys = new Set(monthlySales.map(m => m._id?.year ?? m.year ?? new Date().getFullYear()));
    ys.add(new Date().getFullYear());
    return [...ys].sort((a, b) => b - a);
  }, [monthlySales]);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear,  setSelectedYear]  = useState(now.getFullYear());

  const key     = `${selectedYear}-${selectedMonth}`;
  const raw     = dataMap[key];
  const revenue = raw?.revenue ?? 0;
  const orders  = raw?.orders  ?? raw?.count ?? 0;
  const profit  = Math.round(revenue * 0.3);

  // Per-metric growth vs prev month
  const prevMonth = selectedMonth === 1 ? 12 : selectedMonth - 1;
  const prevYear  = selectedMonth === 1 ? selectedYear - 1 : selectedYear;
  const prevRaw   = dataMap[`${prevYear}-${prevMonth}`];
  const prevRevenue = prevRaw?.revenue ?? 0;
  const prevOrders  = prevRaw?.orders ?? prevRaw?.count ?? 0;
  const prevProfit  = Math.round(prevRevenue * 0.3);

  const calcGrowth = (curr, prev) =>
    prev > 0 ? (((curr - prev) / prev) * 100).toFixed(1) : null;

  const metrics = [
    {
      label:  'Sales',
      value:  orders.toLocaleString(),
      growth: calcGrowth(orders, prevOrders),
    },
    {
      label:  'Revenue',
      value:  `₹${revenue.toLocaleString()}`,
      growth: calcGrowth(revenue, prevRevenue),
    },
    {
      label:  'Profit',
      value:  `₹${profit.toLocaleString()}`,
      growth: calcGrowth(profit, prevProfit),
    },
  ];

  const selectCls =
    'text-xs font-semibold border border-blue-300 rounded px-2 py-1 text-blue-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer';

  return (
    <div
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between flex-wrap gap-3 mb-4"
      >
        <h2
          className="font-semibold text-gray-800"
        >
          Monthly Analysis
        </h2>

        <div className="flex items-center gap-3">
          <select
            value={selectedMonth}
            onChange={e => setSelectedMonth(Number(e.target.value))}
            className={selectCls}
          >
            {MONTHS.map((m, i) => (
              <option key={m} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
            className={selectCls}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="px-6 pb-3 text-gray-500 font-semibold">
        {MONTHS[selectedMonth - 1]} {selectedYear}
      </div>

      {/* Body — 3-column grid: label | % change | value */}
      <div className="px-6 py-4 flex flex-col gap-4">
        {metrics.map(m => {
          const g    = m.growth !== null ? parseFloat(m.growth) : null;
          const isUp = g !== null && g >= 0;
          return (
            <div key={m.label} className="grid items-center" style={{ gridTemplateColumns: '120px 100px 1fr' }}>
              {/* Label */}
              <span className="text-sm font-bold" style={{ color: '#7f1d1d' }}>
                {m.label}
              </span>

              {/* % growth */}
              <span
                className="text-sm font-bold flex items-center gap-1"
                style={{ color: g === null ? '#9ca3af' : isUp ? '#15803d' : '#dc2626' }}
              >
                {g !== null ? (
                  <>
                    {Math.abs(m.growth)}%&nbsp;
                    <span className="text-base leading-none">{isUp ? '↑' : '↓'}</span>
                  </>
                ) : '—'}
              </span>

              {/* Digit value */}
              <span
                className="text-sm font-bold text-right text-gray-800"
              >
                {m.value}
              </span>
            </div>
          );
        })}

        {/* {!raw && (
          <p className="text-[10px] mt-1" style={{ color: '#9ca3af' }}>
            No data for {MONTHS[selectedMonth - 1]} {selectedYear}
          </p>
        )} */}
      </div>

      {/* Footer */}
      {/* <div className="px-6 pb-3 text-[10px]" style={{ color: '#9ca3af' }}>
        {MONTHS[selectedMonth - 1]} {selectedYear}
      </div> */}
    </div>
  );
};

export default MonthlyAnalytics;