import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [] }); return; }
    try {
      setLoading(true);
      const res = await cartAPI.get();
      setCart(res.data.cart || { items: [] });
    } catch (e) {
      setCart({ items: [] });
    } finally { setLoading(false); }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, size, color, quantity = 1) => {
    const res = await cartAPI.add({ productId, size, color, quantity });
    setCart(res.data.cart);
    return res.data;
  };

  const updateItem = async (itemId, quantity) => {
    const res = await cartAPI.update(itemId, { quantity });
    setCart(res.data.cart);
  };

  const removeItem = async (itemId) => {
    const res = await cartAPI.remove(itemId);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await cartAPI.clear();
    setCart({ items: [] });
  };

  const totalItems = cart.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const totalPrice = cart.items?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCart, fetchCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
