import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../utils/api';
import ProductCard from '../components/common/ProductCard';

const WishlistPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistAPI.get()
      .then(res => setProducts(res.data.wishlist?.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl shimmer-bg" />)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
      <p className="text-gray-500 mb-8">{products.length} saved items</p>

      {products.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-7xl mb-4">🤍</div>
          <h2 className="font-display text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6">Save your favourite products here</p>
          <Link to="/collection" className="btn-primary">Browse Collection</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
