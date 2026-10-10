// // import React, { useState, useEffect } from 'react';
// // import { useParams, useNavigate, Link } from 'react-router-dom';
// // import { productAPI, reviewAPI } from '../utils/api';
// // import { useCart } from '../context/CartContext';
// // import { useWishlist } from '../context/WishlistContext';
// // import { useAuth } from '../context/AuthContext';
// // import ProductCard from '../components/common/ProductCard';
// // import { StarRating } from '../components/common/ProductCard';
// // import toast from 'react-hot-toast';

// // const ProductPage = () => {
// //   const { slug } = useParams();
// //   const navigate = useNavigate();
// //   const { user } = useAuth();
// //   const { addToCart } = useCart();
// //   const { toggle, isWishlisted } = useWishlist();

// //   const [product, setProduct] = useState(null);
// //   const [related, setRelated] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [selectedSize, setSelectedSize] = useState('');
// //   const [selectedColor, setSelectedColor] = useState('');
// //   const [quantity, setQuantity] = useState(1);
// //   const [activeImage, setActiveImage] = useState(0);
// //   const [addingToCart, setAddingToCart] = useState(false);
// //   const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
// //   const [submittingReview, setSubmittingReview] = useState(false);
// //   const [activeTab, setActiveTab] = useState('description');

// //   useEffect(() => {
// //     window.scrollTo(0, 0);
// //     setLoading(true);
// //     productAPI.getOne(slug)
// //       .then(res => {
// //         setProduct(res.data.product);
// //         const firstAvailable = res.data.product.sizes?.find(s => s.stock > 0);
// //         if (firstAvailable) setSelectedSize(firstAvailable.size);
// //         if (res.data.product.colors?.length > 0) setSelectedColor(res.data.product.colors[0].name);
// //         return productAPI.getRelated(res.data.product._id);
// //       })
// //       .then(res => setRelated(res.data.products || []))
// //       .catch(() => toast.error('Product not found'))
// //       .finally(() => setLoading(false));
// //   }, [slug]);

// //   const handleAddToCart = async () => {
// //     if (!user) { toast.error('Please login to add to cart'); navigate('/login'); return; }
// //     if (!selectedSize) { toast.error('Please select a size'); return; }
// //     setAddingToCart(true);
// //     try {
// //       await addToCart(product._id, selectedSize, selectedColor, quantity);
// //       toast.success('Added to cart! 🛍️');
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to add to cart');
// //     } finally { setAddingToCart(false); }
// //   };

// //   const handleBuyNow = async () => {
// //     await handleAddToCart();
// //     navigate('/cart');
// //   };

// //   const handleWishlist = async () => {
// //     if (!user) { toast.error('Please login'); return; }
// //     try {
// //       const res = await toggle(product._id);
// //       toast.success(res.message);
// //     } catch (err) { toast.error('Failed'); }
// //   };

// //   const handleReviewSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!user) { toast.error('Please login to review'); return; }
// //     if (!reviewData.comment.trim()) { toast.error('Please write a comment'); return; }
// //     setSubmittingReview(true);
// //     try {
// //       const res = await reviewAPI.add(product._id, reviewData);
// //       setProduct(prev => ({ ...prev, reviews: res.data.reviews, rating: res.data.rating, numReviews: res.data.numReviews }));
// //       setReviewData({ rating: 5, comment: '' });
// //       toast.success('Review submitted! ⭐');
// //     } catch (err) {
// //       toast.error(err.response?.data?.message || 'Failed to submit review');
// //     } finally { setSubmittingReview(false); }
// //   };

// //   if (loading) return (
// //     <div className="max-w-7xl mx-auto px-4 py-12">
// //       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //         <div className="space-y-4">
// //           <div className="aspect-square rounded-2xl shimmer-bg" />
// //           <div className="flex gap-3">{[...Array(4)].map((_, i) => <div key={i} className="w-20 h-20 rounded-xl shimmer-bg" />)}</div>
// //         </div>
// //         <div className="space-y-4">{[...Array(6)].map((_, i) => <div key={i} className="h-8 rounded shimmer-bg" />)}</div>
// //       </div>
// //     </div>
// //   );

// //   if (!product) return <div className="text-center py-20"><h2 className="font-display text-2xl">Product not found</h2><Link to="/collection" className="btn-primary mt-4 inline-block">Browse Collection</Link></div>;

// //   const images = product.images?.length > 0 ? product.images : [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600' }];
// //   const discount = product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;
// //   const selectedSizeData = product.sizes?.find(s => s.size === selectedSize);
// //   const wishlisted = isWishlisted(product._id);

// //   return (
// //     <div className="animate-fade-in">
// //       <div className="max-w-7xl mx-auto px-4 py-8">
// //         {/* Breadcrumb */}
// //         <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
// //           <Link to="/" className="hover:text-rose-600">Home</Link>
// //           <span>/</span>
// //           <Link to="/collection" className="hover:text-rose-600">Collection</Link>
// //           <span>/</span>
// //           {product.category && <Link to={`/collection/${product.category.slug}`} className="hover:text-rose-600">{product.category.name}</Link>}
// //           <span>/</span>
// //           <span className="text-gray-800 truncate max-w-xs">{product.name}</span>
// //         </div>

// //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
// //           {/* Images */}
// //           <div>
// //             <div className="relative overflow-hidden rounded-2xl bg-gray-50 aspect-square mb-4">
// //               <img src={images[activeImage]?.url} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300"
// //                 onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'} />
// //               {discount > 0 && <span className="absolute top-4 left-4 bg-rose-600 text-white text-sm px-3 py-1 rounded-full font-medium">{discount}% OFF</span>}
// //               {product.isNewArrival && <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">NEW</span>}
// //             </div>
// //             {images.length > 1 && (
// //               <div className="flex gap-3 overflow-x-auto pb-2">
// //                 {images.map((img, i) => (
// //                   <button key={i} onClick={() => setActiveImage(i)}
// //                     className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${activeImage === i ? 'border-rose-500' : 'border-gray-200 hover:border-rose-300'}`}>
// //                     <img src={img.url} alt="" className="w-full h-full object-cover" onError={e => e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200'} />
// //                   </button>
// //                 ))}
// //               </div>
// //             )}
// //           </div>

