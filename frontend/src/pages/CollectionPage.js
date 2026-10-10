// // // import React, { useState, useEffect, useCallback } from 'react';
// // // import { useParams, useSearchParams, Link } from 'react-router-dom';
// // // import { productAPI, categoryAPI } from '../utils/api';
// // // import ProductCard from '../components/common/ProductCard';

// // // const CollectionPage = () => {
// // //   const { category } = useParams();
// // //   const [searchParams, setSearchParams] = useSearchParams();
// // //   const [products, setProducts] = useState([]);
// // //   const [categories, setCategories] = useState([]);
// // //   const [currentCategory, setCurrentCategory] = useState(null);
// // //   const [pagination, setPagination] = useState({});
// // //   const [loading, setLoading] = useState(true);
// // //   const [filtersOpen, setFiltersOpen] = useState(false);

// // //   const [filters, setFilters] = useState({
// // //     search: searchParams.get('search') || '',
// // //     sort: searchParams.get('sort') || 'newest',
// // //     minPrice: searchParams.get('minPrice') || '',
// // //     maxPrice: searchParams.get('maxPrice') || '',
// // //     size: searchParams.get('size') || '',
// // //     season: searchParams.get('season') || '',
// // //     featured: searchParams.get('featured') || '',
// // //     newArrival: searchParams.get('newArrival') || '',
// // //     bestSeller: searchParams.get('bestSeller') || '',
// // //     page: 1,
// // //   });

// // //   useEffect(() => {
// // //     categoryAPI.getAll().then(res => {
// // //       setCategories(res.data.categories || []);
// // //       if (category) {
// // //         const found = res.data.categories?.find(c => c.slug === category);
// // //         setCurrentCategory(found || null);
// // //       }
// // //     });
// // //   }, [category]);

// // //   const fetchProducts = useCallback(async () => {
// // //     setLoading(true);
// // //     try {
// // //       const params = { ...filters, category: category || '' };
// // //       Object.keys(params).forEach(k => !params[k] && delete params[k]);
// // //       const res = await productAPI.getAll(params);
// // //       setProducts(res.data.products || []);
// // //       setPagination(res.data.pagination || {});
// // //     } catch (e) { setProducts([]); }
// // //     finally { setLoading(false); }
// // //   }, [filters, category]);

// // //   useEffect(() => { fetchProducts(); }, [fetchProducts]);

// // //   const updateFilter = (key, value) => {
// // //     setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
// // //   };

// // //   const clearFilters = () => {
// // //     setFilters({ search: '', sort: 'newest', minPrice: '', maxPrice: '', size: '', season: '', featured: '', newArrival: '', bestSeller: '', page: 1 });
// // //   };

// // //   const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];

// // //   return (
// // //     <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
// // //       {/* Breadcrumb */}
// // //       <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
// // //         <Link to="/" className="hover:text-rose-600">Home</Link>
// // //         <span>/</span>
// // //         <span className="text-gray-900">{currentCategory ? currentCategory.name : 'All Products'}</span>
// // //       </div>

// // //       {/* Header */}
// // //       <div className="mb-8">
// // //         <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900">
// // //           {currentCategory ? `${currentCategory.icon} ${currentCategory.name}` : filters.search ? `Results for "${filters.search}"` : 'All Products'}
// // //         </h1>
// // //         {currentCategory?.description && <p className="text-gray-500 mt-2">{currentCategory.description}</p>}
// // //         <p className="text-sm text-gray-400 mt-1">{pagination.total || 0} products found</p>
// // //       </div>

// // //       <div className="flex gap-8">
// // //         {/* Filters Sidebar - Desktop */}
// // //         <aside className={`hidden lg:block w-64 flex-shrink-0`}>
// // //           <FilterSidebar filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} categories={categories} sizes={sizes} />
// // //         </aside>

// // //         {/* Main Content */}
// // //         <div className="flex-1 min-w-0">
// // //           {/* Top bar */}
// // //           <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
// // //             <div className="flex items-center gap-3">
// // //               <button onClick={() => setFiltersOpen(true)} className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-rose-400">
// // //                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
// // //                 Filters
// // //               </button>

// // //               {/* Category quick filters */}
// // //               <div className="flex gap-2 flex-wrap">
// // //                 <Link to="/collection" className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!category ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-rose-400'}`}>All</Link>
// // //                 {categories.slice(0, 5).map(cat => (
// // //                   <Link key={cat._id} to={`/collection/${cat.slug}`} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${category === cat.slug ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-rose-400'}`}>{cat.name}</Link>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-rose-400 bg-white">
// // //               <option value="newest">Newest First</option>
// // //               <option value="price_asc">Price: Low to High</option>
// // //               <option value="price_desc">Price: High to Low</option>
// // //               <option value="rating">Best Rated</option>
// // //               <option value="popular">Most Popular</option>
// // //             </select>
// // //           </div>

// // //           {/* Products Grid */}
// // //           {loading ? (
// // //             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
// // //               {[...Array(12)].map((_, i) => <div key={i} className="aspect-[3/4] rounded-2xl shimmer-bg" />)}
// // //             </div>
// // //           ) : products.length === 0 ? (
// // //             <div className="text-center py-20">
// // //               <div className="text-6xl mb-4">🔍</div>
// // //               <h3 className="font-display text-xl text-gray-700 mb-2">No products found</h3>
// // //               <p className="text-gray-500 mb-6">Try adjusting your filters or search query</p>
// // //               <button onClick={clearFilters} className="btn-primary">Clear Filters</button>
// // //             </div>
// // //           ) : (
// // //             <>
// // //               <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
// // //                 {products.map(p => <ProductCard key={p._id} product={p} />)}
// // //               </div>

// // //               {/* Pagination */}
// // //               {pagination.pages > 1 && (
// // //                 <div className="flex justify-center gap-2 mt-8">
// // //                   {[...Array(pagination.pages)].map((_, i) => (
// // //                     <button key={i} onClick={() => setFilters(prev => ({ ...prev, page: i + 1 }))}
// // //                       className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${filters.page === i + 1 ? 'bg-rose-600 text-white' : 'border border-gray-200 text-gray-600 hover:border-rose-400'}`}>
// // //                       {i + 1}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               )}
// // //             </>
// // //           )}
// // //         </div>
// // //       </div>

