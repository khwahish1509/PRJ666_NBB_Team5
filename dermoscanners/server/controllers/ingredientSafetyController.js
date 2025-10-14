import {
  analyzeIngredient,
  analyzeProductIngredients,
  getIngredientInfo,
  checkSkinTypeCompatibility
} from '../services/ingredientSafetyService.js';

/**
 * Analyze a single ingredient
 * POST /api/ingredients/analyze
 */
export async function analyzeIngredientEndpoint(req, res) {
  try {
    const { ingredient } = req.body;

    if (!ingredient) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient name is required'
      });
    }

    const analysis = analyzeIngredient(ingredient);
    const info = getIngredientInfo(ingredient);

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error analyzing ingredient:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing ingredient'
    });
  }
}

/**
 * Analyze multiple ingredients (product analysis)
 * POST /api/ingredients/analyze-product
 */
export async function analyzeProductIngredientsEndpoint(req, res) {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingredients array is required'
      });
    }

    const analysis = analyzeProductIngredients(ingredients);

    res.json({
      success: true,
      data: analysis
    });
  } catch (error) {
    console.error('Error analyzing product ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while analyzing ingredients'
    });
  }
}

/**
 * Check ingredient compatibility with skin type
 * POST /api/ingredients/check-compatibility
 */
export async function checkCompatibilityEndpoint(req, res) {
  try {
    const { ingredient, skinType } = req.body;

    if (!ingredient) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient name is required'
      });
    }

    if (!skinType) {
      return res.status(400).json({
        success: false,
        message: 'Skin type is required'
      });
    }

    const validSkinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal'];
    if (!validSkinTypes.includes(skinType.toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid skin type. Must be one of: ' + validSkinTypes.join(', ')
      });
    }

    const compatibility = checkSkinTypeCompatibility(ingredient, skinType.toLowerCase());

    res.json({
      success: true,
      data: {
        ingredient,
        skinType: skinType.toLowerCase(),
        ...compatibility
      }
    });
  } catch (error) {
    console.error('Error checking compatibility:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while checking compatibility'
    });
  }
}

/**
 * Get ingredient information
 * GET /api/ingredients/info/:ingredient
 */
export async function getIngredientInfoEndpoint(req, res) {
  try {
    const { ingredient } = req.params;

    if (!ingredient) {
      return res.status(400).json({
        success: false,
        message: 'Ingredient name is required'
      });
    }

    const info = getIngredientInfo(decodeURIComponent(ingredient));

    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    console.error('Error getting ingredient info:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while getting ingredient info'
    });
  }
}

/**
 * Batch analyze multiple ingredients
 * POST /api/ingredients/batch-analyze
 */
export async function batchAnalyzeIngredientsEndpoint(req, res) {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Ingredients array is required'
      });
    }

    if (ingredients.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Maximum 50 ingredients allowed per batch'
      });
    }

    const results = ingredients.map(ingredient => {
      const analysis = analyzeIngredient(ingredient);
      const info = getIngredientInfo(ingredient);
      return info;
    });

    res.json({
      success: true,
      count: results.length,
      data: results
    });
  } catch (error) {
    console.error('Error batch analyzing ingredients:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while batch analyzing ingredients'
    });
  }
}