// //           {/* Details */}
// //           <div>
// //             <div className="flex items-start justify-between mb-2">
// //               <div>
// //                 {product.category && <Link to={`/collection/${product.category.slug}`} className="text-rose-500 text-sm font-medium hover:text-rose-600">{product.category.icon} {product.category.name}</Link>}
// //                 <h1 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{product.name}</h1>
// //               </div>
// //               <button onClick={handleWishlist} className={`p-2 rounded-full border-2 transition-all ${wishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-400'}`}>
// //                 <svg className="w-5 h-5" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
// //                 </svg>
// //               </button>
// //             </div>

// //             {/* Rating */}
// //             <div className="flex items-center gap-3 mb-4">
// //               <StarRating rating={product.rating} size="md" />
// //               <span className="text-sm text-gray-500">({product.numReviews} reviews)</span>
// //               {product.isBestSeller && <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full font-medium">🔥 Best Seller</span>}
// //             </div>

// //             {/* Price */}
// //             <div className="flex items-baseline gap-3 mb-6">
// //               <span className="font-display text-3xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
// //               {product.mrp > product.price && (
// //                 <>
// //                   <span className="text-lg text-gray-400 line-through">₹{product.mrp.toLocaleString()}</span>
// //                   <span className="text-rose-600 font-semibold text-sm bg-rose-50 px-2 py-0.5 rounded-full">Save ₹{(product.mrp - product.price).toLocaleString()}</span>
// //                 </>
// //               )}
// //             </div>

// //             {/* Short Description */}
// //             {product.shortDescription && <p className="text-gray-600 mb-5 text-sm leading-relaxed">{product.shortDescription}</p>}

// //             {/* Colors */}
// //             {product.colors?.length > 0 && (
// //               <div className="mb-5">
// //                 <p className="text-sm font-medium text-gray-700 mb-2">Color: <span className="text-rose-600">{selectedColor}</span></p>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {product.colors.map(color => (
// //                     <button key={color.name} onClick={() => setSelectedColor(color.name)}
// //                       className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-xs font-medium transition-all ${selectedColor === color.name ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-rose-300'}`}>
// //                       <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.hex }} />
// //                       {color.name}
// //                     </button>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Sizes */}
// //             {product.sizes?.length > 0 && (
// //               <div className="mb-5">
// //                 <div className="flex items-center justify-between mb-2">
// //                   <p className="text-sm font-medium text-gray-700">Size: <span className="text-rose-600">{selectedSize}</span></p>
// //                   <button className="text-xs text-rose-500 hover:underline">Size Guide</button>
// //                 </div>
// //                 <div className="flex gap-2 flex-wrap">
// //                   {product.sizes.map(s => (
// //                     <button key={s.size} onClick={() => s.stock > 0 && setSelectedSize(s.size)} disabled={s.stock === 0}
// //                       className={`w-12 h-12 rounded-xl border-2 text-sm font-medium transition-all ${s.stock === 0 ? 'border-gray-100 text-gray-300 cursor-not-allowed line-through' : selectedSize === s.size ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-gray-200 hover:border-rose-300 text-gray-700'}`}>
// //                       {s.size}
// //                     </button>
// //                   ))}
// //                 </div>
// //                 {selectedSizeData && <p className="text-xs text-gray-500 mt-1">{selectedSizeData.stock} left in stock</p>}
// //               </div>
// //             )}

// //             {/* Quantity */}
// //             <div className="flex items-center gap-4 mb-6">
// //               <span className="text-sm font-medium text-gray-700">Quantity:</span>
// //               <div className="flex items-center gap-2 border border-gray-200 rounded-full px-1">
// //                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:text-rose-600 text-gray-600 text-lg">−</button>
// //                 <span className="w-8 text-center font-medium">{quantity}</span>
// //                 <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 flex items-center justify-center hover:text-rose-600 text-gray-600 text-lg">+</button>
// //               </div>
// //               <span className="text-xs text-gray-400">{product.stock} available</span>
// //             </div>

// //             {/* Action Buttons */}
// //             <div className="flex gap-3 mb-6">
// //               <button onClick={handleAddToCart} disabled={addingToCart || product.stock === 0}
// //                 className="flex-1 btn-primary py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
// //                 {addingToCart ? '⏳ Adding...' : product.stock === 0 ? 'Out of Stock' : '🛍️ Add to Cart'}
// //               </button>
// //               <button onClick={handleBuyNow} disabled={product.stock === 0}
// //                 className="flex-1 btn-outline py-3.5 text-base disabled:opacity-50">
// //                 Buy Now
// //               </button>
// //             </div>

// //             {/* Info pills */}
// //             <div className="flex flex-wrap gap-3 mb-6 text-xs">
// //               {[['🚚', 'Free shipping above ₹999'], ['↩️', product.returnPolicy || '7-day return'], ['🔒', 'Secure payment'], ['✅', '100% Authentic']].map(([icon, text]) => (
// //                 <div key={text} className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-full text-gray-600">
// //                   <span>{icon}</span><span>{text}</span>
// //                 </div>
// //               ))}
// //             </div>

