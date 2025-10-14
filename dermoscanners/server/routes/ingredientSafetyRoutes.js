import express from 'express';
import {
  analyzeIngredientEndpoint,
  analyzeProductIngredientsEndpoint,
  checkCompatibilityEndpoint,
  getIngredientInfoEndpoint,
  batchAnalyzeIngredientsEndpoint
} from '../controllers/ingredientSafetyController.js';

const router = express.Router();

// Ingredient safety routes
router.post('/analyze', analyzeIngredientEndpoint); // POST /api/ingredients/analyze
router.post('/analyze-product', analyzeProductIngredientsEndpoint); // POST /api/ingredients/analyze-product
router.post('/check-compatibility', checkCompatibilityEndpoint); // POST /api/ingredients/check-compatibility
router.post('/batch-analyze', batchAnalyzeIngredientsEndpoint); // POST /api/ingredients/batch-analyze
router.get('/info/:ingredient', getIngredientInfoEndpoint); // GET /api/ingredients/info/:ingredient

export default router;

