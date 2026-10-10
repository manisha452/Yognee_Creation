import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../utils/api';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const BANNERS = [
  {
    id: 1,
    bg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80',
    badge: '✨ New Summer Collection 2025',
    title: 'Dress to\nImpress',
    sub: "India's finest girls' fashion — kurtis, suits & more.",
    cta: 'Shop Now',
    link: '/collection',
    pos: 'left',
    color: '#f43f5e',
  },
  {
    id: 2,
    bg: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1600&q=80',
    badge: '🌸 Summer Sale — Up to 50% Off',
    title: 'Beat the\nHeat',
    sub: 'Breezy styles for every occasion this season.',
    cta: 'Shop Sale',
    link: '/collection/summer-collection',
    pos: 'right',
    color: '#f97316',
  },
  {
    id: 3,
    bg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=1600&q=80',
    badge: '🔥 Best Sellers',
    title: 'Fan\nFavourites',
    sub: 'Loved by 50,000+ happy customers across India.',
    cta: 'Explore',
    link: '/collection?bestSeller=true',
    pos: 'center',
    color: '#8b5cf6',
  },
];

const PAGE_SIZE = 12;

/* ─── Wishlist Heart Button ──────────────────────────────────────── */
const WishlistBtn = ({ productId, className = '' }) => {
  const { toggle, isWishlisted } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();
  const wishlisted = isWishlisted(productId);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to wishlist'); navigate('/login'); return; }
    try {
      const res = await toggle(productId);
      toast.success(res?.message || (wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♡'));
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center transition-all ${className}`}
      title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </button>
  );
};

/* ─── Mini Card (horizontal strip) ──────────────────────────────── */
const MiniCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400';
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex-shrink-0 w-44 rounded-2xl overflow-hidden bg-white border border-rose-100 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
        {/* Wishlist button */}
        <WishlistBtn
          productId={product._id}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full shadow text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 truncate mt-0.5">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-rose-600 font-bold text-sm">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">★</span>
          <span className="text-xs text-gray-500">{product.rating?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Grid Card (vertical section) ──────────────────────────────── */
const GridCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400';
  const discount = product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group rounded-2xl overflow-hidden bg-white border border-rose-50 shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-rose-50">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-rose-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
        {product.isNewArrival && (
          <span className="absolute top-2 right-2 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
            NEW
          </span>
        )}
        {/* Wishlist button — visible on hover */}
        <WishlistBtn
          productId={product._id}
          className="absolute bottom-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full shadow-md text-rose-400 hover:text-rose-600 hover:bg-white opacity-0 group-hover:opacity-100"
        />
      </div>
      <div className="p-3">
        <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest truncate">
          {product.category?.name}
        </p>
        <h3 className="text-sm font-semibold text-gray-800 truncate mt-0.5">{product.name}</h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-rose-600 font-bold">₹{product.price}</span>
          {product.mrp > product.price && (
            <span className="text-gray-400 line-through text-xs">₹{product.mrp}</span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-yellow-400 text-xs">★ {product.rating?.toFixed(1)}</span>
          <span className="text-xs text-gray-400">({product.numReviews})</span>
        </div>
      </div>
    </Link>
  );
};

/* ─── Skeleton ───────────────────────────────────────────────────── */
const SkeletonCard = ({ mini = false }) => (
  <div className={`flex-shrink-0 rounded-2xl overflow-hidden bg-white border border-rose-50 ${mini ? 'w-44' : ''}`}>
    <div className={`bg-gray-100 animate-pulse ${mini ? 'h-52' : 'aspect-[3/4]'}`} />
    <div className="p-3 space-y-2">
      <div className="h-2 bg-gray-100 rounded animate-pulse w-1/2" />
      <div className="h-3 bg-gray-100 rounded animate-pulse" />
      <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════════════════════════════ */
const HomePage = () => {
  const [activeBanner, setActiveBanner]   = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [categories, setCategories]       = useState([]);
  const [allProducts, setAllProducts]     = useState([]);
  const [hProducts, setHProducts]         = useState([]);
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [hasMore, setHasMore]             = useState(false);
  const [loadingMore, setLoadingMore]     = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const hScrollRef  = useRef(null);
  const sentinelRef = useRef(null);
  const pageRef     = useRef(1);

  /* ── Auto-advance banner ─────────────────────────────────────── */
  useEffect(() => {
    const t = setInterval(() => setActiveBanner(b => (b + 1) % BANNERS.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* ── Fetch categories ────────────────────────────────────────── */
  useEffect(() => {
    categoryAPI.getAll()
      .then(res => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  /* ── Fetch all products ──────────────────────────────────────── */
  useEffect(() => {
    setLoadingProducts(true);
    productAPI.getAll({ limit: 100, isActive: true })
      .then(res => {
        const list = res.data.products || [];
        setAllProducts(list);
        setHProducts(list.slice(0, 16));
        setVisibleProducts(list.slice(0, PAGE_SIZE));
        pageRef.current = 1;
        setHasMore(list.length > PAGE_SIZE);
      })
      .catch(console.error)
      .finally(() => setLoadingProducts(false));
  }, []);

  /* ── Filter horizontal strip by category pill ───────────────── */
  useEffect(() => {
    if (!activeCategory) {
      setHProducts(allProducts.slice(0, 16));
    } else {
      setHProducts(allProducts.filter(p =>
        (p.category?._id ?? p.category) === activeCategory
      ));
    }
  }, [activeCategory, allProducts]);

  /* ── Infinite scroll loadMore ───────────────────────────────── */
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      const start = pageRef.current * PAGE_SIZE;
      const slice = allProducts.slice(start, start + PAGE_SIZE);
      if (slice.length === 0) {
        setHasMore(false);
      } else {
        setVisibleProducts(prev => [...prev, ...slice]);
        pageRef.current += 1;
        if (start + PAGE_SIZE >= allProducts.length) setHasMore(false);
      }
      setLoadingMore(false);
    }, 400);
  }, [loadingMore, hasMore, allProducts]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) loadMore(); },
      { threshold: 0.1 }
    );
    if (sentinelRef.current) obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [loadMore]);

  const bn = BANNERS[activeBanner];

  return (
    <div className="min-h-screen bg-white">
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,600&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* ── BANNER ───────────────────────────────────────────────── */}
      <section className="relative h-[88vh] min-h-[480px] overflow-hidden">
        {BANNERS.map((b, i) => (
          <div key={b.id} className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === activeBanner ? 1 : 0, zIndex: i === activeBanner ? 1 : 0 }}>
            <img src={b.bg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{
              background: b.pos === 'right'
                ? 'linear-gradient(to left,rgba(0,0,0,.6) 0%,rgba(0,0,0,.15) 60%,transparent 100%)'
                : 'linear-gradient(to right,rgba(0,0,0,.6) 0%,rgba(0,0,0,.15) 60%,transparent 100%)',
            }} />
            <div className={`absolute inset-0 flex items-center px-8 sm:px-16 ${b.pos === 'right' ? 'justify-end' : b.pos === 'center' ? 'justify-center' : 'justify-start'}`} style={{ zIndex: 2 }}>
              <div className={`max-w-lg text-white ${b.pos === 'center' ? 'text-center' : ''}`}>
                <span className="inline-block text-white text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5" style={{ background: b.color }}>{b.badge}</span>
                <h1 className="text-6xl sm:text-7xl font-bold leading-none mb-5 whitespace-pre-line" style={{ fontFamily: "'Cormorant Garamond', serif", textShadow: '0 2px 24px rgba(0,0,0,.3)' }}>{b.title}</h1>
                <p className="text-white/85 text-base sm:text-lg leading-relaxed mb-8">{b.sub}</p>
                <div className={`flex gap-4 flex-wrap ${b.pos === 'center' ? 'justify-center' : ''}`}>
                  <Link to={b.link} className="text-white text-sm font-semibold px-7 py-3 rounded-full hover:brightness-110 hover:-translate-y-0.5 transition-all shadow-lg" style={{ background: b.color }}>{b.cta} →</Link>
                  <Link to="/collection" className="text-white text-sm font-semibold px-7 py-3 rounded-full border-2 border-white/60 hover:bg-white/15 transition-all">View All</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-10">
          {BANNERS.map((_, i) => (
            <button key={i} onClick={() => setActiveBanner(i)}
              className="h-2.5 rounded-full border-none cursor-pointer transition-all duration-300"
              style={{ width: i === activeBanner ? 32 : 10, background: i === activeBanner ? '#f43f5e' : 'rgba(255,255,255,.55)' }} />
          ))}
        </div>
        <button onClick={() => setActiveBanner(b => (b - 1 + BANNERS.length) % BANNERS.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 flex items-center justify-center hover:bg-white/35 transition-all text-lg">‹</button>
        <button onClick={() => setActiveBanner(b => (b + 1) % BANNERS.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/30 flex items-center justify-center hover:bg-white/35 transition-all text-lg">›</button>
      </section>

      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section className="py-14 bg-rose-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Shop by Category</h2>
            <p className="text-gray-400 text-sm mt-2 tracking-wide">Tap a style to explore</p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat._id} to={`/collection/${cat.slug}`} className="group flex flex-col items-center gap-3">
                <div className="w-full aspect-square rounded-2xl overflow-hidden shadow-sm group-hover:shadow-xl transition-all duration-300 relative">
                  <img
                    src={cat.image || 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold">{cat.icon}</span>
                </div>
                <span className="text-sm font-semibold text-gray-700 group-hover:text-rose-500 transition-colors">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── HORIZONTAL SCROLL ────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Trending Now</h2>
              <p className="text-gray-400 text-sm mt-1">Scroll to discover →</p>
            </div>
            <Link to="/collection" className="text-rose-500 text-sm font-semibold hover:text-rose-700 transition-colors">View All →</Link>
          </div>

          {/* Category pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-3 mb-6" style={{ scrollbarWidth: 'none' }}>
            <button onClick={() => setActiveCategory(null)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${activeCategory === null ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-600 border-rose-200 hover:border-rose-400'}`}>
              All
            </button>
            {categories.map(c => (
              <button key={c._id} onClick={() => setActiveCategory(c._id)}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-semibold border-2 transition-all ${activeCategory === c._id ? 'bg-rose-500 text-white border-rose-500' : 'bg-white text-rose-600 border-rose-200 hover:border-rose-400'}`}>
                {c.name}
              </button>
            ))}
          </div>

          {/* Strip */}
          <div className="relative">
            <div ref={hScrollRef} className="flex gap-4 overflow-x-auto pb-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#fda4af transparent' }}>
              {loadingProducts
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} mini />)
                : hProducts.map(p => <MiniCard key={p._id} product={p} />)
              }
              {!loadingProducts && (
                <Link to="/collection"
                  className="flex-shrink-0 w-44 h-52 rounded-2xl border-2 border-dashed border-rose-200 flex flex-col items-center justify-center gap-2 text-rose-400 hover:border-rose-400 hover:text-rose-500 transition-colors self-start">
                  <span className="text-3xl">→</span>
                  <span className="text-xs font-semibold">View All</span>
                </Link>
              )}
            </div>
            <button onClick={() => hScrollRef.current?.scrollBy({ left: -480, behavior: 'smooth' })}
              className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white border-2 border-rose-200 text-rose-500 shadow-md flex items-center justify-center hover:bg-rose-50 transition-all z-10 text-lg">‹</button>
            <button onClick={() => hScrollRef.current?.scrollBy({ left: 480, behavior: 'smooth' })}
              className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-rose-500 border-2 border-rose-500 text-white shadow-md flex items-center justify-center hover:bg-rose-600 transition-all z-10 text-lg">›</button>
          </div>
        </div>
      </section>

      {/* ── ALL PRODUCTS — Infinite scroll ───────────────────────── */}
      <section className="py-14 bg-rose-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Cormorant Garamond', serif" }}>All Products</h2>
              <p className="text-gray-400 text-sm mt-1">{allProducts.length} styles & counting</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
            {loadingProducts
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => <SkeletonCard key={i} />)
              : visibleProducts.map(p => <GridCard key={p._id} product={p} />)
            }
          </div>

          {/* Infinite scroll sentinel — restored */}
          <div ref={sentinelRef} className="h-16 flex items-center justify-center mt-6">
            {loadingMore && (
              <div className="flex gap-2">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            {!hasMore && !loadingProducts && visibleProducts.length > 0 && (
              <p className="text-gray-400 text-sm font-medium">You've seen it all 🌸</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

