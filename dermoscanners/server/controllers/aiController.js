/**
 * AI Controller - Mock AI endpoint for skin lesion analysis
 * Simulates AI model inference without requiring a trained model
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

    return res.status(200).json({
      result,
      confidence: parseFloat(confidence.toFixed(2)),
      processingTime,
      timestamp
    });
  } catch (error) {
    console.error('Error in analyzeImage:', error);
    return res.status(500).json({ 
      error: 'Internal server error during image analysis' 
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
