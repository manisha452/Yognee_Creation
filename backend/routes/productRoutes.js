const express = require('express');
const router = express.Router();

const { getProducts, getProduct, getRelatedProducts, createProduct, updateProduct, deleteProduct, getAllProductsAdmin, getProductFilters } = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getProducts);
router.get('/filters',       getProductFilters); 
router.get('/admin/all', protect, admin, getAllProductsAdmin);
router.get('/:slug', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;
