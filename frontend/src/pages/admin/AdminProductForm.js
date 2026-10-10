import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productAPI, categoryAPI, uploadAPI } from '../../utils/api';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size', '26', '28', '30', '32', '34', '36'];

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', price: '', mrp: '',
    category: '', fabric: '', brand: 'Zuri', stock: '', season: 'all',
    isFeatured: false, isNewArrival: false, isBestSeller: false, isActive: true,
    tags: '', returnPolicy: '7 days easy return',
    sizes: SIZES.slice(0, 5).map(s => ({ size: s, stock: 0 })),
    colors: [{ name: 'Default', hex: '#000000' }],
    mainImage: null,
    images: [],
    careInstructions: ['Machine wash cold', 'Do not bleach', 'Tumble dry low'],
  });

  useEffect(() => {
    categoryAPI.getAll().then(res => setCategories(res.data.categories || []));
    if (isEdit) {
      // Fetch product by id for editing
      productAPI.getAllAdmin({ search: '' }).then(res => {
        const prod = res.data.products?.find(p => p._id === id);
        if (prod) {
          setForm({
            ...prod,
            tags: prod.tags?.join(', ') || '',
            careInstructions: prod.careInstructions || ['Machine wash cold', 'Do not bleach'],
            sizes: prod.sizes?.length ? prod.sizes : SIZES.slice(0, 5).map(s => ({ size: s, stock: 0 })),
            colors: prod.colors?.length ? prod.colors : [{ name: 'Default', hex: '#000000' }],
          });
        }
      });
    }
  }, [id, isEdit]);

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await uploadAPI.uploadImage(formData);

      setForm(prev => ({
        ...prev,
        mainImage: {
          url: res.data.url,
          publicId: res.data.publicId
        }
      }));

      toast.success("Main image uploaded!");
    } catch (err) {
      toast.error("Main image upload failed.");
    } finally {
      setUploading(false);
    }
  };


  const handleGalleryImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);

    try {
      const formData = new FormData();

      files.forEach(file => {
        formData.append("images", file);
      });

      const res = await uploadAPI.uploadImages(formData);

      setForm(prev => ({
        ...prev,
        images: [...prev.images, ...res.data.images]
      }));

      toast.success(`${files.length} image(s) uploaded!`);
    } catch (err) {
      toast.error("Gallery image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach(f => formData.append('images', f));
      const res = await uploadAPI.uploadImages(formData);
      setForm(prev => ({ ...prev, images: [...prev.images, ...res.data.images] }));
      toast.success(`${files.length} image(s) uploaded!`);
    } catch (err) {
      toast.error('Image upload failed. Check Cloudinary config.');
    } finally { setUploading(false); }
  };

  const removeImage = async (index) => {
    const img = form.images[index];
    try {
      if (img.publicId) await uploadAPI.deleteImage(img.publicId);
    } catch (e) { }
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const updateSize = (index, field, value) => {
    const sizes = [...form.sizes];
    sizes[index] = { ...sizes[index], [field]: field === 'stock' ? Number(value) : value };
    setForm(prev => ({ ...prev, sizes }));
  };

  const addSize = () => setForm(prev => ({ ...prev, sizes: [...prev.sizes, { size: '', stock: 0 }] }));
  const removeSize = (i) => setForm(prev => ({ ...prev, sizes: prev.sizes.filter((_, idx) => idx !== i) }));

  const updateColor = (index, field, value) => {
    const colors = [...form.colors];
    colors[index] = { ...colors[index], [field]: value };
    setForm(prev => ({ ...prev, colors }));
  };
  const addColor = () => setForm(prev => ({ ...prev, colors: [...prev.colors, { name: '', hex: '#ff69b4' }] }));
  const removeColor = (i) => setForm(prev => ({ ...prev, colors: prev.colors.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.mrp || !form.category) {
      toast.error('Please fill all required fields'); return;
    }
    setSaving(true);
    try {
      const totalStock = form.sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0);
      const payload = {
        ...form,
        price: Number(form.price),
        mrp: Number(form.mrp),
        stock: totalStock || Number(form.stock) || 0,
        tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
      };

      if (isEdit) {
        await productAPI.update(id, payload);
        toast.success('Product updated! ✅');
      } else {
        await productAPI.create(payload);
        toast.success('Product created! 🎉');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setSaving(false); }
  };

  // const payload = {
  //   ...form,
  //   mainImage: form.mainImage,
  //   images: form.images
  // };

  // await productAPI.create(payload);

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

  return (
    <div className="max-w-4xl animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/products')} className="text-gray-400 hover:text-rose-600 transition-colors">
          ← Back
        </button>
        <h1 className="font-display text-2xl font-bold text-gray-900">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required placeholder="e.g. Floral Print Short Kurti" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category *</label>
              <select value={form.category?._id || form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required className={inputClass}>
                <option value="">Select Category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.icon} {c.name}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Season</label>
              <select value={form.season} onChange={e => setForm(p => ({ ...p, season: e.target.value }))} className={inputClass}>
                {['all', 'summer', 'winter', 'monsoon'].map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>MRP (₹) *</label>
              <input type="number" value={form.mrp} onChange={e => setForm(p => ({ ...p, mrp: e.target.value }))} required placeholder="1999" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Selling Price (₹) *</label>
              <input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required placeholder="999" className={inputClass} />
            </div>
            {form.mrp && form.price && Number(form.mrp) > Number(form.price) && (
              <div className="sm:col-span-2 bg-green-50 text-green-700 text-sm px-4 py-2 rounded-xl">
                💰 Discount: {Math.round(((form.mrp - form.price) / form.mrp) * 100)}% off
              </div>
            )}
            <div>
              <label className={labelClass}>Fabric</label>
              <input type="text" value={form.fabric} onChange={e => setForm(p => ({ ...p, fabric: e.target.value }))} placeholder="Cotton, Rayon, Georgette..." className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Brand</label>
              <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Tags (comma separated)</label>
              <input type="text" value={form.tags} onChange={e => setForm(p => ({ ...p, tags: e.target.value }))} placeholder="floral, casual, festive" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Return Policy</label>
              <input type="text" value={form.returnPolicy} onChange={e => setForm(p => ({ ...p, returnPolicy: e.target.value }))} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Short Description</label>
              <input type="text" value={form.shortDescription} onChange={e => setForm(p => ({ ...p, shortDescription: e.target.value }))} placeholder="One-line product summary" className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Full Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} required rows={4}
                placeholder="Detailed product description..." className={`${inputClass} resize-none`} />
            </div>
          </div>

          {/* Flags */}
          <div className="flex flex-wrap gap-4 mt-4">
            {[['isFeatured', '⭐ Featured'], ['isNewArrival', '🆕 New Arrival'], ['isBestSeller', '🔥 Best Seller'], ['isActive', '✅ Active']].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.checked }))}
                  className="w-4 h-4 rounded text-rose-600" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          {/* <h2 className="font-semibold text-gray-800 mb-4">Product Images</h2>
          <div className="flex flex-wrap gap-3 mb-4">
            {form.images.map((img, i) => (
              <div key={i} className="relative group w-24 h-28">
                <img src={img.url} alt="" className="w-full h-full object-cover rounded-xl border-2 border-gray-100" />
                <button type="button" onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
                {i === 0 && <span className="absolute bottom-1 left-0 right-0 text-center text-xs text-white bg-black/50 rounded-b-xl py-0.5">Main</span>}
              </div>
            ))}
            <label className={`w-24 h-28 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${uploading ? 'border-rose-300 bg-rose-50' : 'border-gray-200 hover:border-rose-400 hover:bg-rose-50'}`}>
              <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
              {uploading ? (
                <div className="animate-spin w-6 h-6 border-2 border-rose-400 border-t-transparent rounded-full" />
              ) : (
                <>
                  <span className="text-2xl">📸</span>
                  <span className="text-xs text-gray-500 mt-1 text-center px-2">Upload</span>
                </>
              )}
            </label>
          </div>
          <p className="text-xs text-gray-400">Upload via Cloudinary. Recommended: 800×1000px, JPG/PNG/WebP, max 10MB each.</p> */}
          <div className="bg-white rounded-2xl p-6 border">
            <h3 className="text-lg font-semibold mb-4">
              Main Product Image
            </h3>

            {form.mainImage && (
              <img
                src={form.mainImage.url}
                alt=""
                className="w-40 h-40 object-cover rounded-lg mb-4"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageUpload}
            />
          </div>

          <div className="bg-white rounded-2xl p-6 border mt-6">
            <h3 className="text-lg font-semibold mb-4">
              Product Gallery Images
            </h3>

            <div className="flex gap-3 flex-wrap mb-4">
              {form.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt=""
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleGalleryImagesUpload}
            />
          </div>

        </div>

        {/* Sizes */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Sizes & Stock</h2>
            <button type="button" onClick={addSize} className="text-xs text-rose-600 hover:text-rose-700 font-medium">+ Add Size</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {form.sizes.map((s, i) => (
              <div key={i} className="relative border border-gray-200 rounded-xl p-3">
                <button type="button" onClick={() => removeSize(i)} className="absolute -top-2 -right-2 w-5 h-5 bg-red-100 text-red-500 rounded-full text-xs flex items-center justify-center hover:bg-red-200">✕</button>
                <select value={s.size} onChange={e => updateSize(i, 'size', e.target.value)} className="w-full text-sm border-0 bg-transparent font-medium text-gray-800 focus:outline-none mb-1">
                  <option value="">Size</option>
                  {SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                </select>
                <input type="number" value={s.stock} onChange={e => updateSize(i, 'stock', e.target.value)} min={0}
                  placeholder="Stock" className="w-full text-sm border border-gray-100 rounded-lg px-2 py-1 focus:outline-none focus:border-rose-300" />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Total stock: {form.sizes.reduce((acc, s) => acc + (Number(s.stock) || 0), 0)} units</p>
        </div>

        {/* Colors */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">Colors</h2>
            <button type="button" onClick={addColor} className="text-xs text-rose-600 hover:text-rose-700 font-medium">+ Add Color</button>
          </div>
          <div className="flex flex-wrap gap-3">
            {form.colors.map((c, i) => (
              <div key={i} className="flex items-center gap-2 border border-gray-200 rounded-xl p-2.5">
                <input type="color" value={c.hex} onChange={e => updateColor(i, 'hex', e.target.value)} className="w-8 h-8 rounded-lg border-0 cursor-pointer" />
                <input type="text" value={c.name} onChange={e => updateColor(i, 'name', e.target.value)} placeholder="Color name" className="w-24 text-sm border-0 focus:outline-none" />
                <button type="button" onClick={() => removeColor(i)} className="text-red-400 hover:text-red-600 text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-3 pb-6">
          <button type="submit" disabled={saving} className="btn-primary py-3.5 px-8 text-base disabled:opacity-50">
            {saving ? '⏳ Saving...' : isEdit ? '✅ Update Product' : '🎉 Create Product'}
          </button>
          <button type="button" onClick={() => navigate('/admin/products')} className="btn-outline py-3.5 px-6">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;
