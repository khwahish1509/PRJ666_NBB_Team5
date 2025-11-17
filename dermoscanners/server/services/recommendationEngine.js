/**
 * Recommendation Engine
 * US-211: Intelligent product recommendations based on user profile and history
 */

import Product from '../models/Product.js';
import ScanHistory from '../models/ScanHistory.js';

/**
 * Calculate recommendation score for a product
 * @param {Object} product - Product object
 * @param {Object} userProfile - User profile { skinType, skinGoals }
 * @param {Array} history - User's scan history
 * @returns {number} Score (0-100)
 */
function calculateScore(product, userProfile, history = []) {
  const weights = {
    rating: 35,
    skinType: 25,
    safety: 25,
    sentiment: 10,
    price: 5
  };

  let score = 0;
  const maxScore = Object.values(weights).reduce((a, b) => a + b, 0);

  // Rating score
  score += (product.rating || 0) * (weights.rating / 5);

  // Skin type match
  if (userProfile?.skinType && product.skinTypes?.includes(userProfile.skinType)) {
    score += weights.skinType;
  } else if (product.skinTypes?.includes('all') || product.skinTypes?.includes('normal')) {
    score += weights.skinType * 0.6;
  }

  // Safety rating
  const safetyScores = { safe: weights.safety, caution: weights.safety * 0.5, warning: 0 };
  score += safetyScores[product.safetyRating] || weights.safety * 0.2;

  // Sentiment score
  score += (product.sentimentScore || 0.5) * weights.sentiment;

  // Price value
  if (product.price < 30) score += weights.price;
  else if (product.price < 50) score += weights.price * 0.6;
  else score += weights.price * 0.2;

  // History adjustments
  if (history.length > 0) {
    const recentlyViewed = history.slice(0, 10).some(h => 
      h.productId?.toString() === product._id.toString()
    );
    if (recentlyViewed) score *= 0.4;

    const categoryPreference = history.filter(h => 
      h.productSnapshot?.category === product.category
    ).length;
    if (categoryPreference > 2) score *= 1.15;
  }

  return Math.min(100, Math.max(0, (score / maxScore) * 100));
}

/**
 * Get personalized recommendations
 * Enhanced with fallback logic and better filtering
 * @param {Object} options - { userId, skinType, maxPrice, limit, excludeProductId }
 * @returns {Promise<Array>} Recommended products with scores
 */
export async function getRecommendations(options = {}) {
  const {
    userId = null,
    skinType = null,
    maxPrice = null,
    category = null,
    limit = 10,
    excludeProductId = null
  } = options;

  try {
    // Build query with fallback logic
    const query = {};
    if (skinType) query.skinTypes = skinType;
    if (maxPrice) query.price = { $lte: Number(maxPrice) };
    if (category) query.category = category;
    if (excludeProductId) query._id = { $ne: excludeProductId };

    // Get products
    let products = await Product.find(query).lean();

    // Fallback 1: If no products found with strict filters, relax skin type
    if (products.length === 0 && skinType) {
      delete query.skinTypes;
      products = await Product.find(query).lean();
    }

    // Fallback 2: If still no products, get top-rated safe products
    if (products.length === 0) {
      products = await Product.find({
        rating: { $gte: 4.0 },
        safetyRating: { $ne: 'warning' }
      })
      .sort({ rating: -1 })
      .limit(limit * 2)
      .lean();
    }

    // Fallback 3: If database is empty, return empty array with message
    if (products.length === 0) {
      console.warn('No products found in database for recommendations');
      return [];
    }

    // Get user history if userId provided
    let history = [];
    if (userId) {
      try {
        history = await ScanHistory.find({ userId })
          .sort({ scannedAt: -1 })
          .limit(50)
          .lean();
      } catch (err) {
        console.error('Error fetching user history:', err);
        // Continue without history
      }
    }

    // Calculate scores
    const scoredProducts = products.map(product => ({
      ...product,
      score: calculateScore(product, { skinType }, history)
    }));

    // Sort by score (descending) and return top results
    const topProducts = scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return topProducts;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return empty array on error
    return [];
  }
}

/**
 * Get similar products based on category and skin type
 * @param {string} productId - Product ID
 * @param {number} limit - Number of recommendations
 * @returns {Promise<Array>} Similar products
 */
export async function getSimilarProducts(productId, limit = 5) {
  const product = await Product.findById(productId).lean();
  if (!product) return [];

  const query = {
    _id: { $ne: productId },
    category: product.category
  };

  if (product.skinTypes?.length > 0) {
    query.skinTypes = { $in: product.skinTypes };
  }

  const similar = await Product.find(query)
    .sort({ rating: -1, safetyRating: 1 })
    .limit(limit)
    .lean();

  return similar.map(p => ({
    ...p,
    score: calculateScore(p, { skinType: product.skinTypes?.[0] })
  }));
}

/**
 * Get trending products (high rating + recent)
 * @param {number} limit - Number of products
 * @returns {Promise<Array>} Trending products
 */
export async function getTrendingProducts(limit = 10) {
  return Product.find({
    rating: { $gte: 4.0 },
    safetyRating: { $ne: 'warning' }
  })
    .sort({ rating: -1, createdAt: -1 })
    .limit(limit)
    .lean();
}

/**
 * Get safe alternatives for high-risk products
 * @param {string} productId - Product ID
 * @param {number} limit - Number of alternatives
 * @returns {Promise<Array>} Safe alternatives
 */
export async function getSafeAlternatives(productId, limit = 5) {
  const product = await Product.findById(productId).lean();
  if (!product) return [];

  const query = {
    _id: { $ne: productId },
    category: product.category,
    safetyRating: 'safe',
    rating: { $gte: 4.0 }
  };

  if (product.skinTypes?.length > 0) {
    query.skinTypes = { $in: product.skinTypes };
  }

  return Product.find(query)
    .sort({ rating: -1 })
    .limit(limit)
    .lean();
}

/**
 * Get budget-friendly recommendations
 * @param {Object} options - { skinType, maxPrice, limit }
 * @returns {Promise<Array>} Budget-friendly products
 */
export async function getBudgetRecommendations(options = {}) {
  const { skinType = null, maxPrice = 20, limit = 10 } = options;

  const query = {
    price: { $lte: Number(maxPrice) },
    rating: { $gte: 4.0 },
    safetyRating: { $ne: 'warning' }
  };

  if (skinType) query.skinTypes = skinType;

  return Product.find(query)
    .sort({ price: 1, rating: -1 })
    .limit(limit)
    .lean();
}

export default {
  getRecommendations,
  getSimilarProducts,
  getTrendingProducts,
  getSafeAlternatives,
  getBudgetRecommendations
};

