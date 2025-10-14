import {
  analyzeSentiment,
  getSentimentLabel,
  analyzeReviews,
  getSentimentEmoji
} from '../services/sentimentAnalysis.js';

/**
 * Analyze sentiment of a single review
 * POST /api/sentiment/analyze
 */
export async function analyzeSentimentEndpoint(req, res) {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text is required'
      });
    }

    const score = analyzeSentiment(text);
    const label = getSentimentLabel(score);
    const emoji = getSentimentEmoji(score);

    res.json({
      success: true,
      data: {
        text,
        score,
        label,
        emoji
      }
    });
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing sentiment'
    });
  }
}

/**
 * Analyze multiple reviews
 * POST /api/sentiment/analyze-reviews
 */
export async function analyzeReviewsEndpoint(req, res) {
  try {
    const { reviews } = req.body;

    if (!Array.isArray(reviews) || reviews.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Reviews array is required'
      });
    }

    const analysis = analyzeReviews(reviews);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error analyzing reviews'
    });
  }
}

