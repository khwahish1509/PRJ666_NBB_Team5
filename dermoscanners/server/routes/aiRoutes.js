import express from 'express';
import multer from 'multer';
import { analyzeImage, getRecommendations } from '../controllers/aiController.js';
import { validateImage } from '../middleware/imageValidation.js';

const router = express.Router();

// Configure multer for memory storage with 5MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /api/ai/analyze - Analyze uploaded image
router.post('/analyze', upload.single('image'), validateImage, analyzeImage);

// GET /api/ai/recommendations - Get health recommendations by risk category
router.get('/recommendations', getRecommendations);

export default router;
