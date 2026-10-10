import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await productAPI.getAllAdmin({ page, limit: 15, search });
      setProducts(res.data.products || []);
      setPagination(res.data.pagination || {});
    } catch (e) { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [page, search]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    setDeleting(id);
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      fetchProducts();
    } catch (err) { toast.error('Failed to delete'); }
    finally { setDeleting(null); }
  };

  const handleToggleActive = async (product) => {
    try {
      await productAPI.update(product._id, { isActive: !product.isActive });
      setProducts(prev => prev.map(p => p._id === product._id ? { ...p, isActive: !p.isActive } : p));
      toast.success(`Product ${product.isActive ? 'deactivated' : 'activated'}`);
    } catch (err) { toast.error('Failed'); }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
        <Link to="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <span>+</span> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-3">
        <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search products by name..."
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
        <span className="text-sm text-gray-500 self-center whitespace-nowrap">{pagination.total || 0} products</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-16 rounded-xl shimmer-bg" />)}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">No products found</p>
            <Link to="/admin/products/new" className="btn-primary mt-4 inline-block text-sm py-2 px-5">Add First Product</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(product => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'} alt={product.name}
                          className="w-11 h-13 object-cover rounded-xl flex-shrink-0" style={{ height: '52px' }}
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=80'} />
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 text-sm line-clamp-1">{product.name}</p>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {product.isFeatured && <span className="text-xs bg-rose-50 text-rose-500 px-1.5 py-0.5 rounded">Featured</span>}
                            {product.isNewArrival && <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">New</span>}
                            {product.isBestSeller && <span className="text-xs bg-yellow-50 text-yellow-600 px-1.5 py-0.5 rounded">Best</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">{product.category?.name || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="text-sm font-semibold text-gray-900">₹{product.price}</div>
                      {product.mrp > product.price && <div className="text-xs text-gray-400 line-through">₹{product.mrp}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock < 5 ? 'bg-red-100 text-red-600' : product.stock < 20 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleToggleActive(product)}
                        className={`relative w-10 h-5 rounded-full transition-colors ${product.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${product.isActive ? 'left-5' : 'left-0.5'}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/admin/products/edit/${product._id}`}
                          className="text-xs bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 font-medium transition-colors">Edit</Link>
                        <button onClick={() => handleDelete(product._id, product.name)} disabled={deleting === product._id}
                          className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 font-medium transition-colors disabled:opacity-50">
                          {deleting === product._id ? '...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${page === i + 1 ? 'bg-rose-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-400'}`}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