// //             {/* Product details */}
// //             <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
// //               {product.fabric && <div className="flex gap-2"><span className="text-gray-500 w-24">Fabric:</span><span className="font-medium">{product.fabric}</span></div>}
// //               {product.brand && <div className="flex gap-2"><span className="text-gray-500 w-24">Brand:</span><span className="font-medium">{product.brand}</span></div>}
// //               {product.season && <div className="flex gap-2"><span className="text-gray-500 w-24">Season:</span><span className="font-medium capitalize">{product.season}</span></div>}
// //               {product.tags?.length > 0 && <div className="flex gap-2 flex-wrap"><span className="text-gray-500 w-24">Tags:</span>{product.tags.map(t => <span key={t} className="bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full text-xs">{t}</span>)}</div>}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Tabs */}
// //         <div className="mt-12 border-t border-gray-200 pt-8">
// //           <div className="flex gap-6 border-b border-gray-100 mb-6">
// //             {['description', 'reviews', 'care'].map(tab => (
// //               <button key={tab} onClick={() => setActiveTab(tab)}
// //                 className={`pb-3 text-sm font-medium capitalize border-b-2 transition-colors ${activeTab === tab ? 'border-rose-500 text-rose-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
// //                 {tab} {tab === 'reviews' && `(${product.numReviews})`}
// //               </button>
// //             ))}
// //           </div>

// //           {activeTab === 'description' && (
// //             <div className="prose prose-sm max-w-none text-gray-600">
// //               <p className="leading-relaxed">{product.description}</p>
// //             </div>
// //           )}

// //           {activeTab === 'reviews' && (
// //             <div>
// //               {/* Review Summary */}
// //               <div className="flex items-center gap-8 mb-8 p-6 bg-rose-50 rounded-2xl">
// //                 <div className="text-center">
// //                   <div className="font-display text-5xl font-bold text-gray-900">{product.rating?.toFixed(1) || '0.0'}</div>
// //                   <StarRating rating={product.rating} size="md" />
// //                   <p className="text-xs text-gray-500 mt-1">{product.numReviews} reviews</p>
// //                 </div>
// //                 <div className="flex-1">
// //                   {[5,4,3,2,1].map(star => {
// //                     const count = product.reviews?.filter(r => r.rating === star).length || 0;
// //                     const pct = product.numReviews > 0 ? (count / product.numReviews) * 100 : 0;
// //                     return (
// //                       <div key={star} className="flex items-center gap-2 mb-1">
// //                         <span className="text-xs text-gray-500 w-4">{star}</span>
// //                         <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
// //                         <div className="flex-1 bg-gray-200 rounded-full h-1.5"><div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} /></div>
// //                         <span className="text-xs text-gray-500 w-4">{count}</span>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               </div>

// //               {/* Add Review */}
// //               {user && (
// //                 <form onSubmit={handleReviewSubmit} className="mb-8 p-6 border border-gray-200 rounded-2xl">
// //                   <h3 className="font-semibold text-gray-800 mb-4">Write a Review</h3>
// //                   <div className="mb-4">
// //                     <p className="text-sm text-gray-600 mb-2">Rating</p>
// //                     <div className="flex gap-1">
// //                       {[1,2,3,4,5].map(s => (
// //                         <button key={s} type="button" onClick={() => setReviewData(d => ({ ...d, rating: s }))}
// //                           className={`text-2xl transition-transform hover:scale-110 ${s <= reviewData.rating ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                   <textarea value={reviewData.comment} onChange={e => setReviewData(d => ({ ...d, comment: e.target.value }))}
// //                     placeholder="Share your experience with this product..." rows={3}
// //                     className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400 resize-none" />
// //                   <button type="submit" disabled={submittingReview} className="mt-3 btn-primary py-2 px-6 text-sm disabled:opacity-50">
// //                     {submittingReview ? 'Submitting...' : 'Submit Review'}
// //                   </button>
// //                 </form>
// //               )}

// //               {/* Reviews List */}
// //               <div className="space-y-4">
// //                 {product.reviews?.length === 0 && <p className="text-gray-500 text-center py-6">No reviews yet. Be the first to review!</p>}
// //                 {product.reviews?.map(review => (
// //                   <div key={review._id} className="p-4 border border-gray-100 rounded-xl">
// //                     <div className="flex items-start justify-between mb-2">
// //                       <div className="flex items-center gap-2">
// //                         <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-sm">{review.name?.charAt(0)}</div>
// //                         <div>
// //                           <p className="font-medium text-sm text-gray-800">{review.name}</p>
// //                           <p className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
// //                         </div>
// //                       </div>
// //                       <StarRating rating={review.rating} />
// //                     </div>
// //                     <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           )}

// //           {activeTab === 'care' && (
// //             <div className="space-y-3">
// //               {product.careInstructions?.length > 0 ? product.careInstructions.map((inst, i) => (
// //                 <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
// //                   <span className="text-rose-500">•</span>
// //                   <span className="text-sm text-gray-700">{inst}</span>
// //                 </div>
// //               )) : (
// //                 <div className="space-y-2 text-sm text-gray-600">
// //                   {['Machine wash cold with similar colors', 'Do not bleach', 'Tumble dry low', 'Iron on low heat', 'Dry clean if needed'].map(inst => (
// //                     <div key={inst} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
// //                       <span className="text-rose-500">•</span><span>{inst}</span>
// //                     </div>
// //                   ))}
// //                 </div>
// //               )}
// //             </div>
// //           )}
// //         </div>

// //         {/* Related Products */}
// //         {related.length > 0 && (
// //           <div className="mt-16">
// //             <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
// //             <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
// //               {related.slice(0, 8).map(p => <ProductCard key={p._id} product={p} />)}
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductPage;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';

