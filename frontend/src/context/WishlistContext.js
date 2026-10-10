import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { wishlistAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const { user } = useAuth();

  const fetchWishlist = useCallback(async () => {
    if (!user) { setWishlist([]); return; }
    try {
      const res = await wishlistAPI.get();
      setWishlist(res.data.wishlist?.products?.map(p => p._id || p) || []);
    } catch (e) { setWishlist([]); }
  }, [user]);

  useEffect(() => { fetchWishlist(); }, [fetchWishlist]);

  const toggle = async (productId) => {
    const res = await wishlistAPI.toggle(productId);
    if (res.data.added) {
      setWishlist(prev => [...prev, productId]);
    } else {
      setWishlist(prev => prev.filter(id => id !== productId));
    }
    return res.data;
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggle, isWishlisted, fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
