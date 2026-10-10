import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const StarRating = ({ rating, size = 'sm' }) => {
  const s = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className={`${s} ${i <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();

  const wishlisted = isWishlisted(product._id);
  const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
  const defaultSize = product.sizes?.find(s => s.stock > 0)?.size;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    if (!defaultSize) { toast.error('Out of stock'); return; }
    try {
      await addToCart(product._id, defaultSize, '', 1);
      toast.success('Added to cart! 🛍️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to save to wishlist'); return; }
    try {
      const res = await toggle(product._id);
      toast.success(res.message);
    } catch (err) {
      toast.error('Failed to update wishlist');
    }
  };

  const imageUrl = product.images?.[0]?.url || `https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400`;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden card-hover border border-gray-100">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-gray-50 product-img-wrap">
          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }} />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discount > 0 && <span className="bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">{discount}% OFF</span>}
            {product.isNewArrival && <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">NEW</span>}
            {product.isBestSeller && <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">🔥 Best Seller</span>}
          </div>

          {/* Wishlist button */}
          <button onClick={handleWishlist} className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${wishlisted ? 'bg-rose-600 text-white' : 'bg-white text-gray-400 hover:text-rose-600 opacity-0 group-hover:opacity-100'}`}>
            <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>

          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button onClick={handleAddToCart} className="w-full bg-rose-600 text-white py-2.5 text-sm font-medium hover:bg-rose-700 transition-colors">
              {product.stock > 0 ? '+ Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-rose-500 font-medium mb-0.5">{product.category?.name}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 font-body mb-1">{product.name}</h3>
          <div className="flex items-center gap-1 mb-2">
            <StarRating rating={product.rating || 0} />
            <span className="text-xs text-gray-500">({product.numReviews || 0})</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">₹{product.price}</span>
            {product.mrp > product.price && <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export { StarRating };
export default ProductCard;