// /* ─── Dummy Data ─────────────────────────────────────────────────── */
// const PRODUCT = {
//   _id: '1',
//   name: 'Floral Embroidered Kurti Set',
//   price: 1299,
//   mrp: 2199,
//   stock: 14,
//   rating: 4.3,
//   numReviews: 128,
//   isBestSeller: true,
//   fabric: 'Rayon',
//   season: 'Summer',
//   brand: 'FashionRani',
//   category: { name: 'Kurtis', slug: 'kurtis' },
//   shortDescription: 'Premium floral kurti with delicate embroidery. Comfortable and perfect for everyday wear.',
//   description: 'This stunning Floral Embroidered Kurti Set is a perfect blend of tradition and modernity. Crafted from premium-quality rayon fabric, it offers a comfortable fit while keeping you stylish throughout the day.\n\nThe intricate floral embroidery on the yoke and hemline adds a touch of elegance, making it suitable for both casual wear and semi-formal occasions.',
//   returnPolicy: '7-day easy return',
//   tags: ['floral', 'embroidered', 'summer', 'casual'],
//   careInstructions: [
//     'Hand wash or machine wash in cold water',
//     'Use mild detergent only',
//     'Do not bleach or tumble dry',
//     'Iron on medium heat',
//     'Dry in shade to preserve color',
//   ],
//   images: [
//     'https://saree.com/cdn/shop/files/krtfe1198c-green-rayon-printed-long-kurti-with-dupatta_9abbbdba-fd31-4b47-a9d4-0a88fc06de0c.webp?v=1749471889',
//     'https://saree.com/cdn/shop/files/krtfe1198_34eb7cf7-4348-455c-ac18-05e038a08889.webp?v=1749471889',
//     'https://saree.com/cdn/shop/files/krtfe1198c-green-rayon-printed-long-kurti-with-dupatta_9abbbdba-fd31-4b47-a9d4-0a88fc06de0c.webp?v=1749471889',
//     'https://saree.com/cdn/shop/files/krtfe1198_34eb7cf7-4348-455c-ac18-05e038a08889.webp?v=1749471889',
//   ],
//   colors: [
//     { name: 'Green', hex: '#4ade80', img: 'https://saree.com/cdn/shop/files/krtfe1198c-green-rayon-printed-long-kurti-with-dupatta_9abbbdba-fd31-4b47-a9d4-0a88fc06de0c.webp?v=1749471889' },
//     { name: 'Pink',  hex: '#f9a8d4', img: 'https://saree.com/cdn/shop/files/krtfe1198_34eb7cf7-4348-455c-ac18-05e038a08889.webp?v=1749471889' },
//   ],
//   sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
// };

// const RELATED = Array.from({ length: 6 }, (_, i) => ({
//   _id: String(i + 2),
//   name: ['Cotton Anarkali', 'Bandhani Set', 'Palazzo Suit', 'Silk Kurti', 'Chikankari Top', 'Linen Co-ord'][i],
//   price: 899 + i * 200,
//   mrp: 1599 + i * 200,
//   img: i % 2 === 0
//     ? 'https://saree.com/cdn/shop/files/krtfe1198c-green-rayon-printed-long-kurti-with-dupatta_9abbbdba-fd31-4b47-a9d4-0a88fc06de0c.webp?v=1749471889'
//     : 'https://saree.com/cdn/shop/files/krtfe1198_34eb7cf7-4348-455c-ac18-05e038a08889.webp?v=1749471889',
// }));

// /* ─── Accordion Section ──────────────────────────────────────────── */
// const Accordion = ({ title, children }) => {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="border-b border-gray-200">
//       <button
//         onClick={() => setOpen(o => !o)}
//         className="flex justify-between items-center w-full py-4 text-left"
//       >
//         <span className="text-sm font-semibold tracking-[2px] uppercase text-gray-700">{title}</span>
//         <span className="text-2xl font-light text-gray-400 leading-none">{open ? '−' : '+'}</span>
//       </button>
//       {open && (
//         <div className="pb-4 text-sm text-gray-500 leading-relaxed">
//           {children}
//         </div>
//       )}
//     </div>
//   );
// };

// /* ══════════════════════════════════════════════════════════════════
//    PRODUCT PAGE
// ══════════════════════════════════════════════════════════════════ */
// const ProductPage = () => {
//   const p = PRODUCT;
//   const [selectedImage, setSelectedImage] = useState(0);
//   const [selectedSize, setSelectedSize]   = useState('');
//   const [selectedColor, setSelectedColor] = useState(p.colors[0].name);
//   const [quantity, setQuantity]           = useState(1);
//   const [wishlisted, setWishlisted]       = useState(false);
//   const [reviews, setReviews]             = useState([
//     { _id: 'r1', name: 'Priya S.',  rating: 5, comment: 'Absolutely loved this kurti! Fabric is so soft.', date: '10 May 2025' },
//     { _id: 'r2', name: 'Anjali M.', rating: 4, comment: 'Beautiful design and good quality. Fits true to size.', date: '22 Apr 2025' },
//     { _id: 'r3', name: 'Sneha J.',  rating: 4, comment: 'Loved the color and print. Delivery was fast too.', date: '5 Apr 2025' },
//   ]);
//   const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });

//   const discount = Math.round(((p.mrp - p.price) / p.mrp) * 100);

//   const handleReviewSubmit = (e) => {
//     e.preventDefault();
//     if (!reviewForm.comment.trim()) return;
//     setReviews(prev => [{ _id: Date.now(), name: 'You', rating: reviewForm.rating, comment: reviewForm.comment, date: 'Just now' }, ...prev]);
//     setReviewForm({ rating: 5, comment: '' });
//   };

//   return (
//     <div className="min-h-screen bg-white">

//       {/* ── BREADCRUMB ─────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-5 pt-5">
//         <div className="flex items-center gap-1.5 text-xs text-gray-400">
//           <Link to="/" className="hover:text-black transition-colors">Home</Link>
//           <span>/</span>
//           <Link to="/collection" className="hover:text-black transition-colors">Collection</Link>
//           <span>/</span>
//           <span className="text-gray-700">{p.name}</span>
//         </div>
//       </div>

//       {/* ── MAIN LAYOUT ────────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-10 sm:gap-14">

//         {/* ── LEFT: IMAGES ──────────────────────────────────────── */}
//         <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">

