import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useCategories } from '../../context/CategoryContext';
import { uploadAPI } from '../../utils/api';

// ─── default form matches schema exactly ─────────────────────────────────────
const defaultForm = { name: '', image: '', imagePublicId: '', isActive: true };

// ─── Image Upload ─────────────────────────────────────────────────────────────
const ImageUpload = ({ value, onChange }) => {
  const fileRef = useRef();

  // const handleFile = (e) => {
  //   const f = e.target.files[0];
  //   if (!f) return;
  //   // In production: upload to Cloudinary here and get back { url, public_id }
  //   // For now we use a local object URL as preview
  //   onChange({ image: URL.createObjectURL(f), imagePublicId: '' });
  // };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;

    try {
      const formData = new FormData();
      formData.append("image", f);

      const res = await uploadAPI.uploadImage(formData);

      onChange({
        image: res.data.url,
        imagePublicId: res.data.publicId
      });

      toast.success("Image uploaded!");
    } catch (error) {
      toast.error("Image upload failed");
      console.log(error);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Category Image <span className="text-rose-500">*</span>
      </label>

      {value ? (
        // ── Compact thumbnail preview (image already selected/uploaded) ──
        <div className="flex items-center gap-4">
          <div className="w-[110px] h-[110px] flex-shrink-0 rounded-xl border border-gray-200 overflow-hidden shadow-sm bg-gray-50">
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          </div>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors w-fit"
            >
              Change Image
            </button>
            <button
              type="button"
              onClick={() => onChange({ image: '', imagePublicId: '' })}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 transition-colors w-fit"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        // ── Empty state: dashed upload drop zone (unchanged) ──
        <div
          onClick={() => fileRef.current.click()}
          className="relative rounded-2xl border-2 border-dashed border-rose-200 bg-rose-50 overflow-hidden cursor-pointer transition-colors hover:border-rose-400 hover:bg-rose-100"
          style={{ height: 160 }}
        >
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <span className="text-4xl">🖼️</span>
            <p className="text-sm font-semibold text-rose-400">Click to upload image</p>
            <p className="text-xs text-gray-400">JPG, PNG, WEBP</p>
          </div>
        </div>
      )}

      {/* URL input */}
      <div className="flex gap-2 mt-3">
        <input
          type="text"
          value={value}
          onChange={e => onChange({ image: e.target.value, imagePublicId: '' })}
          placeholder="…or paste image URL"
          className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-rose-400"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange({ image: '', imagePublicId: '' })}
            className="px-3 py-2 text-xs text-red-500 bg-red-50 rounded-xl hover:bg-red-100 font-semibold"
          >
            Remove
          </button>
        )}
      </div>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
};