// // //       {/* Mobile Filters Drawer */}
// // //       {filtersOpen && (
// // //         <div className="fixed inset-0 z-50 lg:hidden">
// // //           <div className="absolute inset-0 bg-black/50" onClick={() => setFiltersOpen(false)} />
// // //           <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-4 animate-slide-down">
// // //             <div className="flex items-center justify-between mb-4">
// // //               <h3 className="font-display font-semibold text-lg">Filters</h3>
// // //               <button onClick={() => setFiltersOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
// // //             </div>
// // //             <FilterSidebar filters={filters} updateFilter={updateFilter} clearFilters={clearFilters} categories={categories} sizes={sizes} />
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // };

// // // const FilterSidebar = ({ filters, updateFilter, clearFilters, categories, sizes }) => (
// // //   <div className="space-y-6">
// // //     <div className="flex items-center justify-between">
// // //       <h3 className="font-semibold text-gray-800">Filters</h3>
// // //       <button onClick={clearFilters} className="text-rose-600 text-xs hover:underline">Clear All</button>
// // //     </div>

// // //     {/* Search */}
// // //     <div>
// // //       <label className="text-sm font-medium text-gray-700 block mb-2">Search</label>
// // //       <input type="text" value={filters.search} onChange={e => updateFilter('search', e.target.value)}
// // //         placeholder="Search products..." className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
// // //     </div>

// // //     {/* Price Range */}
// // //     <div>
// // //       <label className="text-sm font-medium text-gray-700 block mb-2">Price Range</label>
// // //       <div className="flex gap-2">
// // //         <input type="number" value={filters.minPrice} onChange={e => updateFilter('minPrice', e.target.value)}
// // //           placeholder="Min" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
// // //         <input type="number" value={filters.maxPrice} onChange={e => updateFilter('maxPrice', e.target.value)}
// // //           placeholder="Max" className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
// // //       </div>
// // //     </div>

// // //     {/* Sizes */}
// // //     <div>
// // //       <label className="text-sm font-medium text-gray-700 block mb-2">Size</label>
// // //       <div className="flex flex-wrap gap-2">
// // //         {sizes.map(s => (
// // //           <button key={s} onClick={() => updateFilter('size', filters.size === s ? '' : s)}
// // //             className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${filters.size === s ? 'bg-rose-600 text-white border-rose-600' : 'border-gray-200 text-gray-600 hover:border-rose-400'}`}>
// // //             {s}
// // //           </button>
// // //         ))}
// // //       </div>
// // //     </div>

// // //     {/* Season */}
// // //     <div>
// // //       <label className="text-sm font-medium text-gray-700 block mb-2">Season</label>
// // //       <div className="space-y-1.5">
// // //         {[['all', 'All Seasons'], ['summer', '☀️ Summer'], ['winter', '❄️ Winter'], ['monsoon', '🌧️ Monsoon']].map(([val, label]) => (
// // //           <label key={val} className="flex items-center gap-2 cursor-pointer">
// // //             <input type="radio" name="season" checked={filters.season === val || (val === 'all' && !filters.season)}
// // //               onChange={() => updateFilter('season', val === 'all' ? '' : val)} className="text-rose-600" />
// // //             <span className="text-sm text-gray-700">{label}</span>
// // //           </label>
// // //         ))}
// // //       </div>
// // //     </div>

// // //     {/* Type Filters */}
// // //     <div>
// // //       <label className="text-sm font-medium text-gray-700 block mb-2">Product Type</label>
// // //       <div className="space-y-1.5">
// // //         {[['featured', 'Featured'], ['newArrival', 'New Arrivals'], ['bestSeller', 'Best Sellers']].map(([key, label]) => (
// // //           <label key={key} className="flex items-center gap-2 cursor-pointer">
// // //             <input type="checkbox" checked={filters[key] === 'true'} onChange={e => updateFilter(key, e.target.checked ? 'true' : '')} className="text-rose-600 rounded" />
// // //             <span className="text-sm text-gray-700">{label}</span>
// // //           </label>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   </div>
// // // );

// // // export default CollectionPage;



// // import React, { useState, useEffect, useRef, useCallback } from 'react';
// // import { Link, useParams, useSearchParams } from 'react-router-dom';
// // import { productAPI, categoryAPI } from '../utils/api';
// // import ProductCard from '../components/common/ProductCard';

// // /* ─── Mock data ────────────────────────────────────────────────── */
// // const MOCK_PRODUCTS = Array.from({ length: 60 }, (_, i) => ({
// //   _id: String(i + 1),
// //   name: ['Floral Kurti Set', 'Embroidered Suit', 'Party Frock', 'Bandhani Lehenga', 'Printed Top', 'Cotton Saree', 'Co-ord Set', 'A-Line Dress'][i % 8],
// //   price: 699 + i * 80,
// //   originalPrice: 1299 + i * 80,
// //   image: [
// //     'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=70',
// //     'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=400&q=70',
// //     'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&q=70',
// //     'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=70',
// //     'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=70',
// //   ][i % 5],
// //   category: ['Kurtis', 'Suits', 'Frocks', 'Lehengas', 'Tops', 'Sarees', 'Co-ord Sets', 'Dresses'][i % 8],
// //   rating: (3.5 + (i % 3) * 0.5).toFixed(1),
// //   reviews: 10 + i * 7,
// //   sizes: ['XS', 'S', 'M', 'L', 'XL'].slice(0, 3 + (i % 3)),
// //   color: ['Black', 'Pink', 'Blue', 'Green', 'Red'][i % 5],
// //   discount: [10, 20, 30, 50][i % 4],
// // }));

// // const FILTER_CONFIG = [
// //   { title: 'SIZE',     key: 'size',     options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] },
// //   { title: 'CATEGORY', key: 'category', options: ['Kurtis', 'Suits', 'Frocks', 'Lehengas', 'Tops', 'Sarees', 'Co-ord Sets', 'Dresses'] },
// //   { title: 'COLOR',    key: 'color',    options: ['Black', 'Blue', 'Pink', 'Green', 'Red', 'White', 'Yellow'] },
// //   { title: 'PRICE',    key: 'price',    options: ['Under ₹500', '₹500–₹1000', '₹1000–₹2000', 'Above ₹2000'] },
// //   { title: 'DISCOUNT', key: 'discount', options: ['10% & above', '20% & above', '30% & above', '50% & above'] },
// //   { title: 'SEASON',   key: 'season',   options: ['Summer', 'Winter', 'Monsoon', 'All Season'] },
// // ];

// // const SORT_OPTIONS = [
// //   { value: 'newest',     label: 'Newest First' },
// //   { value: 'price_asc',  label: 'Price: Low to High' },
// //   { value: 'price_desc', label: 'Price: High to Low' },
// //   { value: 'rating',     label: 'Best Rated' },
// //   { value: 'popular',    label: 'Most Popular' },
// // ];