//           {/* Thumbnail strip */}
//           <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[18%] w-full">
//             {p.images.map((img, i) => (
//               <img
//                 key={i}
//                 src={img}
//                 alt=""
//                 onClick={() => setSelectedImage(i)}
//                 className={`w-16 sm:w-full flex-shrink-0 cursor-pointer border-2 transition-all object-cover aspect-square
//                   ${selectedImage === i ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
//               />
//             ))}
//           </div>

//           {/* Main image */}
//           <div className="sm:w-[82%] w-full relative">
//             <img
//               src={p.images[selectedImage]}
//               alt={p.name}
//               className="w-full h-auto object-cover"
//             />
//             {/* Discount badge */}
//             <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2.5 py-1">
//               {discount}% OFF
//             </span>
//             {/* Wishlist */}
//             <button
//               onClick={() => setWishlisted(w => !w)}
//               className="absolute top-3 right-3 w-9 h-9 bg-white flex items-center justify-center border border-gray-200 hover:border-black transition-colors"
//             >
//               <svg className="w-4 h-4" fill={wishlisted ? 'black' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* ── RIGHT: DETAILS ────────────────────────────────────── */}
//         <div className="flex-1">

//           {/* Name */}
//           <h1 className="text-2xl font-medium text-gray-900 mt-1 leading-snug">{p.name}</h1>

//           {/* Rating */}
//           <div className="flex items-center gap-2 mt-2">
//             <div className="flex">
//               {[1,2,3,4,5].map(s => (
//                 <span key={s} className={`text-sm ${s <= Math.round(p.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
//               ))}
//             </div>
//             <span className="text-xs text-gray-400">({p.numReviews} reviews)</span>
//             {p.isBestSeller && <span className="text-xs text-orange-500 font-medium">🔥 Best Seller</span>}
//           </div>

//           {/* Price */}
//           <div className="flex items-baseline gap-3 mt-5">
//             <p className="text-3xl font-medium text-gray-900">₹{p.price.toLocaleString()}</p>
//             <p className="text-base text-gray-400 line-through">₹{p.mrp.toLocaleString()}</p>
//             <span className="text-sm text-green-600 font-medium">Save ₹{(p.mrp - p.price).toLocaleString()}</span>
//           </div>
//           <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

//           {/* Colors */}
//           <div className="mt-7">
//             <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600 mb-2">
//               Color — <span className="text-gray-900">{selectedColor}</span>
//             </h3>
//             <div className="flex gap-2">
//               {p.colors.map(c => (
//                 <button
//                   key={c.name}
//                   onClick={() => setSelectedColor(c.name)}
//                   title={c.name}
//                   className={`border-2 transition-all ${selectedColor === c.name ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
//                 >
//                   <img src={c.img} alt={c.name} className="w-10 h-10 object-cover" />
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Sizes */}
//           <div className="mt-6">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600">
//                 Size {selectedSize && <span className="text-gray-900">— {selectedSize}</span>}
//               </h3>
//               <button className="text-xs underline text-gray-500 hover:text-black transition-colors tracking-wide">
//                 SIZE CHART
//               </button>
//             </div>
//             <div className="flex gap-2 flex-wrap">
//               {p.sizes.map(size => (
//                 <button
//                   key={size}
//                   onClick={() => setSelectedSize(size)}
//                   className={`border px-4 py-2 text-sm transition-all
//                     ${selectedSize === size
//                       ? 'bg-black text-white border-black'
//                       : 'border-gray-300 text-gray-700 hover:border-black'}`}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//             {!selectedSize && (
//               <p className="text-xs text-rose-500 mt-2">Please select a size</p>
//             )}
//           </div>

//           {/* Quantity */}
//           <div className="mt-6 flex items-center gap-4">
//             <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600">Qty</h3>
//             <div className="flex items-center border border-gray-300">
//               <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">−</button>
//               <span className="w-9 text-center text-sm font-medium">{quantity}</span>
//               <button onClick={() => setQuantity(q => Math.min(p.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">+</button>
//             </div>
//             <span className="text-xs text-gray-400">{p.stock} in stock</span>
//           </div>

//           {/* CTA Buttons */}
//           <div className="flex gap-3 mt-6">
//             <button className="flex-1 bg-black text-white text-sm font-semibold tracking-widest uppercase py-4 hover:bg-gray-900 transition-colors">
//               Add to Cart
//             </button>
//             <button className="flex-1 border border-black text-black text-sm font-semibold tracking-widest uppercase py-4 hover:bg-black hover:text-white transition-colors">
//               Buy Now
//             </button>
//           </div>

//           {/* Trust row */}
//           <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">
//             {[['🚚', 'Free shipping ₹999+'], ['↩️', '7-day returns'], ['🔒', 'Secure payment'], ['✅', '100% Authentic']].map(([ic, txt]) => (
//               <span key={txt} className="flex items-center gap-1.5">{ic} {txt}</span>
//             ))}
//           </div>

//           {/* Accordion */}
//           <div className="mt-8 border-t border-gray-200">
//             <Accordion title="Details">
//               <p>{p.description}</p>
//               <div className="mt-3 space-y-1">
//                 {[['Fabric', p.fabric], ['Brand', p.brand], ['Season', p.season]].map(([k, v]) => (
//                   <div key={k} className="flex gap-2">
//                     <span className="text-gray-400 w-16">{k}:</span>
//                     <span className="text-gray-700 font-medium capitalize">{v}</span>
//                   </div>
//                 ))}
//               </div>
//             </Accordion>

