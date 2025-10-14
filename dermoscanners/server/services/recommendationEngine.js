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
  let score = 0;

  // Base score from rating (0-40 points)
  score += (product.rating || 0) * 8;

  // Skin type match (0-30 points)
  if (userProfile?.skinType && product.skinTypes?.includes(userProfile.skinType)) {
    score += 30;
  } else if (product.skinTypes?.length > 0) {
    score += 10; // Partial match
  }

  // Safety rating (0-20 points)
  const safetyScores = { safe: 20, caution: 10, warning: 0 };
  score += safetyScores[product.safetyRating] || 0;

  // Sentiment score (0-10 points)
  score += (product.sentimentScore || 0.5) * 10;

  // Diversity bonus - avoid recommending recently scanned products
  const recentlyScanned = history.some(h => h.productId.toString() === product._id.toString());
  if (recentlyScanned) {
    score *= 0.3; // Reduce score by 70%
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Get personalized recommendations
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

  // Build query
  const query = {};
  if (skinType) query.skinTypes = skinType;
  if (maxPrice) query.price = { $lte: Number(maxPrice) };
  if (category) query.category = category;
  if (excludeProductId) query._id = { $ne: excludeProductId };

  // Get products
  const products = await Product.find(query).lean();

  // Get user history if userId provided
  let history = [];
  if (userId) {
    history = await ScanHistory.find({ userId })
      .sort({ scannedAt: -1 })
      .limit(50)
      .lean();
  }

  // Calculate scores
  const scoredProducts = products.map(product => ({
    ...product,
    score: calculateScore(product, { skinType }, history)
  }));

  // Sort by score (descending) and return top results
  return scoredProducts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
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