// // const PAGE_SIZE = 12;

// // /* ─── Filter Sidebar ────────────────────────────────────────────── */
// // const FilterSidebar = ({ checked, setChecked, onClear }) => {
// //   const [open, setOpen] = useState('SIZE');

// //   const toggle = (key, option) => {
// //     const k = `${key}__${option}`;
// //     setChecked(prev => ({ ...prev, [k]: !prev[k] }));
// //   };

// //   const activeCount = Object.values(checked).filter(Boolean).length;

// //   return (
// //     <aside className="w-full sticky top-20 self-start bg-white border-r border-gray-100 pt-6 pb-16">
// //       {/* Header */}
// //       <div className="px-6 mb-1 flex items-center justify-between">
// //         <h2 className="text-xs font-semibold tracking-[3px] uppercase text-gray-400">
// //           Filters {activeCount > 0 && <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{activeCount}</span>}
// //         </h2>
// //         {activeCount > 0 && (
// //           <button onClick={onClear} className="text-[11px] text-rose-500 hover:text-rose-700 font-medium tracking-wide transition-colors">
// //             Clear All
// //           </button>
// //         )}
// //       </div>

// //       {/* Accordion */}
// //       <div className="flex flex-col px-6">
// //         {FILTER_CONFIG.map(filter => (
// //           <div key={filter.title} className="border-t border-gray-100 py-3.5">
// //             <button
// //               onClick={() => setOpen(open === filter.title ? '' : filter.title)}
// //               className="flex w-full justify-between items-center cursor-pointer text-left group"
// //             >
// //               <span className="text-xs font-semibold tracking-[2px] uppercase text-gray-600 group-hover:text-gray-900 transition-colors">
// //                 {filter.title}
// //               </span>
// //               <span className="text-gray-400 text-base leading-none group-hover:text-gray-700 transition-colors select-none">
// //                 {open === filter.title ? '−' : '+'}
// //               </span>
// //             </button>

// //             {open === filter.title && (
// //               <div className="flex flex-col gap-2.5 mt-3.5">
// //                 {filter.options.map(option => {
// //                   const k = `${filter.key}__${option}`;
// //                   return (
// //                     <label key={option} className="flex items-center gap-2.5 cursor-pointer group/item">
// //                       <input
// //                         type="checkbox"
// //                         checked={!!checked[k]}
// //                         onChange={() => toggle(filter.key, option)}
// //                         className="accent-rose-500 w-3.5 h-3.5 cursor-pointer rounded"
// //                       />
// //                       <span className={`text-sm transition-colors ${checked[k] ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover/item:text-gray-800'}`}>
// //                         {option}
// //                       </span>
// //                     </label>
// //                   );
// //                 })}
// //               </div>
// //             )}
// //           </div>
// //         ))}
// //       </div>
// //     </aside>
// //   );
// // };

// // /* ─── Product Card ──────────────────────────────────────────────── */
// // const GridCard = ({ product }) => {
// //   const disc = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
// //   const [imgIdx, setImgIdx] = useState(0);

// //   return (
// //     <Link
// //       to={`/product/${product._id}`}
// //       className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
// //       onMouseEnter={() => setImgIdx(1)}
// //       onMouseLeave={() => setImgIdx(0)}
// //     >
// //       <div className="relative aspect-[3/4] overflow-hidden bg-rose-50">
// //         <img
// //           src={product.image}
// //           alt={product.name}
// //           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
// //         />
// //         <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
// //           {disc}% OFF
// //         </span>
// //         <button
// //           className="absolute bottom-2 right-2 bg-white/90 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
// //           onClick={e => e.preventDefault()}
// //         >♡</button>
// //       </div>
// //       <div className="p-3">
// //         <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest truncate">{product.category}</p>
// //         <h3 className="text-sm font-semibold text-gray-800 truncate mt-0.5">{product.name}</h3>
// //         <div className="flex items-center gap-2 mt-1.5">
// //           <span className="text-rose-600 font-bold text-sm">₹{product.price}</span>
// //           <span className="text-gray-400 line-through text-xs">₹{product.originalPrice}</span>
// //         </div>
// //         <div className="flex items-center gap-1 mt-1">
// //           <span className="text-yellow-400 text-xs">★ {product.rating}</span>
// //           <span className="text-xs text-gray-400">({product.reviews})</span>
// //         </div>
// //       </div>
// //     </Link>
// //   );
// // };

// // /* ══════════════════════════════════════════════════════════════════
// //    COLLECTION PAGE
// // ══════════════════════════════════════════════════════════════════ */
// // const CollectionPage = () => {
// //   const { category } = useParams();
// //   const [searchParams] = useSearchParams();

// //   const [checked, setChecked] = useState({});
// //   const [sort, setSort] = useState('newest');
// //   const [search, setSearch] = useState(searchParams.get('q') || '');
// //   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

// //   /* Infinite scroll state */
// //   const [visibleProducts, setVisibleProducts] = useState([]);
// //   const [hasMore, setHasMore] = useState(true);
// //   const [loadingMore, setLoadingMore] = useState(false);
// //   const pageRef = useRef(1);
// //   const sentinelRef = useRef(null);

// //   /* Derive filtered+sorted product list */
// //   const filteredProducts = React.useMemo(() => {
// //     let list = [...MOCK_PRODUCTS];

// //     // search
// //     if (search.trim()) {
// //       list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
// //     }
// //     // category param
// //     if (category) {
// //       list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
// //     }

// //     // checked filters
// //     const active = Object.entries(checked).filter(([, v]) => v);
// //     if (active.length) {
// //       const byKey = {};
// //       active.forEach(([k]) => {
// //         const [key, option] = k.split('__');
// //         if (!byKey[key]) byKey[key] = [];
// //         byKey[key].push(option.toLowerCase());
// //       });
// //       list = list.filter(p => {
// //         return Object.entries(byKey).every(([key, opts]) => {
// //           if (key === 'size')     return p.sizes?.some(s => opts.includes(s.toLowerCase()));
// //           if (key === 'category') return opts.includes(p.category.toLowerCase());
// //           if (key === 'color')    return opts.includes(p.color.toLowerCase());
// //           if (key === 'discount') {
// //             const min = parseInt(opts[0]);
// //             return p.discount >= min;
// //           }
// //           return true;
// //         });
// //       });
// //     }

// //     // sort
// //     if (sort === 'price_asc')  list.sort((a, b) => a.price - b.price);
// //     if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
// //     if (sort === 'rating')     list.sort((a, b) => b.rating - a.rating);

