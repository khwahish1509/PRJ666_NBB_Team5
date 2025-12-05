/**
 * AI Controller - Mock AI endpoint for skin lesion analysis
 * Simulates AI model inference without requiring a trained model
 * Includes RAG-based intelligent insights generation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateInsights } from '../services/ragInsightsService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Analyze uploaded image and return mock classification result
 * Simulates 3-second processing delay to mimic real AI inference
 */
export async function analyzeImage(req, res) {
  try {
    const startTime = Date.now();

    // Simulate 3-second AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Generate random mock result
    const results = ['benign', 'suspicious', 'malignant'];
    const randomIndex = Math.floor(Math.random() * results.length);
    const result = results[randomIndex];

    // Generate confidence score based on result type
    let confidence;
    if (result === 'benign') {
      // Benign: 75-95% confidence
      confidence = 0.75 + Math.random() * 0.20;
    } else if (result === 'suspicious') {
      // Suspicious: 60-85% confidence
      confidence = 0.60 + Math.random() * 0.25;
    } else {
      // Malignant: 70-95% confidence
      confidence = 0.70 + Math.random() * 0.25;
    }

    const processingTime = Date.now() - startTime;
    const timestamp = new Date().toISOString();
    const finalConfidence = parseFloat(confidence.toFixed(2));

    // Generate intelligent insights using RAG
    let insights = null;
    try {
      insights = generateInsights(result, finalConfidence);
    } catch (insightError) {
      console.error('Error generating insights:', insightError);
      // Continue without insights if generation fails
    }

    return res.status(200).json({
      result,
      confidence: finalConfidence,
      processingTime,
      timestamp,
      insights // Include RAG-generated insights
    });
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    return res.status(500).json({ 
      error: 'Internal server error during image analysis' 
    });
  }
}

/**
 * Get intelligent insights for a specific result and confidence
 * POST /api/ai/insights
 */
export async function getInsights(req, res) {
  try {
    const { result, confidence } = req.body;

    // Validate inputs
    if (!result || confidence === undefined) {
      return res.status(400).json({
        error: 'Missing required fields: result and confidence'
      });
    }

    if (!['benign', 'suspicious', 'malignant'].includes(result)) {
      return res.status(400).json({
        error: 'Invalid result. Must be one of: benign, suspicious, malignant'
      });
    }

    if (confidence < 0 || confidence > 1) {
      return res.status(400).json({
        error: 'Confidence must be between 0 and 1'
      });
    }

    // Generate insights
    const insights = generateInsights(result, confidence);

    return res.status(200).json({
      success: true,
      data: insights
    });
  } catch (error) {
    console.error('Error in getInsights:', error);
    return res.status(500).json({
      error: 'Internal server error while generating insights'
    });
  }
}

/**
 * Get health recommendations from recommendations.json file
 * Returns all recommendations or filtered by risk category
 */
export async function getRecommendations(req, res) {
  try {
    const recommendationsPath = path.join(__dirname, '../data/recommendations.json');
    
    // Read recommendations file
    const data = fs.readFileSync(recommendationsPath, 'utf8');
    const recommendations = JSON.parse(data);

    // Optional: filter by risk category if provided in query
    const { category } = req.query;
    
    if (category) {
      const validCategories = ['benign', 'suspicious', 'malignant'];
      if (!validCategories.includes(category)) {
        return res.status(400).json({ 
          error: 'Invalid category. Must be one of: benign, suspicious, malignant' 
        });
      }
      
      return res.status(200).json({
        version: recommendations.version,
        category: recommendations[category]
      });
    }

    // Return all recommendations
    return res.status(200).json(recommendations);
  } catch (error) {
    console.error('Error in getRecommendations:', error);
    return res.status(500).json({ 
      error: 'Internal server error while fetching recommendations' 
    });
  }
}

/**
 * Search knowledge base
 * GET /api/ai/knowledge/search?q=query
 */
export async function searchKnowledge(req, res) {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        error: 'Search query is required'
      });
    }

    const { searchKnowledge: search } = await import('../services/ragInsightsService.js');
    const results = search(q);

    return res.status(200).json({
      success: true,
      query: q,
      results
    });
  } catch (error) {
    console.error('Error in searchKnowledge:', error);
    return res.status(500).json({
      error: 'Internal server error while searching knowledge base'
    });
  }
}

/**
 * Get prevention guidelines
 * GET /api/ai/knowledge/prevention
 */
export async function getPreventionGuidelines(req, res) {
  try {
    const { getPreventionGuidelines: getPrevention } = await import('../services/ragInsightsService.js');
    const guidelines = getPrevention();

    return res.status(200).json({
      success: true,
      data: guidelines
    });
  } catch (error) {
    console.error('Error in getPreventionGuidelines:', error);
    return res.status(500).json({
      error: 'Internal server error while fetching prevention guidelines'
    });
  }
}

/**
 * Get risk factors
 * GET /api/ai/knowledge/risk-factors
 */
export async function getRiskFactorsInfo(req, res) {
  try {
    const { getRiskFactors } = await import('../services/ragInsightsService.js');
    const riskFactors = getRiskFactors();

    return res.status(200).json({
      success: true,
      data: riskFactors
    });
  } catch (error) {
    console.error('Error in getRiskFactorsInfo:', error);
    return res.status(500).json({
      error: 'Internal server error while fetching risk factors'
    });
  }
}
