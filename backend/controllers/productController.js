const Product = require('../models/Product');
const Category = require('../models/Category');

// @GET /api/products
const getProducts = async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, size, color, season, page = 1, limit = 12, featured, newArrival, bestSeller } = req.query;

    const query = { isActive: true };

    if (category) {
      const cat = await Category.findOne({ slug: category });
      if (cat) query.category = cat._id;
    }
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (size) query['sizes.size'] = { $in: size.split(',') };
    if (color) query['colors.name'] = { $in: color.split(',') };
    if (season && season !== 'all') query.season = season;
    if (featured === 'true') query.isFeatured = true;
    if (newArrival === 'true') query.isNewArrival = true;
    if (bestSeller === 'true') query.isBestSeller = true;

    const sortOptions = {
      'price_asc': { price: 1 },
      'price_desc': { price: -1 },
      'newest': { createdAt: -1 },
      'rating': { rating: -1 },
      'popular': { sold: -1 },
    };
    const sortObj = sortOptions[sort] || { createdAt: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug icon').sort(sortObj).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/:slug
const getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug icon')
      .populate('reviews.user', 'name avatar');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/:id/related
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    }).limit(8).populate('category', 'name slug');
    res.json({ success: true, products: related });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @POST /api/products (admin)
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
    const populated = await product.populate('category', 'name slug');
    res.status(201).json({ success: true, product: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @PUT /api/products/:id (admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
      .populate('category', 'name slug');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @DELETE /api/products/:id (admin)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    await Category.findByIdAndUpdate(product.category, { $inc: { productCount: -1 } });
    await product.deleteOne();
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/admin/all (admin)
const getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query).populate('category', 'name slug').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Product.countDocuments(query)
    ]);
    res.json({ success: true, products, pagination: { total, page: Number(page), pages: Math.ceil(total / limit) } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @GET /api/products/filters
const getProductFilters = async (req, res) => {
  try {
    const [result] = await Product.aggregate([
      { $match: { isActive: true } },
      {
        $facet: {
          sizes: [
            { $unwind: '$sizes' },
            { $match: { 'sizes.stock': { $gt: 0 } } },   // only in-stock sizes
            { $group: { _id: '$sizes.size' } },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, value: '$_id' } }
          ],
          colors: [
            { $unwind: '$colors' },
            { $group: { _id: '$colors.name', hex: { $first: '$colors.hex' } } },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, name: '$_id', hex: 1 } }
          ],
          fabrics: [
            { $match: { fabric: { $ne: '' } } },
            { $group: { _id: '$fabric' } },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, value: '$_id' } }
          ],
          seasons: [
            { $match: { season: { $exists: true, $ne: '' } } },
            { $group: { _id: '$season' } },
            { $sort: { _id: 1 } },
            { $project: { _id: 0, value: '$_id' } }
          ],
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: '$price' },
                max: { $max: '$price' }
              }
            },
            { $project: { _id: 0, min: 1, max: 1 } }
          ]
        }
      }
    ]);

    // Fetch categories separately (need population from Category model)
    const categories = await Category.find({ isActive: true })
      .select('name slug icon')
      .sort({ name: 1 });

    res.json({
      success: true,
      filters: {
        sizes:      result.sizes.map(s => s.value),
        colors:     result.colors,                          // [{ name, hex }]
        fabrics:    result.fabrics.map(f => f.value),
        seasons:    result.seasons.map(s => s.value),
        categories: categories.map(c => ({
          name: c.name,
          slug: c.slug,
          icon: c.icon
        })),
        priceRange: result.priceRange[0] || { min: 0, max: 10000 }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getProducts, getProduct, getRelatedProducts, createProduct, updateProduct, deleteProduct, getAllProductsAdmin, getProductFilters };