// //     return list;
// //   }, [checked, sort, search, category]);

// //   /* Reset pagination when filters change */
// //   useEffect(() => {
// //     pageRef.current = 1;
// //     setVisibleProducts(filteredProducts.slice(0, PAGE_SIZE));
// //     setHasMore(filteredProducts.length > PAGE_SIZE);
// //   }, [filteredProducts]);

// //   /* Infinite scroll */
// //   const loadMore = useCallback(() => {
// //     if (loadingMore || !hasMore) return;
// //     setLoadingMore(true);
// //     setTimeout(() => {
// //       const start = pageRef.current * PAGE_SIZE;
// //       const slice = filteredProducts.slice(start, start + PAGE_SIZE);
// //       if (slice.length === 0) {
// //         setHasMore(false);
// //       } else {
// //         setVisibleProducts(prev => [...prev, ...slice]);
// //         pageRef.current += 1;
// //         if (start + PAGE_SIZE >= filteredProducts.length) setHasMore(false);
// //       }
// //       setLoadingMore(false);
// //     }, 500);
// //   }, [filteredProducts, loadingMore, hasMore]);

// //   useEffect(() => {
// //     const obs = new IntersectionObserver(entries => {
// //       if (entries[0].isIntersecting) loadMore();
// //     }, { threshold: 0.1 });
// //     if (sentinelRef.current) obs.observe(sentinelRef.current);
// //     return () => obs.disconnect();
// //   }, [loadMore]);

// //   const activeCount = Object.values(checked).filter(Boolean).length;

// //   return (
// //     <div className="w-full min-h-screen bg-white">
// //       <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

// //       {/* ── PAGE HEADER ─────────────────────────────────────────── */}
// //       <div className="border-b border-gray-100 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
// //         {/* Left: title + breadcrumb */}
// //         <div>
// //           <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
// //             <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
// //             <span>/</span>
// //             <span className="text-gray-600 font-medium">{category || 'All Products'}</span>
// //           </div>
// //           <h1
// //             className="text-3xl font-bold text-gray-900 tracking-tight"
// //             style={{ fontFamily: "'Cormorant Garamond', serif" }}
// //           >
// //             {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'All Products'}
// //           </h1>
// //           <p className="text-xs text-gray-400 mt-0.5">{filteredProducts.length} products found</p>
// //         </div>

// //         {/* Right: search + sort + mobile filter btn */}
// //         <div className="flex items-center gap-3 flex-wrap">
// //           {/* Search */}
// //           <div className="relative">
// //             <input
// //               type="text"
// //               value={search}
// //               onChange={e => setSearch(e.target.value)}
// //               placeholder="Search products…"
// //               className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 w-52 transition-all"
// //             />
// //             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
// //           </div>

// //           {/* Sort */}
// //           <select
// //             value={sort}
// //             onChange={e => setSort(e.target.value)}
// //             className="px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 bg-white cursor-pointer"
// //           >
// //             {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
// //           </select>

// //           {/* Mobile filter toggle */}
// //           <button
// //             onClick={() => setMobileFiltersOpen(true)}
// //             className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-rose-400 transition-colors"
// //           >
// //             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
// //             </svg>
// //             Filters {activeCount > 0 && <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>}
// //           </button>
// //         </div>
// //       </div>

// //       {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
// //       <div className="flex">

// //         {/* ── LEFT SIDEBAR (desktop) ──────────────────────────── */}
// //         <div className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
// //           <FilterSidebar
// //             checked={checked}
// //             setChecked={setChecked}
// //             onClear={() => setChecked({})}
// //           />
// //         </div>

// //         {/* ── RIGHT: PRODUCTS ─────────────────────────────────── */}
// //         <div className="flex-1 min-w-0 px-4 sm:px-6 py-6">

// //           {/* Active filter chips */}
// //           {activeCount > 0 && (
// //             <div className="flex flex-wrap gap-2 mb-5">
// //               {Object.entries(checked).filter(([, v]) => v).map(([k]) => {
// //                 const [, option] = k.split('__');
// //                 return (
// //                   <span
// //                     key={k}
// //                     className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1 rounded-full border border-rose-200"
// //                   >
// //                     {option}
// //                     <button
// //                       onClick={() => setChecked(prev => ({ ...prev, [k]: false }))}
// //                       className="hover:text-rose-800 transition-colors font-bold"
// //                     >×</button>
// //                   </span>
// //                 );
// //               })}
// //               <button
// //                 onClick={() => setChecked({})}
// //                 className="text-xs text-gray-400 hover:text-rose-500 transition-colors underline"
// //               >
// //                 Clear all
// //               </button>
// //             </div>
// //           )}

// //           {/* Grid */}
// //           {visibleProducts.length === 0 ? (
// //             <div className="text-center py-24">
// //               <div className="text-6xl mb-4">🔍</div>
// //               <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
// //               <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search</p>
// //               <button
// //                 onClick={() => { setChecked({}); setSearch(''); }}
// //                 className="px-6 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
// //               >
// //                 Reset Filters
// //               </button>
// //             </div>
// //           ) : (
// //             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
// //               {visibleProducts.map(p => (
// //                 <GridCard key={p._id} product={p} />
// //               ))}
// //             </div>
// //           )}

// //           {/* Infinite scroll sentinel */}
// //           <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-4">
// //             {loadingMore && (
// //               <div className="flex gap-2">
// //                 {[0, 1, 2].map(i => (
// //                   <div
// //                     key={i}
// //                     className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"
// //                     style={{ animationDelay: `${i * 0.15}s` }}
// //                   />
// //                 ))}
// //               </div>
// //             )}
// //             {!hasMore && visibleProducts.length > 0 && (
// //               <p className="text-gray-400 text-sm">You've seen it all 🌸</p>
// //             )}
// //           </div>
// //         </div>
// //       </div>

// //       {/* ── MOBILE FILTER DRAWER ────────────────────────────────── */}
// //       {mobileFiltersOpen && (
// //         <div className="fixed inset-0 z-50 lg:hidden">
// //           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
// //           <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto shadow-2xl">
// //             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
// //               <h3 className="font-semibold text-gray-800 tracking-wide">Filters</h3>
// //               <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
// //             </div>
// //             <FilterSidebar
// //               checked={checked}
// //               setChecked={setChecked}
// //               onClear={() => setChecked({})}
// //             />
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default CollectionPage;


// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { Link, useParams, useSearchParams } from 'react-router-dom';
// import { productAPI, categoryAPI } from '../utils/api';