// ─── Admin Category Card ──────────────────────────────────────────────────────
const AdminCategoryCard = ({ cat, onEdit, onDelete, onToggle }) => (
  <div
    className="h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-4"
  >
    {/* Header: name + toggle */}
    <div className="flex items-center justify-between gap-3">
      <p className="font-semibold text-gray-900 text-base truncate">{cat.name}</p>
      <button
        onClick={() => onToggle(cat)}
        className="flex-shrink-0"
        style={{
          width: 36, height: 20, borderRadius: 20,
          background: cat.isActive ? '#22c55e' : '#9ca3af',
          border: 'none', cursor: 'pointer', position: 'relative',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, width: 16, height: 16,
          background: '#fff', borderRadius: '50%',
          boxShadow: '0 1px 4px rgba(0,0,0,.3)',
          transition: 'left .2s', left: cat.isActive ? 18 : 2,
        }} />
      </button>
    </div>

    {/* Image */}
    <div className="flex-1 flex items-center justify-center py-4">
      <div className="w-[160px] h-[200px] rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-rose-50 flex-shrink-0">
        {cat.image
          ? <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-4xl">🖼️</div>
        }
      </div>
    </div>

    {/* Route + status row */}
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-gray-500 truncate">/{cat.slug}</p>
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full
        ${cat.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cat.isActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
        {cat.isActive ? 'Active' : 'Hidden'}
      </span>
    </div>

    {/* Actions */}
    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-50">
      <button
        onClick={() => onEdit(cat)}
        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-blue-50 text-blue-600 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete(cat._id, cat.name)}
        className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-semibold bg-red-50 text-red-500 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
      >
        Delete
      </button>
    </div>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
    {[...Array(6)].map((_, i) => (
      <div key={i} className="rounded-2xl overflow-hidden">
        <div className="h-28 shimmer-bg" />
        <div className="p-3 space-y-2">
          <div className="h-3 w-2/3 rounded shimmer-bg" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const AdminCategories = () => {
  const { categories, loading, addCategory, updateCategory, deleteCategory, toggleActive } = useCategories();

  const [form, setForm] = useState(defaultForm);
  const [editing, setEditing] = useState(null);   // holds _id when editing
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ── form handlers ────────────────────────────────────────────────────────
  const handleImageChange = ({ image, imagePublicId }) => {
    setForm(p => ({ ...p, image, imagePublicId }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Category name is required'); return; }
    if (!form.image.trim()) { toast.error('Category image is required'); return; }

    setSaving(true);
    try {
      if (editing) {
        await updateCategory(editing, {
          name: form.name.trim(),
          image: form.image,
          imagePublicId: form.imagePublicId,
          isActive: form.isActive,
        });
        toast.success('Category updated!');
      } else {
        await addCategory({
          name: form.name.trim(),
          image: form.image,
          imagePublicId: form.imagePublicId,
          isActive: form.isActive,
        });
        toast.success('Category created! 🎉');
      }
      resetForm();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Failed');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (cat) => {
    setForm({ name: cat.name, image: cat.image || '', imagePublicId: cat.imagePublicId || '', isActive: cat.isActive });
    setEditing(cat._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteCategory(id);
      toast.success('Category deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleToggle = async (cat) => {
    try {
      await toggleActive(cat);
      toast.success(`Category ${cat.isActive ? 'hidden' : 'shown'}`);
    } catch {
      toast.error('Failed');
    }
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditing(null);
    setShowForm(false);
  };

  const inp = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100";

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {categories.length} total · {categories.filter(c => c.isActive).length} active
          </p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditing(null); setForm(defaultForm); }}
          className={`py-2.5 px-5 text-sm rounded-xl font-bold transition-all ${showForm
              ? 'bg-gray-100 text-gray-600'
              : 'btn-primary'
            }`}
        >
          {showForm ? '✕ Cancel' : '+ New Category'}
        </button>
      </div>

      {/* ── Callout ── */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4">
        <p className="text-sm font-semibold text-blue-700">
          Manage Categories
        </p>
        {/* <p className="text-xs text-blue-500 mt-1">
          Create, edit, activate, or remove product categories. Changes made here are automatically reflected across the website, including navigation menus, product collections, filters, and category pages.
        </p> */}
      </div>

      {/* ── Form ── */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-5 animate-slide-down">
          <h2 className="font-bold text-gray-800 text-base mb-4">
            {editing ? 'Edit Category' : 'New Category'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                required
                placeholder="e.g. Sarees, Kurtas, Western Wear"
                className={inp}
              />
            </div>

            {/* Image */}
            <ImageUpload value={form.image} onChange={handleImageChange} />

            {/* Active toggle */}
            <label className="flex items-center gap-2.5 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                className="w-4 h-4 rounded"
                style={{ accentColor: '#f43f7e' }}
              />
              <span className="text-sm font-semibold text-gray-700">Active (visible on site)</span>
            </label>

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={saving}
                className="btn-primary py-2.5 px-6 disabled:opacity-50"
              >
                {saving ? '⏳ Saving…' : editing ? '✅ Update Category' : '🎉 Create Category'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="btn-outline py-2.5 px-4"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Grid ── */}
      {loading ? (
        <Skeleton />
      ) : categories.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">🗂️</p>
          <p className="font-semibold">No categories yet</p>
          <p className="text-sm mt-1">Click "+ New Category" to add your first one.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
          {categories.map(cat => (
            <AdminCategoryCard
              key={cat._id}
              cat={cat}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminCategories;