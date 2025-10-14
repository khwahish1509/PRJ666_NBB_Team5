import express from 'express';
import {
  getPersonalizedRecommendations,
  getSimilarProductsEndpoint,
  getTrendingProductsEndpoint,
  getSafeAlternativesEndpoint,
  getBudgetRecommendationsEndpoint
} from '../controllers/recommendationController.js';

const router = express.Router();

// Recommendation routes
router.get('/', getPersonalizedRecommendations); // GET /api/recommendations
router.get('/similar/:productId', getSimilarProductsEndpoint); // GET /api/recommendations/similar/:productId
router.get('/trending', getTrendingProductsEndpoint); // GET /api/recommendations/trending
router.get('/alternatives/:productId', getSafeAlternativesEndpoint); // GET /api/recommendations/alternatives/:productId
router.get('/budget', getBudgetRecommendationsEndpoint); // GET /api/recommendations/budget

export default router;