// const FILTER_CONFIG = [
//   { title: 'SIZE',   key: 'size',   options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] },
//   { title: 'COLOR',  key: 'color',  options: ['Black', 'Blue', 'Pink', 'Green', 'Red', 'White', 'Yellow', 'Maroon', 'Navy', 'Peach', 'Lavender'] },
//   { title: 'PRICE',  key: 'price',  options: ['Under ₹500', '₹500–₹1000', '₹1000–₹2000', 'Above ₹2000'] },
//   { title: 'SEASON', key: 'season', options: ['summer', 'winter', 'monsoon', 'all'] },
// ];

// const SORT_OPTIONS = [
//   { value: 'newest',     label: 'Newest First' },
//   { value: 'price_asc',  label: 'Price: Low to High' },
//   { value: 'price_desc', label: 'Price: High to Low' },
//   { value: 'rating',     label: 'Best Rated' },
//   { value: 'popular',    label: 'Most Popular' },
// ];

// const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

// /* ─── Helper: price range checked → { minPrice, maxPrice } ──────── */
// const priceRange = (option) => {
//   if (option === 'Under ₹500')     return { minPrice: 0,    maxPrice: 500  };
//   if (option === '₹500–₹1000')    return { minPrice: 500,  maxPrice: 1000 };
//   if (option === '₹1000–₹2000')   return { minPrice: 1000, maxPrice: 2000 };
//   if (option === 'Above ₹2000')    return { minPrice: 2001, maxPrice: undefined };
//   return {};
// };

// /* ─── Helper: first image from schema ───────────────────────────── */
// const getImg = (p) =>
//   p?.images?.[0]?.url ||
//   p?.mainImage?.url ||
//   'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400';

// /* ─── Filter Sidebar ────────────────────────────────────────────── */
// const FilterSidebar = ({ checked, setChecked, onClear, categories }) => {
//   const [open, setOpen] = useState('SIZE');
//   const activeCount = Object.values(checked).filter(Boolean).length;

//   const toggle = (key, option) => {
//     setChecked(prev => ({ ...prev, [`${key}__${option}`]: !prev[`${key}__${option}`] }));
//   };

//   // Build full config: prepend CATEGORY using real DB categories
//   const config = [
//     {
//       title: 'CATEGORY',
//       key: 'category',
//       options: categories.map(c => ({ label: c.name, value: c.slug })),
//     },
//     ...FILTER_CONFIG.map(f => ({
//       ...f,
//       options: f.options.map(o => ({ label: o, value: o })),
//     })),
//   ];

//   return (
//     <aside className="w-full sticky top-20 self-start bg-white border-r border-gray-100 pt-6 pb-16">
//       <div className="px-6 mb-1 flex items-center justify-between">
//         <h2 className="text-xs font-semibold tracking-[3px] uppercase text-gray-400">
//           Filters
//           {activeCount > 0 && (
//             <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{activeCount}</span>
//           )}
//         </h2>
//         {activeCount > 0 && (
//           <button onClick={onClear} className="text-[11px] text-rose-500 hover:text-rose-700 font-medium transition-colors">
//             Clear All
//           </button>
//         )}
//       </div>

//       <div className="flex flex-col px-6">
//         {config.map(filter => (
//           <div key={filter.title} className="border-t border-gray-100 py-3.5">
//             <button
//               onClick={() => setOpen(open === filter.title ? '' : filter.title)}
//               className="flex w-full justify-between items-center cursor-pointer text-left group"
//             >
//               <span className="text-xs font-semibold tracking-[2px] uppercase text-gray-600 group-hover:text-gray-900 transition-colors">
//                 {filter.title}
//               </span>
//               <span className="text-gray-400 text-base leading-none group-hover:text-gray-700 transition-colors select-none">
//                 {open === filter.title ? '−' : '+'}
//               </span>
//             </button>

//             {open === filter.title && (
//               <div className="flex flex-col gap-2.5 mt-3.5">
//                 {filter.options.map(opt => {
//                   const k = `${filter.key}__${opt.value}`;
//                   return (
//                     <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group/item">
//                       <input
//                         type="checkbox"
//                         checked={!!checked[k]}
//                         onChange={() => toggle(filter.key, opt.value)}
//                         className="accent-rose-500 w-3.5 h-3.5 cursor-pointer rounded"
//                       />
//                       <span className={`text-sm transition-colors capitalize ${checked[k] ? 'text-gray-900 font-medium' : 'text-gray-500 group-hover/item:text-gray-800'}`}>
//                         {opt.label}
//                       </span>
//                     </label>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//     </aside>
//   );
// };

// /* ─── Grid Card (schema-aware) ───────────────────────────────────── */
// const GridCard = ({ product }) => {
//   const disc = product.discount ||
//     (product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

//   return (
//     <Link
//       to={`/product/${product.slug}`}
//       className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
//     >
//       <div className="relative aspect-[3/4] overflow-hidden bg-rose-50">
//         <img
//           src={getImg(product)}
//           alt={product.name}
//           className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
//         />
//         {disc > 0 && (
//           <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
//             {disc}% OFF
//           </span>
//         )}
//         {product.isNewArrival && (
//           <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
//             NEW
//           </span>
//         )}
//         <button
//           className="absolute bottom-2 right-2 bg-white/90 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
//           onClick={e => e.preventDefault()}
//         >♡</button>
//       </div>
//       <div className="p-3">
//         <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest truncate">
//           {product.category?.name}
//         </p>
//         <h3 className="text-sm font-semibold text-gray-800 truncate mt-0.5">{product.name}</h3>
//         <div className="flex items-center gap-2 mt-1.5">
//           <span className="text-rose-600 font-bold text-sm">₹{product.price}</span>
//           {product.mrp > product.price && (
//             <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
//           )}
//         </div>
//         <div className="flex items-center gap-1 mt-1">
//           <span className="text-yellow-400 text-xs">★ {product.rating?.toFixed(1) || '—'}</span>
//           <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
//         </div>
//       </div>
//     </Link>
//   );
// };

// /* ─── Skeleton Card ─────────────────────────────────────────────── */
// const SkeletonCard = () => (
//   <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
//     <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
//     <div className="p-3 space-y-2">
//       <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
//       <div className="h-3 bg-gray-100 rounded animate-pulse" />
//       <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
//     </div>
//   </div>
// );

// /* ══════════════════════════════════════════════════════════════════
//    COLLECTION PAGE
// ══════════════════════════════════════════════════════════════════ */
// const CollectionPage = () => {
//   const { category: categorySlug } = useParams();  // slug from URL e.g. "short-kurti"
//   const [searchParams] = useSearchParams();

