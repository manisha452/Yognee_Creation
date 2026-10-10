// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { categoryAPI } from '../utils/api';

// const CategoryContext = createContext(null);

// export const CategoryProvider = ({ children }) => {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const res = await categoryAPI.getAll();
//       setCategories(res.data.categories || []);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => { fetchCategories(); }, []);

//   const addCategory = async (payload) => {
//     const res = await categoryAPI.create(payload);
//     setCategories(prev => [...prev, res.data.category]);
//     return res.data.category;
//   };

//   const updateCategory = async (id, payload) => {
//     await categoryAPI.update(id, payload);
//     setCategories(prev => prev.map(c => c._id === id ? { ...c, ...payload } : c));
//   };

//   const deleteCategory = async (id) => {
//     await categoryAPI.delete(id);
//     setCategories(prev => prev.filter(c => c._id !== id));
//   };

//   return (
//     <CategoryContext.Provider value={{ categories, loading, addCategory, updateCategory, deleteCategory, refetch: fetchCategories }}>
//       {children}
//     </CategoryContext.Provider>
//   );
// };

// export const useCategories = () => useContext(CategoryContext);


import React, { createContext, useContext, useEffect, useState } from 'react';
import { categoryAPI } from '../utils/api';

const CategoryContext = createContext(null);

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await categoryAPI.getAll();
      // only keep active categories for user-facing components
      const all = res.data.categories || [];
      setCategories(all);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  // ── helpers ──────────────────────────────────────────────────────────────

  // active ones only — used by Navbar and CollectionPage
  const activeCategories = categories.filter(c => c.isActive);

  // ── mutations ─────────────────────────────────────────────────────────────

  const addCategory = async (payload) => {
    // payload must include: name, image, imagePublicId (optional)
    const { name, image, imagePublicId = '' } = payload;

    if (!name?.trim())  throw new Error('Category name is required');
    if (!image?.trim()) throw new Error('Category image is required');

    const res = await categoryAPI.create({ name: name.trim(), image, imagePublicId });
    const created = res.data.category;
    setCategories(prev => [...prev, created]);
    return created;
  };

  const updateCategory = async (id, payload) => {
    // only allow editing the fields that exist in schema
    const { name, image, imagePublicId, isActive } = payload;
    const clean = {};
    if (name       !== undefined) clean.name       = name.trim();
    if (image      !== undefined) clean.image      = image;
    if (imagePublicId !== undefined) clean.imagePublicId = imagePublicId;
    if (isActive   !== undefined) clean.isActive   = isActive;

    await categoryAPI.update(id, clean);
    setCategories(prev => prev.map(c => c._id === id ? { ...c, ...clean } : c));
  };

  const deleteCategory = async (id) => {
    await categoryAPI.delete(id);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  const toggleActive = async (cat) => {
    await updateCategory(cat._id, { isActive: !cat.isActive });
  };

  return (
    <CategoryContext.Provider value={{
      // state
      categories,         // all (admin uses this)
      activeCategories,   // isActive === true only (navbar / filters use this)
      loading,
      error,

      // mutations
      addCategory,
      updateCategory,
      deleteCategory,
      toggleActive,

      // manual refetch if needed
      refetch: fetchCategories,
    }}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const ctx = useContext(CategoryContext);
  if (!ctx) throw new Error('useCategories must be used inside <CategoryProvider>');
  return ctx;
};