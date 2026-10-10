const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:    { type: String, required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  // ── Identity ──────────────────────────────────────────────
  name:     { type: String, required: true, trim: true },
  slug:     { type: String, unique: true, lowercase: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },

  // ── Images ───────────────────────────────────────────────
  mainImage: {
    url:      { type: String, required: true },
    publicId: { type: String, default: '' },
  },
  images: [{
    url:      { type: String, required: true },
    publicId: { type: String, default: '' },
  }],

  // ── Pricing ──────────────────────────────────────────────
  price:    { type: Number, required: true, min: 0 },
  mrp:      { type: Number, required: true, min: 0 },
  discount: { type: Number, default: 0 },          // auto-calculated

  // ── Description ──────────────────────────────────────────
  description:      { type: String, required: true },
  shortDescription: { type: String, default: '' },

  // ── Variants ─────────────────────────────────────────────
  sizes: [{
    size:  { type: String, required: true },        // e.g. "S", "M", "XL", "Free Size"
    stock: { type: Number, default: 0 },
  }],
  colors: [{
    name: { type: String, required: true },         // e.g. "Rose Gold"
    hex:  { type: String, required: true },         // e.g. "#b76e79"
  }],

  // ── Details ──────────────────────────────────────────────
  fabric:          { type: String, default: '' },   // e.g. "Pure Cotton"
  careInstructions:{ type: [String], default: [] }, // e.g. ["Hand wash", "Do not bleach"]

  // ── Stock ────────────────────────────────────────────────
  stock: { type: Number, required: true, default: 0 },
  sold:  { type: Number, default: 0 },

  // ── Flags ────────────────────────────────────────────────
  isActive:     { type: Boolean, default: true },
  isFeatured:   { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },

  // ── Reviews (auto-managed, don't edit manually) ──────────
  reviews:    [reviewSchema],
  rating:     { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },

}, { timestamps: true });

// ── Auto slug + discount ──────────────────────────────────────────────────────
productSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
  }
  if (this.mrp > 0 && this.price >= 0) {
    this.discount = Math.round(((this.mrp - this.price) / this.mrp) * 100);
  }
  next();
});

// ── Recalculate rating after a review is added ────────────────────────────────
productSchema.methods.calcRating = function () {
  if (this.reviews.length === 0) {
    this.rating = 0; this.numReviews = 0;
  } else {
    this.rating = this.reviews.reduce((acc, r) => acc + r.rating, 0) / this.reviews.length;
    this.numReviews = this.reviews.length;
  }
};

module.exports = mongoose.model('Product', productSchema);