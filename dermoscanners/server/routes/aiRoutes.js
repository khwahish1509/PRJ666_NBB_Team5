import express from 'express';
import multer from 'multer';
import { 
  analyzeImage, 
  getRecommendations, 
  getInsights,
  searchKnowledge,
  getPreventionGuidelines,
  getRiskFactorsInfo
} from '../controllers/aiController.js';
import { validateImage } from '../middleware/imageValidation.js';

const router = express.Router();

// Configure multer for memory storage with 5MB limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// POST /api/ai/analyze - Analyze uploaded image (includes insights)
router.post('/analyze', upload.single('image'), validateImage, analyzeImage);

// POST /api/ai/insights - Get intelligent insights for result
router.post('/insights', getInsights);

// GET /api/ai/recommendations - Get health recommendations by risk category
router.get('/recommendations', getRecommendations);

// Knowledge base endpoints
router.get('/knowledge/search', searchKnowledge);
router.get('/knowledge/prevention', getPreventionGuidelines);
router.get('/knowledge/risk-factors', getRiskFactorsInfo);

export default router;
