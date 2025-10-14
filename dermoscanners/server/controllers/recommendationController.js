import {
  getRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getSafeAlternatives,
  getBudgetRecommendations
} from '../services/recommendationEngine.js';

/**
 * Get personalized recommendations
 * GET /api/recommendations
 */
export async function getPersonalizedRecommendations(req, res) {
  try {
    const { skinType, maxPrice, category, limit } = req.query;
    const userId = req.user?.id || null;

    const recommendations = await getRecommendations({
      userId,
      skinType,
      maxPrice,
      category,
      limit: limit ? parseInt(limit) : 10
    });

    res.json({ success: true, count: recommendations.length, data: recommendations });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ success: false, message: 'Error fetching recommendations' });
  }
}

/**
 * Get similar products
 * GET /api/recommendations/similar/:productId
 */
export async function getSimilarProductsEndpoint(req, res) {
  try {
    const { productId } = req.params;
    const { limit } = req.query;

    const similar = await getSimilarProducts(productId, limit ? parseInt(limit) : 5);

    res.json({ success: true, count: similar.length, data: similar });
  } catch (error) {
    console.error('Error getting similar products:', error);
    res.status(500).json({ success: false, message: 'Error fetching similar products' });
  }
}

/**
 * Get trending products
 * GET /api/recommendations/trending
 */
export async function getTrendingProductsEndpoint(req, res) {
  try {
    const { limit } = req.query;

    const trending = await getTrendingProducts(limit ? parseInt(limit) : 10);

    res.json({ success: true, count: trending.length, data: trending });
  } catch (error) {
    console.error('Error getting trending products:', error);
    res.status(500).json({ success: false, message: 'Error fetching trending products' });
  }
}

/**
 * Get safe alternatives
 * GET /api/recommendations/alternatives/:productId
 */
export async function getSafeAlternativesEndpoint(req, res) {
  try {
    const { productId } = req.params;
    const { limit } = req.query;

    const alternatives = await getSafeAlternatives(productId, limit ? parseInt(limit) : 5);

    res.json({ success: true, count: alternatives.length, data: alternatives });
  } catch (error) {
    console.error('Error getting alternatives:', error);
    res.status(500).json({ success: false, message: 'Error fetching alternatives' });
  }
}

/**
 * Get budget recommendations
 * GET /api/recommendations/budget
 */
export async function getBudgetRecommendationsEndpoint(req, res) {
  try {
    const { skinType, maxPrice, limit } = req.query;

    const budget = await getBudgetRecommendations({
      skinType,
      maxPrice: maxPrice || 20,
      limit: limit ? parseInt(limit) : 10
    });

    res.json({ success: true, count: budget.length, data: budget });
  } catch (error) {
    console.error('Error getting budget recommendations:', error);
    res.status(500).json({ success: false, message: 'Error fetching budget recommendations' });
  }
}