//   const [categories, setCategories]         = useState([]);
//   const [products, setProducts]             = useState([]);
//   const [total, setTotal]                   = useState(0);
//   const [loading, setLoading]               = useState(true);
//   const [loadingMore, setLoadingMore]       = useState(false);
//   const [hasMore, setHasMore]               = useState(false);
//   const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

//   const [checked, setChecked] = useState({});
//   const [sort, setSort]       = useState('newest');
//   const [search, setSearch]   = useState(searchParams.get('q') || '');

//   const pageRef     = useRef(1);
//   const sentinelRef = useRef(null);
//   const searchTimer = useRef(null);
//   const PAGE_SIZE   = 12;

//     /* ── Sync search state when URL ?search= param changes ─────── */
//   useEffect(() => {
//     const q = searchParams.get('search') || '';
//     setSearch(q);
//   }, [searchParams]); 

//   /* ── Fetch categories once ──────────────────────────────────── */
//   useEffect(() => {
//     categoryAPI.getAll()
//       .then(res => setCategories(res.data.categories || []))
//       .catch(console.error);
//   }, []);

//   /* ── Build API params from UI state ─────────────────────────── */
//   const buildParams = useCallback((page = 1) => {
//     const params = { page, limit: PAGE_SIZE, sort };

//     // category from URL slug
//     if (categorySlug) params.category = categorySlug;

//     // search
//     if (search.trim()) params.search = search.trim();

//     // checked filters → map to API params
//     const active = Object.entries(checked).filter(([, v]) => v);
//     if (active.length) {
//       const sizes    = [];
//       const colors   = [];
//       const seasons  = [];
//       let   minPrice, maxPrice;

//       active.forEach(([k]) => {
//         const [key, value] = k.split('__');
//         if (key === 'size')     sizes.push(value);
//         if (key === 'color')    colors.push(value);
//         if (key === 'season')   seasons.push(value);
//         if (key === 'price') {
//           const r = priceRange(value);
//           if (r.minPrice !== undefined) minPrice = r.minPrice;
//           if (r.maxPrice !== undefined) maxPrice = r.maxPrice;
//           // override category filter from checkbox if set
//         }
//         if (key === 'category') params.category = value; // slug
//       });

//       if (sizes.length)   params.size     = sizes.join(',');    // controller: size.split(',')
//       if (colors.length)  params.color    = colors.join(',');   // controller: color.split(',')
//       if (seasons.length) params.season   = seasons[0];         // take first (radio-like)
//       if (minPrice !== undefined) params.minPrice = minPrice;
//       if (maxPrice !== undefined) params.maxPrice = maxPrice;
//     }

//     return params;
//   }, [categorySlug, search, checked, sort]);

//   /* ── Initial / filter-change fetch ──────────────────────────── */
//   useEffect(() => {
//     let cancelled = false;
//     setLoading(true);
//     pageRef.current = 1;

//     productAPI.getAll(buildParams(1))
//       .then(res => {
//         if (cancelled) return;
//         const { products: list = [], pagination = {} } = res.data;
//         setProducts(list);
//         setTotal(pagination.total || list.length);
//         setHasMore(pagination.page < pagination.pages);
//         pageRef.current = 1;
//       })
//       .catch(console.error)
//       .finally(() => { if (!cancelled) setLoading(false); });

//     return () => { cancelled = true; };
//   }, [buildParams]);

//   /* ── Infinite scroll loadMore ───────────────────────────────── */
//   const loadMore = useCallback(() => {
//     if (loadingMore || !hasMore) return;
//     setLoadingMore(true);
//     const nextPage = pageRef.current + 1;

//     productAPI.getAll(buildParams(nextPage))
//       .then(res => {
//         const { products: list = [], pagination = {} } = res.data;
//         setProducts(prev => [...prev, ...list]);
//         pageRef.current = nextPage;
//         setHasMore(pagination.page < pagination.pages);
//       })
//       .catch(console.error)
//       .finally(() => setLoadingMore(false));
//   }, [loadingMore, hasMore, buildParams]);

//   useEffect(() => {
//     const obs = new IntersectionObserver(
//       entries => { if (entries[0].isIntersecting) loadMore(); },
//       { threshold: 0.1 }
//     );
//     if (sentinelRef.current) obs.observe(sentinelRef.current);
//     return () => obs.disconnect();
//   }, [loadMore]);

//   /* ── Debounce search input ───────────────────────────────────── */
//   const handleSearch = (val) => {
//     setSearch(val);
//   };

//   const activeCount    = Object.values(checked).filter(Boolean).length;
//   const categoryLabel  = categories.find(c => c.slug === categorySlug)?.name || categorySlug;

//   return (
//     <div className="w-full min-h-screen bg-white">
//       <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

//       {/* ── PAGE HEADER ─────────────────────────────────────────── */}
//       <div className="border-b border-gray-100 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
//         <div>
//           <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
//             <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
//             <span>/</span>
//             <Link to="/collection" className="hover:text-rose-500 transition-colors">Collection</Link>
//             {categorySlug && (
//               <>
//                 <span>/</span>
//                 <span className="text-gray-600 font-medium capitalize">{categoryLabel}</span>
//               </>
//             )}
//           </div>
//           <h1 className="text-3xl font-bold text-gray-900 tracking-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
//             {categoryLabel
//               ? categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)
//               : 'All Products'}
//           </h1>
//           <p className="text-xs text-gray-400 mt-0.5">{total} products found</p>
//         </div>

//         <div className="flex items-center gap-3 flex-wrap">
//           {/* Search */}
//           <div className="relative">
//             <input
//               type="text"
//               value={search}
//               onChange={e => handleSearch(e.target.value)}
//               placeholder="Search products…"
//               className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 w-52 transition-all"
//             />
//             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
//           </div>

//           {/* Sort */}
//           <select
//             value={sort}
//             onChange={e => setSort(e.target.value)}
//             className="px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 bg-white cursor-pointer"
//           >
//             {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
//           </select>

//           {/* Mobile filter toggle */}
//           <button
//             onClick={() => setMobileFiltersOpen(true)}
//             className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-rose-400 transition-colors"
//           >
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
//             </svg>
//             Filters
//             {activeCount > 0 && (
//               <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{activeCount}</span>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* ── MAIN LAYOUT ─────────────────────────────────────────── */}
//       <div className="flex">
//         {/* Sidebar */}
//         <div className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
//           <FilterSidebar
//             checked={checked}
//             setChecked={setChecked}
//             onClear={() => setChecked({})}
//             categories={categories}
//           />
//         </div>

