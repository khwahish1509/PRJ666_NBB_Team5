/**
 * Chat Context Service
 * Issue #58: Enriches chatbot queries with product, ingredient, and user profile context
 */

import User from '../models/User.js';
import ScanHistory from '../models/ScanHistory.js';
import { analyzeProductIngredients, getIngredientInfo } from './ingredientSafetyService.js';
import { getRecommendations } from './recommendationEngine.js';

/**
 * Build enriched context for chatbot
 * @param {string} userId - User ID (optional)
 * @param {string} message - User's message
 * @returns {Promise<Object>} Context object
 */
export async function buildChatContext(userId, message) {
  const context = {
    userProfile: null,
    lastScannedProduct: null,
    ingredientContext: null,
    recommendations: [],
    safetyInfo: null
  };

  try {
    // Get user profile if userId provided
    if (userId) {
      context.userProfile = await getUserProfile(userId);
      context.lastScannedProduct = await getLastScannedProduct(userId);
      
      // Get personalized recommendations
      if (context.userProfile?.skinType) {
        context.recommendations = await getRecommendations({
          userId,
          skinType: context.userProfile.skinType,
          limit: 3
        });
      }
    }

    // Extract ingredient mentions from message
    const ingredientMentions = extractIngredientMentions(message);
    if (ingredientMentions.length > 0) {
      context.ingredientContext = ingredientMentions.map(ing => 
        getIngredientInfo(ing)
      );
    }

    // Check if asking about product safety
    if (isProductSafetyQuery(message) && context.lastScannedProduct) {
      context.safetyInfo = analyzeProductIngredients(
        context.lastScannedProduct.ingredients.map(i => i.name)
      );
    }

  } catch (error) {
    console.error('Error building chat context:', error);
    // Return partial context on error
  }

  return context;
}

/**
 * Get user profile with skin type and goals
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User profile
 */
