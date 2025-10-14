import express from 'express';
import {
  analyzeSentimentEndpoint,
  analyzeReviewsEndpoint
} from '../controllers/sentimentController.js';

const router = express.Router();

// Sentiment analysis routes
router.post('/analyze', analyzeSentimentEndpoint);
router.post('/analyze-reviews', analyzeReviewsEndpoint);

export default router;

