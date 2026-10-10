import React from 'react';
import { Link } from 'react-router-dom';

const TopProducts = ({ topProducts = [] }) => (
  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <h2 className="font-semibold text-gray-800">Top Products</h2>
      <Link to="/admin/products" className="text-xs text-rose-600 hover:underline">Manage →</Link>
    </div>
    {topProducts.length === 0 ? (
      <p className="text-sm text-gray-300 text-center py-8">No sales yet</p>
    ) : (
      <div className="space-y-3">
        {topProducts.map((p, i) => (
          <div key={p._id} className="flex items-center gap-3">
            <span className="text-xs text-gray-300 font-bold w-4 flex-shrink-0">{i + 1}</span>
            <img
              src={p.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60'}
              alt={p.name}
              className="w-10 h-12 object-cover rounded-lg flex-shrink-0"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=60'; }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{p.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.sold} sold · ₹{p.price}</p>
              <div className="mt-1 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-300 rounded-full"
                  style={{ width: `${Math.min((p.sold / (topProducts[0]?.sold || 1)) * 100, 100)}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default TopProducts;