async function getUserProfile(userId) {
  try {
    const user = await User.findById(userId)
      .select('name skinType skinGoals')
      .lean();
    
    return user ? {
      name: user.name,
      skinType: user.skinType,
      skinGoals: user.skinGoals
    } : null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

/**
 * Get last scanned product from user's history
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} Last scanned product
 */
async function getLastScannedProduct(userId) {
  try {
    const lastScan = await ScanHistory.findOne({ userId })
      .sort({ scannedAt: -1 })
      .populate('productId')
      .lean();

    if (!lastScan?.productId) return null;

    return {
      name: lastScan.productId.name,
      brand: lastScan.productId.brand,
      category: lastScan.productId.category,
      safetyRating: lastScan.productId.safetyRating,
      ingredients: lastScan.productId.ingredients || [],
      rating: lastScan.productId.rating,
      scannedAt: lastScan.scannedAt
    };
  } catch (error) {
    console.error('Error fetching last scanned product:', error);
    return null;
  }
}

/**
 * Extract ingredient names from user message
 * @param {string} message - User message
 * @returns {Array<string>} Ingredient names
 */
function extractIngredientMentions(message) {
  const commonIngredients = [
    'hyaluronic acid', 'niacinamide', 'retinol', 'salicylic acid',
    'glycolic acid', 'vitamin c', 'vitamin e', 'ceramides',
    'peptides', 'zinc oxide', 'titanium dioxide', 'glycerin',
    'dimethicone', 'benzoyl peroxide', 'azelaic acid', 'lactic acid',
    'mandelic acid', 'kojic acid', 'arbutin', 'alpha arbutin',
    'tranexamic acid', 'centella asiatica', 'snail mucin',
    'propolis', 'tea tree oil', 'rosehip oil', 'jojoba oil',
    'squalane', 'bakuchiol', 'panthenol', 'allantoin'
  ];

  const lowerMessage = message.toLowerCase();
  return commonIngredients.filter(ing => lowerMessage.includes(ing));
}

/**
 * Check if message is asking about product safety
 * @param {string} message - User message
 * @returns {boolean} True if safety query
 */
function isProductSafetyQuery(message) {
  const safetyKeywords = [
    'safe', 'safety', 'dangerous', 'harmful', 'risk', 'warning',
    'good for', 'bad for', 'suitable', 'avoid', 'concern',
    'ingredient', 'contain', 'has', 'include'
  ];

  const lowerMessage = message.toLowerCase();
  return safetyKeywords.some(keyword => lowerMessage.includes(keyword));
}

/**
 * Format context into system prompt
 * @param {Object} context - Context object from buildChatContext
 * @returns {string} Formatted system prompt
 */
export function formatContextPrompt(context) {
  let prompt = '';

  // User profile context
  if (context.userProfile) {
    prompt += `\n\n=== USER PROFILE ===\n`;
    prompt += `Name: ${context.userProfile.name}\n`;
    if (context.userProfile.skinType) {
      prompt += `Skin Type: ${context.userProfile.skinType}\n`;
    }
    if (context.userProfile.skinGoals) {
      prompt += `Skin Goals: ${context.userProfile.skinGoals}\n`;
    }
  }

  // Last scanned product context
  if (context.lastScannedProduct) {
    prompt += `\n\n=== LAST SCANNED PRODUCT ===\n`;
    prompt += `Product: ${context.lastScannedProduct.brand} - ${context.lastScannedProduct.name}\n`;
    prompt += `Category: ${context.lastScannedProduct.category}\n`;
    prompt += `Safety Rating: ${context.lastScannedProduct.safetyRating}\n`;
    prompt += `Overall Rating: ${context.lastScannedProduct.rating}/5\n`;
    
    if (context.lastScannedProduct.ingredients.length > 0) {
      const topIngredients = context.lastScannedProduct.ingredients
        .slice(0, 5)
        .map(i => i.name)
        .join(', ');
      prompt += `Key Ingredients: ${topIngredients}\n`;
    }
  }

  // Safety analysis context
  if (context.safetyInfo) {
    prompt += `\n\n=== PRODUCT SAFETY ANALYSIS ===\n`;
    prompt += `Overall Safety: ${context.safetyInfo.safetyRating}\n`;
    prompt += `Risk Level: ${context.safetyInfo.riskLevel}\n`;
    
    if (context.safetyInfo.highRiskCount > 0) {
      prompt += `⚠️ High Risk Ingredients: ${context.safetyInfo.highRiskCount}\n`;
    }
    if (context.safetyInfo.allergenCount > 0) {
      prompt += `⚠️ Known Allergens: ${context.safetyInfo.allergenCount}\n`;
    }
    
    if (context.safetyInfo.warnings.length > 0) {
      prompt += `Warnings:\n`;
      context.safetyInfo.warnings.slice(0, 3).forEach(w => {
        prompt += `- ${w}\n`;
      });
    }
  }

  // Ingredient context
  if (context.ingredientContext && context.ingredientContext.length > 0) {
    prompt += `\n\n=== INGREDIENT INFORMATION ===\n`;
    context.ingredientContext.forEach(ing => {
      prompt += `\n${ing.name}:\n`;
      prompt += `- Risk Level: ${ing.riskLevel}\n`;
      if (ing.description) {
        prompt += `- Description: ${ing.description}\n`;
      }
      if (ing.warnings.length > 0) {
        prompt += `- Warnings: ${ing.warnings.join(', ')}\n`;
      }
    });
  }

  // Recommendations context
  if (context.recommendations && context.recommendations.length > 0) {
    prompt += `\n\n=== RECOMMENDED PRODUCTS ===\n`;
    context.recommendations.slice(0, 3).forEach((prod, idx) => {
      prompt += `${idx + 1}. ${prod.brand} - ${prod.name}\n`;
      prompt += `   Category: ${prod.category}, Rating: ${prod.rating}/5\n`;
    });
  }

  return prompt;
}

/**
 * Check if context is relevant to user query
 * @param {Object} context - Context object
 * @param {string} message - User message
 * @returns {boolean} True if context should be included
 */
export function isContextRelevant(context, message) {
  const lowerMessage = message.toLowerCase();
  
  // Don't include context for completely unrelated queries
  const unrelatedKeywords = ['time', 'weather', 'date', 'hello', 'hi', 'thanks', 'thank you'];
  const isUnrelated = unrelatedKeywords.some(k => lowerMessage.includes(k)) && 
                      !lowerMessage.includes('skin') && 
                      !lowerMessage.includes('product');
  if (isUnrelated) return false;
  
  // Always include user profile if available and query is skincare-related
  const skincareKeywords = ['skin', 'product', 'ingredient', 'safe', 'recommend', 'use', 'acne', 'dry', 'oily'];
  if (context.userProfile && skincareKeywords.some(k => lowerMessage.includes(k))) return true;
  
  // Include if asking about products
  const productKeywords = ['product', 'recommend', 'suggest', 'use', 'try'];
  if (productKeywords.some(k => lowerMessage.includes(k))) return true;
  
  // Include if asking about ingredients
  if (context.ingredientContext && context.ingredientContext.length > 0) return true;
  
  // Include if asking about safety
  if (isProductSafetyQuery(message) && context.lastScannedProduct) return true;
  
  return false;
}

export default {
  buildChatContext,
  formatContextPrompt,
  isContextRelevant
};