//         {/* Products */}
//         <div className="flex-1 min-w-0 px-4 sm:px-6 py-6">

//           {/* Active filter chips */}
//           {activeCount > 0 && (
//             <div className="flex flex-wrap gap-2 mb-5">
//               {Object.entries(checked).filter(([, v]) => v).map(([k]) => {
//                 const [, option] = k.split('__');
//                 return (
//                   <span key={k} className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1 rounded-full border border-rose-200">
//                     {option}
//                     <button onClick={() => setChecked(prev => ({ ...prev, [k]: false }))} className="hover:text-rose-800 font-bold">×</button>
//                   </span>
//                 );
//               })}
//               <button onClick={() => setChecked({})} className="text-xs text-gray-400 hover:text-rose-500 underline">Clear all</button>
//             </div>
//           )}

//           {/* Grid */}
//           {loading ? (
//             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
//               {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center py-24">
//               <div className="text-6xl mb-4">🔍</div>
//               <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
//               <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search</p>
//               <button
//                 onClick={() => { setChecked({}); setSearch(''); }}
//                 className="px-6 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
//               >
//                 Reset Filters
//               </button>
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
//               {products.map(p => <GridCard key={p._id} product={p} />)}
//             </div>
//           )}

//           {/* Sentinel */}
//           <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-4">
//             {loadingMore && (
//               <div className="flex gap-2">
//                 {[0, 1, 2].map(i => (
//                   <div key={i} className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
//                 ))}
//               </div>
//             )}
//             {!hasMore && products.length > 0 && !loading && (
//               <p className="text-gray-400 text-sm">You've seen it all 🌸</p>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* ── MOBILE DRAWER ───────────────────────────────────────── */}
//       {mobileFiltersOpen && (
//         <div className="fixed inset-0 z-50 lg:hidden">
//           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
//           <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto shadow-2xl">
//             <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
//               <h3 className="font-semibold text-gray-800 tracking-wide">Filters</h3>
//               <button onClick={() => setMobileFiltersOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
//             </div>
//             <FilterSidebar
//               checked={checked}
//               setChecked={setChecked}
//               onClear={() => setChecked({})}
//               categories={categories}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CollectionPage;



// pages/CollectionPage.jsx
// Changes from original:
//   1. Removed hardcoded FILTER_CONFIG, SIZE_ORDER, priceRange() helper
//   2. Removed categoryAPI import (categories now come from filters endpoint)
//   3. Added filterConfig + filtersLoading state, fetched via productAPI.getFilters()
//   4. FilterSidebar extracted to components/collection/FilterSidebar.jsx
//   5. buildParams extended to handle fabric filter key
//   6. Active-chip labels now resolve from filterConfig (human-readable)
//   Everything else — layout, grid, infinite scroll, mobile drawer — is unchanged.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { productAPI } from '../../src/utils/api'
import FilterSidebar, { buildFilterConfig } from '../components/common/FilterSidebar'