//             <Accordion title={`Reviews (${reviews.length})`}>
//               {/* Mini rating summary */}
//               <div className="flex items-center gap-3 mb-4">
//                 <span className="text-3xl font-medium text-gray-900">{p.rating}</span>
//                 <div>
//                   <div className="flex">
//                     {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= Math.round(p.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
//                   </div>
//                   <span className="text-xs text-gray-400">{reviews.length} reviews</span>
//                 </div>
//               </div>
//               {/* Review list */}
//               <div className="space-y-4 mb-5">
//                 {reviews.map(r => (
//                   <div key={r._id} className="border-b border-gray-100 pb-4">
//                     <div className="flex items-center justify-between mb-1">
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs font-semibold text-gray-700">{r.name}</span>
//                         <span className="text-xs text-gray-400">{r.date}</span>
//                       </div>
//                       <div className="flex">
//                         {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
//                       </div>
//                     </div>
//                     <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
//                   </div>
//                 ))}
//               </div>
//               {/* Write review */}
//               <form onSubmit={handleReviewSubmit} className="border border-gray-200 p-4">
//                 <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">Write a Review</p>
//                 <div className="flex gap-1 mb-3">
//                   {[1,2,3,4,5].map(s => (
//                     <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
//                       className={`text-xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
//                   ))}
//                 </div>
//                 <textarea
//                   value={reviewForm.comment}
//                   onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
//                   placeholder="Share your experience…"
//                   rows={3}
//                   className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none transition-colors"
//                 />
//                 <button type="submit" className="mt-2 bg-black text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-gray-800 transition-colors">
//                   Submit
//                 </button>
//               </form>
//             </Accordion>

//             <Accordion title="Delivery">
//               <p>We deliver across India within 3–7 business days.</p>
//               <p className="mt-1">Free delivery on orders above ₹999.</p>
//               <p className="mt-1">Express delivery available at checkout.</p>
//             </Accordion>

//             <Accordion title="Returns & Exchanges">
//               <div className="space-y-1.5">
//                 {p.careInstructions.map((c, i) => (
//                   <p key={i}>• {c}</p>
//                 ))}
//               </div>
//               <p className="mt-2 font-medium text-gray-700">Easy returns within {p.returnPolicy}.</p>
//             </Accordion>
//           </div>

//         </div>
//       </div>

//       {/* ── RELATED PRODUCTS ─────────────────────────────────────── */}
//       <div className="max-w-7xl mx-auto px-5 pb-16 mt-4">
//         <h2 className="text-sm font-semibold tracking-[3px] uppercase text-gray-700 mb-6 border-t border-gray-200 pt-8">
//           You May Also Like
//         </h2>
//         <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
//           {RELATED.map(r => {
//             const disc = Math.round(((r.mrp - r.price) / r.mrp) * 100);
//             return (
//               <Link key={r._id} to={`/product/${r._id}`} className="group">
//                 <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
//                   <img src={r.img} alt={r.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
//                   <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5">{disc}% OFF</span>
//                 </div>
//                 <div className="mt-2">
//                   <p className="text-sm font-medium text-gray-800 truncate">{r.name}</p>
//                   <div className="flex items-center gap-2 mt-0.5">
//                     <span className="text-sm font-semibold">₹{r.price}</span>
//                     <span className="text-xs text-gray-400 line-through">₹{r.mrp}</span>
//                   </div>
//                 </div>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//     </div>
//   );
// };

// export default ProductPage;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productAPI } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

/* ─── Helper: get image url from schema images:[{url,publicId}] ── */
const getImg = (product, idx = 0) =>
  product?.images?.[idx]?.url ||
  product?.mainImage?.url ||
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600';

/* ─── Accordion ─────────────────────────────────────────────────── */
const Accordion = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex justify-between items-center w-full py-4 text-left"
      >
        <span className="text-sm font-semibold tracking-[2px] uppercase text-gray-700">{title}</span>
        <span className="text-2xl font-light text-gray-400 leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="pb-4 text-sm text-gray-500 leading-relaxed">{children}</div>}
    </div>
  );
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
const Skeleton = () => (
  <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-10 sm:gap-14 animate-pulse">
    <div className="flex-1 flex gap-3">
      <div className="flex sm:flex-col gap-2 sm:w-[18%]">
        {[0,1,2,3].map(i => <div key={i} className="w-16 sm:w-full aspect-square bg-gray-100 flex-shrink-0" />)}
      </div>
      <div className="flex-1 aspect-[3/4] bg-gray-100" />
    </div>
    <div className="flex-1 space-y-4 pt-2">
      {[180,120,80,60,100,60,40].map((w,i) => (
        <div key={i} className="h-4 bg-gray-100 rounded" style={{ width: w }} />
      ))}
    </div>
  </div>
);

