// const mongoose = require('mongoose');

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true, unique: true },
//   slug: { type: String, required: true, unique: true, lowercase: true },
//   description: { type: String, default: '' },
//   image: { type: String, default: '' },
//   imagePublicId: { type: String, default: '' },
//   icon: { type: String, default: '👗' },
//   isActive: { type: Boolean, default: true },
//   displayOrder: { type: Number, default: 0 },
//   isFeatured: { type: Boolean, default: false },
//   season: { type: String, enum: ['all', 'summer', 'winter', 'monsoon'], default: 'all' },
//   parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
//   productCount: { type: Number, default: 0 },
// }, { timestamps: true });

// categorySchema.pre('save', function (next) {
//   if (!this.slug) {
//     this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
//   }
//   next();
// });

// module.exports = mongoose.model('Category', categorySchema);


const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, unique: true, lowercase: true },
  image: { type: String, required: true },
  imagePublicId: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);