/* ─── Sort options (unchanged) ──────────────────────────────────── */
const SORT_OPTIONS = [
  { value: 'newest',     label: 'Newest First' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Best Rated' },
  { value: 'popular',    label: 'Most Popular' },
];

/* ─── Helper: first valid image from product schema ─────────────── */
const getImg = (p) =>
  p?.images?.[0]?.url ||
  p?.mainImage?.url ||
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400';

/* ─── Grid Card (unchanged) ─────────────────────────────────────── */
const GridCard = ({ product }) => {
  const disc =
    product.discount ||
    (product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : 0);

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group rounded-xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-rose-50">
        <img
          src={getImg(product)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
        />
        {disc > 0 && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {disc}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
        <button
          className="absolute bottom-2 right-2 bg-white/90 text-rose-400 w-8 h-8 rounded-full flex items-center justify-center shadow opacity-0 group-hover:opacity-100 transition-all hover:bg-rose-500 hover:text-white"
          onClick={e => e.preventDefault()}
        >
          ♡
        </button>
      </div>
      <div className="p-3">
        <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 truncate mt-0.5">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-rose-600 font-bold text-sm">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">★ {product.rating?.toFixed(1) || '—'}</span>
          <span className="text-xs text-gray-400">({product.numReviews || 0})</span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Skeleton Card (unchanged) ─────────────────────────────────── */
const SkeletonCard = () => (
  <div className="rounded-xl overflow-hidden bg-white border border-gray-100">
    <div className="aspect-[3/4] bg-gray-100 animate-pulse" />
    <div className="p-3 space-y-2">
      <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
      <div className="h-3 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   COLLECTION PAGE
══════════════════════════════════════════════════════════════════ */
const CollectionPage = () => {
  const { category: categorySlug } = useParams();
  const [searchParams] = useSearchParams();

  // ── Dynamic filter config ──────────────────────────────────────
  // Fetched once from MongoDB; new products automatically appear
  // in sidebar without any frontend code change.
  const [filterConfig, setFilterConfig]       = useState([]);
  const [filtersLoading, setFiltersLoading]   = useState(true);
  const [categories, setCategories]           = useState([]);    // for breadcrumb label

  // ── Products state (unchanged) ────────────────────────────────
  const [products, setProducts]               = useState([]);
  const [total, setTotal]                     = useState(0);
  const [loading, setLoading]                 = useState(true);
  const [loadingMore, setLoadingMore]         = useState(false);
  const [hasMore, setHasMore]                 = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const [checked, setChecked] = useState({});
  const [sort, setSort]       = useState('newest');
  const [search, setSearch]   = useState(searchParams.get('q') || '');

  const pageRef     = useRef(1);
  const sentinelRef = useRef(null);
  const PAGE_SIZE   = 12;

  /* ── Sync search when URL ?search= param changes (unchanged) ── */
  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearch(q);
  }, [searchParams]);

  /* ── Fetch dynamic filters from MongoDB — runs once on mount ──
     If a new color / size / fabric is added via the admin panel
     it will appear here after the next page load. No code change needed.
  ────────────────────────────────────────────────────────────────  */
  useEffect(() => {
    setFiltersLoading(true);
    productAPI.getFilters()
      .then(res => {
        if (!res.data.success) return;
        const { filters } = res.data;
        setFilterConfig(buildFilterConfig(filters));
        setCategories(filters.categories || []);                 // used for breadcrumb
      })
      .catch(err => {
        console.error('Failed to load filters:', err);
        // sidebar stays in skeleton; products still load fine
      })
      .finally(() => setFiltersLoading(false));
  }, []);

  /* ── Build API query params from current UI state ────────────── */
  const buildParams = useCallback((page = 1) => {
    const params = { page, limit: PAGE_SIZE, sort };

    if (categorySlug)   params.category = categorySlug;
    if (search.trim())  params.search   = search.trim();

    const active = Object.entries(checked).filter(([, v]) => v);
    if (active.length) {
      const sizes   = [];
      const colors  = [];
      const fabrics = [];
      const seasons = [];
      let minPrice, maxPrice;

      active.forEach(([k]) => {
        const [key, value] = k.split('__');
        if (key === 'size')     sizes.push(value);
        if (key === 'color')    colors.push(value);
        if (key === 'fabric')   fabrics.push(value);            // ← new vs original
        if (key === 'season')   seasons.push(value);
        if (key === 'category') params.category = value;        // slug overrides URL slug
        if (key === 'price') {
          // look up the matching option in filterConfig to get minPrice/maxPrice
          const pf  = filterConfig.find(f => f.key === 'price');
          const opt = pf?.options.find(o => o.value === value);
          if (opt) {
            if (opt.minPrice !== undefined) minPrice = opt.minPrice;
            if (opt.maxPrice !== undefined) maxPrice = opt.maxPrice;
          }
        }
      });

      if (sizes.length)              params.size     = sizes.join(',');
      if (colors.length)             params.color    = colors.join(',');
      if (fabrics.length)            params.fabric   = fabrics.join(',');  // ← new
      if (seasons.length)            params.season   = seasons[0];         // single-select
      if (minPrice !== undefined)    params.minPrice = minPrice;
      if (maxPrice !== undefined)    params.maxPrice = maxPrice;
    }

    return params;
  }, [categorySlug, search, checked, sort, filterConfig]);

  /* ── Initial / filter-change fetch (unchanged logic) ─────────── */
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    pageRef.current = 1;

    productAPI.getAll(buildParams(1))
      .then(res => {
        if (cancelled) return;
        const { products: list = [], pagination = {} } = res.data;
        setProducts(list);
        setTotal(pagination.total || list.length);
        setHasMore(pagination.page < pagination.pages);
        pageRef.current = 1;
      })
      .catch(console.error)
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [buildParams]);

  /* ── Infinite scroll loadMore (unchanged) ────────────────────── */
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const nextPage = pageRef.current + 1;

    productAPI.getAll(buildParams(nextPage))
      .then(res => {
        const { products: list = [], pagination = {} } = res.data;
        setProducts(prev => [...prev, ...list]);
        pageRef.current = nextPage;
        setHasMore(pagination.page < pagination.pages);
      })
      .catch(console.error)
      .finally(() => setLoadingMore(false));
  }, [loadingMore, hasMore, buildParams]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  /* ── Derived values ───────────────────────────────────────────── */
  const activeCount   = Object.values(checked).filter(Boolean).length;
  const categoryLabel = categories.find(c => c.slug === categorySlug)?.name || categorySlug;

  /* ── Shared FilterSidebar props (DRY — used in both desktop + mobile) ── */
  const sidebarProps = {
    checked,
    setChecked,
    onClear:        () => setChecked({}),
    filterConfig,                                                // pass pre-fetched config
    filtersLoading,                                              // pass loading state
  };

  /* ════════════════════════════════════════════════════════════════
     RENDER — layout and every className is identical to original
  ════════════════════════════════════════════════════════════════ */
  return (
    <div className="w-full min-h-screen bg-white">
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── PAGE HEADER (unchanged) ──────────────────────────────── */}
      <div className="border-b border-gray-100 px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <Link to="/" className="hover:text-rose-500 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/collection" className="hover:text-rose-500 transition-colors">Collection</Link>
            {categorySlug && (
              <>
                <span>/</span>
                <span className="text-gray-600 font-medium capitalize">{categoryLabel}</span>
              </>
            )}
          </div>
          <h1
            className="text-3xl font-bold text-gray-900 tracking-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            {categoryLabel
              ? categoryLabel.charAt(0).toUpperCase() + categoryLabel.slice(1)
              : 'All Products'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">{total} products found</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search (unchanged) */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products…"
              className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 w-52 transition-all"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          </div>

          {/* Sort (unchanged) */}
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="px-4 py-2 text-sm border border-gray-200 rounded-full focus:outline-none focus:border-rose-400 bg-white cursor-pointer"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>

          {/* Mobile filter toggle (unchanged) */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-rose-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── MAIN LAYOUT (unchanged) ──────────────────────────────── */}
      <div className="flex">

        {/* Desktop sidebar — FilterSidebar now its own component */}
        <div className="hidden lg:block w-60 xl:w-64 flex-shrink-0">
          <FilterSidebar {...sidebarProps} />
        </div>

        {/* ── Products panel ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0 px-4 sm:px-6 py-6">

          {/* Active filter chips
              CHANGED: chip label now resolves human-readable text from filterConfig
              so "500-1000" shows as "₹500 – ₹1,000" etc. */}
          {activeCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {Object.entries(checked)
                .filter(([, v]) => v)
                .map(([k]) => {
                  const [filterKey, optValue] = k.split('__');
                  const fc    = filterConfig.find(f => f.key === filterKey);
                  const opt   = fc?.options.find(o => o.value === optValue);
                  const label = opt?.label || optValue;          // human-readable fallback
                  return (
                    <span
                      key={k}
                      className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 text-xs font-medium px-3 py-1 rounded-full border border-rose-200"
                    >
                      {label}
                      <button
                        onClick={() => setChecked(prev => ({ ...prev, [k]: false }))}
                        className="hover:text-rose-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              <button
                onClick={() => setChecked({})}
                className="text-xs text-gray-400 hover:text-rose-500 underline"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Product grid (unchanged) */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-400 text-sm mb-6">Try adjusting your filters or search</p>
              <button
                onClick={() => { setChecked({}); setSearch(''); }}
                className="px-6 py-2.5 bg-rose-500 text-white text-sm font-semibold rounded-full hover:bg-rose-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {products.map(p => <GridCard key={p._id} product={p} />)}
            </div>
          )}

          {/* Infinite scroll sentinel (unchanged) */}
          <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-4">
            {loadingMore && (
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            {!hasMore && products.length > 0 && !loading && (
              <p className="text-gray-400 text-sm">You've seen it all 🌸</p>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE FILTER DRAWER (unchanged layout) ──────────────── */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 tracking-wide">Filters</h3>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            {/* Same component instance, same pre-fetched data — no double API call */}
            <FilterSidebar {...sidebarProps} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;