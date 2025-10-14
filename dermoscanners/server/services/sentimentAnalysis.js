/**
 * Simple Sentiment Analysis Service
 * US-203: Analyze review sentiment without external dependencies
 */

// Positive words
const POSITIVE_WORDS = [
  'love', 'great', 'amazing', 'excellent', 'perfect', 'wonderful', 'fantastic',
  'good', 'best', 'awesome', 'brilliant', 'outstanding', 'superb', 'fabulous',
  'incredible', 'marvelous', 'terrific', 'satisfied', 'happy', 'pleased',
  'impressed', 'recommend', 'works', 'effective', 'gentle', 'smooth', 'soft',
  'hydrated', 'moisturized', 'cleared', 'improved', 'better', 'results'
];

// Negative words
const NEGATIVE_WORDS = [
  'hate', 'terrible', 'awful', 'horrible', 'worst', 'bad', 'disappointed',
  'waste', 'useless', 'broken', 'irritated', 'burned', 'red', 'itchy',
  'drying', 'harsh', 'sticky', 'greasy', 'oily', 'breakout', 'acne',
  'rash', 'allergic', 'reaction', 'damaged', 'peeling', 'flaky', 'dry'
];

/**
 * Calculate sentiment score (0-1)
 * @param {string} text - Review text
 * @returns {number} Sentiment score (0 = negative, 1 = positive)
 */
export function analyzeSentiment(text) {
  if (!text || typeof text !== 'string') {
    return 0.5; // Neutral
  }

  const lowerText = text.toLowerCase();
  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive words
  POSITIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) positiveCount += matches.length;
  });

  // Count negative words
  NEGATIVE_WORDS.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) negativeCount += matches.length;
  });

  // Calculate score
  const total = positiveCount + negativeCount;
  if (total === 0) return 0.5; // Neutral

  // Normalize to 0-1 range
  const score = positiveCount / total;
  return Math.max(0, Math.min(1, score));
}

/**
 * Get sentiment label
 * @param {number} score - Sentiment score (0-1)
 * @returns {string} Sentiment label
 */
export function getSentimentLabel(score) {
  if (score >= 0.7) return 'positive';
  if (score >= 0.4) return 'neutral';
  return 'negative';
}

/**
 * Analyze multiple reviews
 * @param {Array} reviews - Array of review objects
 * @returns {Object} Analysis result
 */
export function analyzeReviews(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      averageSentiment: 0.5,
      sentimentLabel: 'neutral',
      positiveCount: 0,
      negativeCount: 0,
      neutralCount: 0,
      totalReviews: 0
    };
  }

  let totalSentiment = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  let neutralCount = 0;

  reviews.forEach(review => {
    const score = analyzeSentiment(review.comment || '');
    totalSentiment += score;

    if (score >= 0.7) positiveCount++;
    else if (score >= 0.4) neutralCount++;
    else negativeCount++;
  });

  const averageSentiment = totalSentiment / reviews.length;
  const sentimentLabel = getSentimentLabel(averageSentiment);

  return {
    averageSentiment,
    sentimentLabel,
    positiveCount,
    negativeCount,
    neutralCount,
    totalReviews: reviews.length
  };
}

/**
 * Get sentiment emoji
 * @param {number} score - Sentiment score (0-1)
 * @returns {string} Emoji
 */
export function getSentimentEmoji(score) {
  if (score >= 0.7) return '😊';
  if (score >= 0.4) return '😐';
  return '😞';
}

export default {
  analyzeSentiment,
  getSentimentLabel,
  analyzeReviews,
  getSentimentEmoji
};

