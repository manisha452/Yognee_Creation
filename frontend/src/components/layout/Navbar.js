// import React, { useState, useEffect, useRef } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { categoryAPI } from '../../utils/api';
// import toast from 'react-hot-toast';

// const Navbar = () => {
//   const { user, logout, isAdmin } = useAuth();
//   const { totalItems } = useCart();
//   const { wishlist } = useWishlist();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [categories, setCategories] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [userMenuOpen, setUserMenuOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);
//   const userMenuRef = useRef(null);

//   useEffect(() => {
//     categoryAPI.getAll().then(res => setCategories(res.data.categories || [])).catch(() => { });
//   }, []);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 20);
//     window.addEventListener('scroll', handleScroll);
//     return () => window.removeEventListener('scroll', handleScroll);
//   }, []);

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (searchQuery.trim()) {
//       navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
//       setSearchQuery('');
//     }
//   };

//   const handleLogout = () => {
//     logout();
//     toast.success('Logged out successfully');
//     navigate('/');
//     setUserMenuOpen(false);
//   };

//   return (
//     <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
//       {/* Top bar */}
//       <div className="bg-rose-600 text-white text-xs py-1.5 text-center font-body hidden sm:block">
//         ✨ Free shipping on orders above ₹999 | Easy 7-day returns | COD available
//       </div>

//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link to="/" className="flex items-center gap-2 group">
//             <div className="w-9 h-9 bg-rose-600 rounded-full flex items-center justify-center text-white font-display font-bold text-lg">Z</div>
//             <span className="font-display text-2xl font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
//               Zuri <span className="text-rose-600 font-accent italic">Fashion</span>
//             </span>
//           </Link>

//           {/* Desktop Nav */}
//           <nav className="hidden lg:flex items-center gap-6">
//             <Link to="/" className={`text-sm font-medium transition-colors hover:text-rose-600 ${location.pathname === '/' ? 'text-rose-600' : 'text-gray-700'}`}>Home</Link>
//             <Link to="/collection" className={`text-sm font-medium transition-colors hover:text-rose-600 ${location.pathname.startsWith('/collection') ? 'text-rose-600' : 'text-gray-700'}`}>All Products</Link>
//             {categories.map(cat => (
//               <Link key={cat._id} to={`/collection/${cat.slug}`} className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors whitespace-nowrap">
//                 {cat.name}
//               </Link>
//             ))}
//           </nav>

//           {/* Search Bar */}
//           <form onSubmit={handleSearch} className="hidden md:flex items-center">
//             <div className="relative">
//               <input
//                 type="text"
//                 value={searchQuery}
//                 onChange={e => setSearchQuery(e.target.value)}
//                 placeholder="Search products..."
//                 className="w-52 pl-4 pr-10 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-200 bg-gray-50"
//               />
//               <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//               </button>
//             </div>
//           </form>

//           {/* Actions */}
//           <div className="flex items-center gap-3">
//             {/* Wishlist */}
//             <Link to="/wishlist" className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
//               {wishlist.length > 0 && <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{wishlist.length}</span>}
//             </Link>

//             {/* Cart */}
//             <Link to="/cart" className="relative p-2 text-gray-600 hover:text-rose-600 transition-colors">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" /></svg>
//               {totalItems > 0 && <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">{totalItems}</span>}
//             </Link>

//             {/* User Menu */}
//             {user ? (
//               <div className="relative" ref={userMenuRef}>
//                 <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-2 rounded-full hover:bg-rose-50 transition-colors">
//                   <div className="w-7 h-7 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-semibold text-sm">
//                     {user.name?.charAt(0).toUpperCase()}
//                   </div>
//                   <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
//                 </button>
//                 {userMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-slide-down">
//                     <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600">My Profile</Link>
//                     <Link to="/orders" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600">My Orders</Link>
//                     <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600">Wishlist</Link>
//                     {isAdmin && <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2 text-sm text-rose-600 font-medium hover:bg-rose-50">⚙️ Admin Panel</Link>}
//                     <hr className="my-1 border-gray-100" />
//                     <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Logout</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <Link to="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
//             )}

//             {/* Mobile Menu Button */}
//             <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-gray-600 hover:text-rose-600">
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 {mobileOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileOpen && (
//           <div className="lg:hidden pb-4 border-t border-gray-100 animate-slide-down">
//             <form onSubmit={handleSearch} className="mt-3 flex gap-2">
//               <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products..." className="flex-1 px-4 py-2 rounded-full border border-gray-200 text-sm focus:outline-none focus:border-rose-400" />
//               <button type="submit" className="px-4 py-2 bg-rose-600 text-white rounded-full text-sm">Search</button>
//             </form>
//             <nav className="mt-3 flex flex-col gap-1">
//               <Link to="/" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg">Home</Link>
//               <Link to="/collection" onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg">All Products</Link>
//               {categories.map(cat => (
//                 <Link key={cat._id} to={`/collection/${cat.slug}`} onClick={() => setMobileOpen(false)} className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
//                   {cat.icon} {cat.name}
//                 </Link>
//               ))}
//             </nav>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Navbar;


import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { categoryAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [categories, setCategories]   = useState([]);
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled]       = useState(false);

  const userMenuRef  = useRef(null);
  const searchRef    = useRef(null);
  const searchInput  = useRef(null);

  useEffect(() => {
    categoryAPI.getAll()
      .then(res => setCategories(res.data.categories || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* close dropdowns on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current  && !searchRef.current.contains(e.target))  { setSearchOpen(false); setSearchQuery(''); }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* focus input when search opens */
  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 50);
  }, [searchOpen]);

  /* close search on route change */
  useEffect(() => {
    setSearchOpen(false);
    setSearchQuery('');
    setMobileOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'}`}>
      {/* Top bar */}
      <div className="bg-black text-white text-xs py-1.5 text-center hidden sm:block tracking-wide">
        ✨ Free shipping on orders above ₹999 &nbsp;|&nbsp; Easy 7-day returns &nbsp;|&nbsp; COD available
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* ── Logo ─────────────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">YC</div>
            <span className="text-xl font-semibold text-gray-900 tracking-tight">
              yogneecreation
              {/* Zuri <span className="italic text-gray-500 font-normal">Fashion</span> */}
            </span>
          </Link>

          {/* ── Desktop Nav ──────────────────────────────────────── */}
          <nav className="hidden lg:flex flex-wrap items-center gap-1 flex-1 justify-center overflow-x-auto">
            {[{ label: 'All Products', to: '/collection' }, ...categories.map(c => ({ label: c.name, to: `/collection/${c.slug}` }))].map(item => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-xs font-semibold tracking-[1.5px] uppercase whitespace-nowrap px-3 py-1.5 transition-colors
                  ${location.pathname === item.to
                    ? 'text-black border-b-2 border-black'
                    : 'text-gray-500 hover:text-black'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Right Icons ──────────────────────────────────────── */}
          <div className="flex items-center gap-1 flex-shrink-0">

            {/* Search icon + dropdown */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(o => !o)}
                className={`p-2.5 rounded-full transition-colors ${searchOpen ? 'bg-black text-white' : 'text-gray-600 hover:text-black hover:bg-gray-100'}`}
                title="Search"
              >
                {searchOpen ? (
                  /* X icon when open */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  /* Search icon */
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )}
              </button>

              {/* Search dropdown */}
              {searchOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 shadow-xl z-50">
                  <form onSubmit={handleSearch} className="flex items-center">
                    <div className="flex items-center flex-1 px-4 py-3 gap-3">
                      <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        ref={searchInput}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search kurtis, suits, lehengas…"
                        className="flex-1 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
                        onKeyDown={e => e.key === 'Escape' && setSearchOpen(false)}
                      />
                      {searchQuery && (
                        <button type="button" onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>
                      )}
                    </div>
                    <button
                      type="submit"
                      className="h-full px-4 py-3 bg-black text-white text-xs font-semibold tracking-widest uppercase hover:bg-gray-900 transition-colors border-l border-gray-200"
                    >
                      Go
                    </button>
                  </form>

                  {/* Quick links */}
                  {!searchQuery && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <p className="text-[10px] font-semibold tracking-[2px] uppercase text-gray-400 mb-2">Popular</p>
                      <div className="flex flex-wrap gap-1.5">
                        {['Kurti', 'Suit', 'Lehenga', 'Top', 'Palazzo'].map(q => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => { navigate(`/collection?search=${q}`); setSearchOpen(false); setSearchQuery(''); }}
                            className="text-xs px-3 py-1 bg-gray-100 text-gray-600 hover:bg-black hover:text-white transition-colors"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors" title="Wishlist">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors" title="Cart">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 7H4l1-7z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="flex items-center gap-1.5 p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-black rounded-full flex items-center justify-center text-white font-semibold text-xs">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-gray-700 pr-1">{user.name?.split(' ')[0]}</span>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-xl py-1 z-50">
                    <Link to="/profile"  onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 tracking-wide">MY PROFILE</Link>
                    <Link to="/orders"   onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 tracking-wide">MY ORDERS</Link>
                    <Link to="/wishlist" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 tracking-wide">WISHLIST</Link>
                    {isAdmin && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="block px-4 py-2.5 text-xs font-medium text-gray-700 hover:bg-gray-50 tracking-wide">ADMIN PANEL</Link>
                    )}
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 tracking-wide">LOGOUT</button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="text-xs font-semibold tracking-widest uppercase border border-black px-4 py-2 hover:bg-black hover:text-white transition-colors">
                Login
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              className="lg:hidden p-2.5 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────────────── */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-gray-100 pb-4">
            <nav className="mt-2 flex flex-col">
              {[{ label: 'Home', to: '/' }, { label: 'All Products', to: '/collection' }, ...categories.map(c => ({ label: `${c.icon || ''} ${c.name}`, to: `/collection/${c.slug}` }))].map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className="px-4 py-3 text-xs font-semibold tracking-[1.5px] uppercase text-gray-600 hover:text-black hover:bg-gray-50 border-b border-gray-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;