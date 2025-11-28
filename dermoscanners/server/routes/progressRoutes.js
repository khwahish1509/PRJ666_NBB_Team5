import express from 'express';
import { getProgressAnalytics, getComparison, getStreak } from '../controllers/progressController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Progress and gamification endpoints
router.get('/analytics', requireAuth, getProgressAnalytics);
router.get('/comparison', requireAuth, getComparison);
router.get('/streak', requireAuth, getStreak);

export default router;
