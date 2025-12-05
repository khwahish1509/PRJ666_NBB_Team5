/**
 * RAG (Retrieval-Augmented Generation) Insights Service
 * Generates human-readable explanations for skin lesion analysis results
 * Uses local knowledge base without requiring external AI APIs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load knowledge base
let knowledgeBase = null;

function loadKnowledgeBase() {
  if (!knowledgeBase) {
    const knowledgePath = path.join(__dirname, '../data/skinLesionKnowledge.json');
    const data = fs.readFileSync(knowledgePath, 'utf8');
    knowledgeBase = JSON.parse(data);
  }
  return knowledgeBase;
}

/**
 * Calculate similarity score between two strings (simple implementation)
 * In production, this would use embeddings and vector similarity
 */
function calculateSimilarity(str1, str2) {
  const words1 = str1.toLowerCase().split(/\s+/);
  const words2 = str2.toLowerCase().split(/\s+/);
  const commonWords = words1.filter(word => words2.includes(word));
  return commonWords.length / Math.max(words1.length, words2.length);
}

/**
 * Retrieve relevant information from knowledge base
 * Simulates RAG retrieval process
 */
function retrieveRelevantInfo(result, confidence) {
  const kb = loadKnowledgeBase();
  const lesionData = kb.lesionTypes[result];
  
  if (!lesionData) {
    throw new Error(`Unknown result type: ${result}`);
  }

  // Select most relevant lesion type based on confidence
  let selectedLesion;
  if (lesionData.commonTypes && lesionData.commonTypes.length > 0) {
    // Higher confidence = first type, lower confidence = later types
    const index = Math.min(
      Math.floor((1 - confidence) * lesionData.commonTypes.length),
      lesionData.commonTypes.length - 1
    );
    selectedLesion = lesionData.commonTypes[index];
  }

  return {
    lesionData,
    selectedLesion,
    riskFactors: kb.riskFactors,
    prevention: kb.preventionGuidelines
  };
}

/**
 * Generate confidence-based qualifier
 */
function getConfidenceQualifier(confidence) {
  if (confidence >= 0.9) return 'strongly suggests';
  if (confidence >= 0.75) return 'indicates';
  if (confidence >= 0.6) return 'may suggest';
  return 'shows some characteristics of';
}

/**
 * Generate detailed explanation paragraph
 */
function generateExplanation(result, confidence, retrievedInfo) {
  const { lesionData, selectedLesion } = retrievedInfo;
  const qualifier = getConfidenceQualifier(confidence);
  const confidencePercent = Math.round(confidence * 100);

  let explanation = '';

  // Opening statement
  if (result === 'benign') {
    explanation += `Based on the analysis with ${confidencePercent}% confidence, this lesion ${qualifier} a benign (non-cancerous) skin condition. `;
  } else if (result === 'suspicious') {
    explanation += `The analysis with ${confidencePercent}% confidence ${qualifier} a suspicious lesion that requires professional medical evaluation. `;
  } else {
    explanation += `With ${confidencePercent}% confidence, this analysis ${qualifier} characteristics consistent with a potentially malignant lesion requiring immediate medical attention. `;
  }

  // Specific lesion type information
  if (selectedLesion) {
    explanation += `The features observed are consistent with ${selectedLesion.name}, which is ${selectedLesion.description.toLowerCase()}. `;
    
    // Add key characteristics
    if (selectedLesion.characteristics && selectedLesion.characteristics.length > 0) {
      const charList = selectedLesion.characteristics.slice(0, 3).join(', ');
      explanation += `Common characteristics include: ${charList}. `;
    }
  }

  // General characteristics
  if (lesionData.generalCharacteristics) {
    const chars = lesionData.generalCharacteristics;
    explanation += `Typical features of ${result} lesions include ${chars.borders?.toLowerCase() || 'regular borders'}, `;
    explanation += `${chars.asymmetry?.toLowerCase() || 'symmetrical appearance'}, and `;
    explanation += `${chars.color?.toLowerCase() || 'uniform coloration'}. `;
  }

  return explanation;
}

/**
 * Generate key findings list
 */
function generateKeyFindings(result, confidence, retrievedInfo) {
  const { lesionData, selectedLesion } = retrievedInfo;
  const findings = [];

  // Classification finding
  findings.push({
    category: 'Classification',
    finding: `${result.charAt(0).toUpperCase() + result.slice(1)} lesion detected`,
    confidence: `${Math.round(confidence * 100)}% confidence`
  });

  // Risk level
  if (selectedLesion && selectedLesion.riskLevel) {
    findings.push({
      category: 'Risk Assessment',
      finding: selectedLesion.riskLevel,
      confidence: null
    });
  }

  // Characteristics
  if (lesionData.generalCharacteristics) {
    const chars = lesionData.generalCharacteristics;
    findings.push({
      category: 'Border Analysis',
      finding: chars.borders || 'Analysis completed',
      confidence: null
    });
    findings.push({
      category: 'Symmetry',
      finding: chars.asymmetry || 'Analysis completed',
      confidence: null
    });
    findings.push({
      category: 'Color Pattern',
      finding: chars.color || 'Analysis completed',
      confidence: null
    });
  }

  return findings;
}