/* ─── Related Card ───────────────────────────────────────────────── */
const RelatedCard = ({ product }) => {
  const disc = product.discount ||
    (product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0);
  return (
    <Link to={`/product/${product.slug}`} className="group">
      <div className="relative overflow-hidden aspect-[3/4] bg-gray-50">
        <img
          src={getImg(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
        />
        {disc > 0 && (
          <span className="absolute top-2 left-2 bg-black text-white text-[10px] px-2 py-0.5">{disc}% OFF</span>
        )}
      </div>
      <div className="mt-2">
        <p className="text-sm font-medium text-gray-800 truncate">{product.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm font-semibold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-xs text-gray-400 line-through">₹{product.mrp}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

/* ══════════════════════════════════════════════════════════════════
   PRODUCT PAGE
══════════════════════════════════════════════════════════════════ */
const ProductPage = () => {
  const { slug }      = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const { addToCart } = useCart();
  const { toggle, isWishlisted } = useWishlist();

  const [product, setProduct]             = useState(null);
  const [related, setRelated]             = useState([]);
  const [loading, setLoading]             = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize]   = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity]           = useState(1);
  const [addingToCart, setAddingToCart]   = useState(false);
  const [submitting, setSubmitting]       = useState(false);
  const [reviewForm, setReviewForm]       = useState({ rating: 5, comment: '' });

  /* ── Fetch product by slug, then related by _id ──────────────── */
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setSelectedImage(0);

    productAPI.getOne(slug)
      .then(res => {
        const p = res.data.product;
        setProduct(p);

        // auto-select first in-stock size  (schema: sizes:[{size,stock}])
        const first = p.sizes?.find(s => s.stock > 0);
        if (first) setSelectedSize(first.size);

        // auto-select first color  (schema: colors:[{name,hex}])
        if (p.colors?.length) setSelectedColor(p.colors[0].name);

        // fetch related using MongoDB _id
        return productAPI.getRelated(p._id);
      })
      .then(res => setRelated(res.data.products || []))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Add to cart ─────────────────────────────────────────────── */
  const handleAddToCart = async () => {
    if (!user)         { toast.error('Please login to add to cart'); navigate('/login'); return; }
    if (!selectedSize) { toast.error('Please select a size'); return; }
    setAddingToCart(true);
    try {
      await addToCart(product._id, selectedSize, selectedColor, quantity);
      toast.success('Added to cart! 🛍️');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally { setAddingToCart(false); }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (selectedSize) navigate('/cart');
  };

  /* ── Wishlist ────────────────────────────────────────────────── */
  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      const res = await toggle(product._id);
      toast.success(res.message || 'Wishlist updated');
    } catch { toast.error('Failed'); }
  };

  /* ── Submit review  → POST /api/products/:id/reviews ─────────── */
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user)                      { toast.error('Please login to review'); return; }
    if (!reviewForm.comment.trim()) { toast.error('Please write a comment'); return; }
    setSubmitting(true);
    try {
      const res = await productAPI.addReview(product._id, reviewForm);
      // controller returns { reviews, rating, numReviews }
      setProduct(prev => ({
        ...prev,
        reviews:    res.data.reviews,
        rating:     res.data.rating,
        numReviews: res.data.numReviews,
      }));
      setReviewForm({ rating: 5, comment: '' });
      toast.success('Review submitted! ⭐');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  /* ── States ──────────────────────────────────────────────────── */
  if (loading) return <Skeleton />;
  if (!product) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-medium text-gray-700 mb-4">Product not found</h2>
      <Link to="/collection" className="bg-black text-white text-sm font-semibold tracking-widest uppercase px-6 py-3 hover:bg-gray-900 transition-colors">
        Browse Collection
      </Link>
    </div>
  );

  /* ── Derived ─────────────────────────────────────────────────── */
  // schema: images:[{url,publicId}]  so we use .url
  const images           = product.images?.length ? product.images : [{ url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600' }];
  const discount         = product.discount || (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);
  const selectedSizeData = product.sizes?.find(s => s.size === selectedSize);
  const wishlisted       = isWishlisted(product._id);

  return (
    <div className="min-h-screen bg-white">

      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 pt-5">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 flex-wrap">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <span>/</span>
          <Link to="/collection" className="hover:text-black transition-colors">Collection</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to={`/collection/${product.category.slug}`} className="hover:text-black transition-colors capitalize">
                {product.category.name}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[180px]">{product.name}</span>
        </div>
      </div>

      {/* ── MAIN LAYOUT ───────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row gap-10 sm:gap-14">

        {/* ── LEFT: IMAGES ─────────────────────────────────────────── */}
        <div className="flex-1 flex flex-col-reverse sm:flex-row gap-3">

          {/* Thumbnail strip — image.url from schema */}
          <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:w-[18%] w-full">
            {images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt=""
                onClick={() => setSelectedImage(i)}
                onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200'; }}
                className={`w-16 sm:w-full flex-shrink-0 cursor-pointer border-2 transition-all object-cover aspect-square
                  ${selectedImage === i ? 'border-black' : 'border-transparent hover:border-gray-300'}`}
              />
            ))}
          </div>

          {/* Main image */}
          <div className="sm:w-[82%] w-full relative">
            <img
              src={images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-auto object-cover"
              onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'; }}
            />
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-black text-white text-xs font-semibold px-2.5 py-1">
                {discount}% OFF
              </span>
            )}
            {product.isNewArrival && (
              <span className="absolute top-3 left-24 bg-emerald-600 text-white text-xs font-semibold px-2.5 py-1">
                NEW
              </span>
            )}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 w-9 h-9 bg-white flex items-center justify-center border border-gray-200 hover:border-black transition-colors"
            >
              <svg className="w-4 h-4" fill={wishlisted ? 'black' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* ── RIGHT: DETAILS ───────────────────────────────────────── */}
        <div className="flex-1">

          {/* Category link */}
          {product.category && (
            <Link to={`/collection/${product.category.slug}`} className="text-xs text-gray-400 hover:text-black tracking-widest uppercase transition-colors">
              {product.category.icon} {product.category.name}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-2xl font-medium text-gray-900 mt-1 leading-snug">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-sm ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
              ))}
            </div>
            <span className="text-xs text-gray-400">({product.numReviews} reviews)</span>
            {product.isBestSeller && <span className="text-xs text-orange-500 font-medium">🔥 Best Seller</span>}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mt-5">
            <p className="text-3xl font-medium text-gray-900">₹{product.price?.toLocaleString()}</p>
            {product.mrp > product.price && (
              <p className="text-base text-gray-400 line-through">₹{product.mrp?.toLocaleString()}</p>
            )}
            {discount > 0 && (
              <span className="text-sm text-green-600 font-medium">Save ₹{(product.mrp - product.price).toLocaleString()}</span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">Inclusive of all taxes</p>

          {/* Short description */}
          {product.shortDescription && (
            <p className="text-sm text-gray-500 mt-4 leading-relaxed">{product.shortDescription}</p>
          )}

          {/* Colors — schema: colors:[{name,hex}] — swatch circles */}
          {product.colors?.length > 0 && (
            <div className="mt-7">
              <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600 mb-2">
                Color — <span className="text-gray-900">{selectedColor}</span>
              </h3>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map(c => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    title={c.name}
                    className={`w-7 h-7 rounded-full border-4 transition-all ${selectedColor === c.name ? 'border-black scale-110' : 'border-white shadow hover:scale-105'}`}
                    style={{ background: c.hex, outline: `2px solid ${selectedColor === c.name ? '#000' : '#e5e7eb'}` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Sizes — schema: sizes:[{size,stock}] */}
          {product.sizes?.length > 0 && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600">
                  Size {selectedSize && <span className="text-gray-900">— {selectedSize}</span>}
                </h3>
                <button className="text-xs underline text-gray-500 hover:text-black transition-colors tracking-wide">
                  SIZE CHART
                </button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(s => (
                  <button
                    key={s.size}
                    onClick={() => s.stock > 0 && setSelectedSize(s.size)}
                    disabled={s.stock === 0}
                    className={`border px-4 py-2 text-sm transition-all relative
                      ${s.stock === 0
                        ? 'border-gray-100 text-gray-300 cursor-not-allowed'
                        : selectedSize === s.size
                          ? 'bg-black text-white border-black'
                          : 'border-gray-300 text-gray-700 hover:border-black'}`}
                  >
                    {s.size}
                    {s.stock === 0 && (
                      <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <span className="w-[140%] h-px bg-gray-300 -rotate-45 absolute" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedSizeData && (
                <p className={`text-xs mt-2 ${selectedSizeData.stock <= 3 ? 'text-rose-500 font-medium' : 'text-gray-400'}`}>
                  {selectedSizeData.stock <= 3 ? `⚡ Only ${selectedSizeData.stock} left!` : `${selectedSizeData.stock} in stock`}
                </p>
              )}
              {!selectedSize && <p className="text-xs text-rose-500 mt-2">Please select a size</p>}
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-4">
            <h3 className="text-xs font-semibold tracking-[2px] uppercase text-gray-600">Qty</h3>
            <div className="flex items-center border border-gray-300">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">−</button>
              <span className="w-9 text-center text-sm font-medium">{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(product.stock, q + 1))} className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors text-lg">+</button>
            </div>
            <span className="text-xs text-gray-400">{product.stock} in stock</span>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stock === 0}
              className="flex-1 bg-black text-white text-sm font-semibold tracking-widest uppercase py-4 hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addingToCart ? 'Adding…' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="flex-1 border border-black text-black text-sm font-semibold tracking-widest uppercase py-4 hover:bg-black hover:text-white transition-colors disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap gap-4 mt-5 text-xs text-gray-500">
            {[['🚚','Free shipping ₹999+'],['↩️', product.returnPolicy || '7-day returns'],['🔒','Secure payment'],['✅','100% Authentic']].map(([ic,txt]) => (
              <span key={txt} className="flex items-center gap-1.5">{ic} {txt}</span>
            ))}
          </div>

          {/* Accordions */}
          <div className="mt-8 border-t border-gray-200">

            {/* Details — fabric, brand, season, tags from schema */}
            <Accordion title="Details">
              <p className="whitespace-pre-line">{product.description}</p>
              <div className="mt-3 space-y-1">
                {[['Fabric', product.fabric], ['Brand', product.brand], ['Season', product.season]]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-gray-400 w-16">{k}:</span>
                      <span className="text-gray-700 font-medium capitalize">{v}</span>
                    </div>
                  ))}
                {product.tags?.length > 0 && (
                  <div className="flex gap-1.5 flex-wrap mt-1">
                    {product.tags.map(t => (
                      <span key={t} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </Accordion>

            {/* Reviews — schema: reviews:[{user,name,rating,comment,createdAt}] */}
            <Accordion title={`Reviews (${product.numReviews || 0})`}>
              {/* Summary */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-medium text-gray-900">{product.rating?.toFixed(1) || '0.0'}</span>
                <div>
                  <div className="flex">
                    {[1,2,3,4,5].map(s => <span key={s} className={`text-sm ${s <= Math.round(product.rating) ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                  </div>
                  <span className="text-xs text-gray-400">{product.numReviews} reviews</span>
                </div>
              </div>

              {/* List */}
              <div className="space-y-4 mb-5">
                {product.reviews?.length === 0 && (
                  <p className="text-xs text-gray-400 py-2">No reviews yet. Be the first!</p>
                )}
                {product.reviews?.map(r => (
                  <div key={r._id} className="border-b border-gray-100 pb-4">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 text-xs font-semibold">
                          {r.name?.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex">
                        {[1,2,3,4,5].map(s => <span key={s} className={`text-xs ${s <= r.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>)}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write review — only if logged in */}
              {user ? (
                <form onSubmit={handleReviewSubmit} className="border border-gray-200 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">Write a Review</p>
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                        className={`text-xl transition-transform hover:scale-110 ${s <= reviewForm.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience…"
                    rows={3}
                    className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-black resize-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-2 bg-black text-white text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting…' : 'Submit'}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-gray-400 border border-gray-100 p-4 text-center">
                  <Link to="/login" className="underline hover:text-black">Login</Link> to write a review
                </p>
              )}
            </Accordion>

            <Accordion title="Delivery">
              <p>We deliver across India within 3–7 business days.</p>
              <p className="mt-1">Free delivery on orders above ₹999.</p>
              <p className="mt-1">Express delivery available at checkout.</p>
            </Accordion>

            {/* Returns & Care — schema: careInstructions:[String], returnPolicy:String */}
            <Accordion title="Returns & Exchanges">
              <div className="space-y-1.5">
                {(product.careInstructions?.length
                  ? product.careInstructions
                  : ['Hand wash in cold water','Use mild detergent','Do not bleach','Iron on medium heat','Dry in shade']
                ).map((c, i) => <p key={i}>• {c}</p>)}
              </div>
              <p className="mt-2 font-medium text-gray-700">
                Easy returns within {product.returnPolicy || '7 days easy return'}.
              </p>
            </Accordion>

          </div>
        </div>
      </div>

      {/* ── RELATED PRODUCTS ──────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="max-w-7xl mx-auto px-5 pb-16 mt-4">
          <h2 className="text-sm font-semibold tracking-[3px] uppercase text-gray-700 mb-6 border-t border-gray-200 pt-8">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {related.map(r => <RelatedCard key={r._id} product={r} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;