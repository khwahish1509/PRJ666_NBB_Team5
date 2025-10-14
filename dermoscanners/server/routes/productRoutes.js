import express from 'express';
import { 
  listProducts, 
  getProductByBarcode, 
  searchProducts,
  getProductById,
  getRecommendations
} from '../controllers/productController.js';

const router = express.Router();

// Product routes
router.get('/', listProducts); // GET /api/products - List all products with filters
router.get('/search', searchProducts); // GET /api/products/search?q=query - Search products
router.get('/barcode/:barcode', getProductByBarcode); // GET /api/products/barcode/:barcode - Get by barcode
router.get('/recommendations', getRecommendations); // GET /api/products/recommendations - Get recommendations
router.get('/:id', getProductById); // GET /api/products/:id - Get by ID

export default router;