/**
 * Generate medical context
 */
function generateMedicalContext(result, retrievedInfo) {
  const { selectedLesion } = retrievedInfo;
  
  if (!selectedLesion) return null;

  return {
    lesionType: selectedLesion.name,
    description: selectedLesion.description,
    prevalence: selectedLesion.prevalence,
    riskLevel: selectedLesion.riskLevel
  };
}

/**
 * Generate recommendations based on result
 */
function generateRecommendations(result, confidence, retrievedInfo) {
  const { lesionData } = retrievedInfo;
  
  if (!lesionData.recommendations && !lesionData.urgentRecommendations) {
    return [];
  }

  const recs = lesionData.recommendations || lesionData.urgentRecommendations || [];
  
  // Return top recommendations based on confidence
  const numRecs = confidence >= 0.8 ? 5 : 4;
  return recs.slice(0, numRecs);
}

/**
 * Generate warning signs (for suspicious/malignant)
 */
function generateWarningSigns(result, retrievedInfo) {
  const { lesionData } = retrievedInfo;
  
  if (result === 'benign') return null;

  if (result === 'suspicious' && lesionData.warningSignsABCDE) {
    return {
      title: 'ABCDE Warning Signs Detected',
      signs: Object.entries(lesionData.warningSignsABCDE).map(([key, value]) => ({
        letter: key,
        description: value
      }))
    };
  }

  if (result === 'malignant' && lesionData.criticalFeatures) {
    return {
      title: 'Critical Features Identified',
      features: lesionData.criticalFeatures
    };
  }

  return null;
}

/**
 * Main function: Generate complete intelligent insights
 */
export function generateInsights(result, confidence) {
  try {
    // Validate inputs
    if (!['benign', 'suspicious', 'malignant'].includes(result)) {
      throw new Error('Invalid result type');
    }
    if (confidence < 0 || confidence > 1) {
      throw new Error('Confidence must be between 0 and 1');
    }

    // Retrieve relevant information from knowledge base
    const retrievedInfo = retrieveRelevantInfo(result, confidence);

    // Generate all insight components
    const insights = {
      explanation: generateExplanation(result, confidence, retrievedInfo),
      keyFindings: generateKeyFindings(result, confidence, retrievedInfo),
      medicalContext: generateMedicalContext(result, retrievedInfo),
      recommendations: generateRecommendations(result, confidence, retrievedInfo),
      warningSigns: generateWarningSigns(result, retrievedInfo),
      
      // Metadata
      generatedAt: new Date().toISOString(),
      confidenceLevel: confidence >= 0.9 ? 'Very High' : 
                       confidence >= 0.75 ? 'High' : 
                       confidence >= 0.6 ? 'Moderate' : 'Low',
      
      // Safety disclaimer
      disclaimer: 'This analysis is for educational purposes only and should not be used for medical diagnosis. Always consult a qualified healthcare professional for proper evaluation and treatment.'
    };

    return insights;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}

/**
 * Get prevention guidelines
 */
export function getPreventionGuidelines() {
  const kb = loadKnowledgeBase();
  return kb.preventionGuidelines;
}

/**
 * Get risk factors information
 */
export function getRiskFactors() {
  const kb = loadKnowledgeBase();
  return kb.riskFactors;
}

/**
 * Search knowledge base (simple keyword search)
 * In production, this would use vector embeddings
 */
export function searchKnowledge(query) {
  const kb = loadKnowledgeBase();
  const results = [];

  // Search through all lesion types
  Object.entries(kb.lesionTypes).forEach(([category, data]) => {
    if (data.commonTypes) {
      data.commonTypes.forEach(lesion => {
        const similarity = calculateSimilarity(query, 
          `${lesion.name} ${lesion.description} ${lesion.characteristics?.join(' ') || ''}`
        );
        
        if (similarity > 0.1) {
          results.push({
            category,
            lesion: lesion.name,
            description: lesion.description,
            relevanceScore: similarity
          });
        }
      });
    }
  });

  // Sort by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);
  return results.slice(0, 5);
}

export default {
  generateInsights,
  getPreventionGuidelines,
  getRiskFactors,
  searchKnowledge
};
