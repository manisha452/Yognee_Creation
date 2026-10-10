const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name images price mrp slug rating numReviews stock');
    res.json({ success: true, wishlist: wishlist || { products: [] } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });

    const idx = wishlist.products.indexOf(productId);
    let added = false;
    if (idx > -1) {
      wishlist.products.splice(idx, 1);
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();
    res.json({ success: true, added, message: added ? 'Added to wishlist' : 'Removed from wishlist' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getWishlist, toggleWishlist };
