/**
 * Test script for RAG Insights Service
 * Tests the intelligent insights generation functionality
 */

import { generateInsights, searchKnowledge, getPreventionGuidelines, getRiskFactors } from './services/ragInsightsService.js';

console.log('='.repeat(80));
console.log('RAG INSIGHTS SERVICE TEST');
console.log('='.repeat(80));
console.log();

// Test 1: Generate insights for benign lesion
console.log('TEST 1: Benign Lesion (High Confidence)');
console.log('-'.repeat(80));
try {
  const benignInsights = generateInsights('benign', 0.92);
  console.log('✓ Insights generated successfully');
  console.log('\nExplanation:');
  console.log(benignInsights.explanation);
  console.log('\nKey Findings:', benignInsights.keyFindings.length, 'findings');
  console.log('\nRecommendations:', benignInsights.recommendations.length, 'recommendations');
  console.log('\nConfidence Level:', benignInsights.confidenceLevel);
  if (benignInsights.medicalContext) {
    console.log('\nMedical Context:');
    console.log('  Lesion Type:', benignInsights.medicalContext.lesionType);
    console.log('  Risk Level:', benignInsights.medicalContext.riskLevel);
  }
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 2: Generate insights for suspicious lesion
console.log('TEST 2: Suspicious Lesion (Moderate Confidence)');
console.log('-'.repeat(80));
try {
  const suspiciousInsights = generateInsights('suspicious', 0.73);
  console.log('✓ Insights generated successfully');
  console.log('\nExplanation:');
  console.log(suspiciousInsights.explanation);
  console.log('\nWarning Signs:', suspiciousInsights.warningSigns ? 'Present' : 'None');
  if (suspiciousInsights.warningSigns && suspiciousInsights.warningSigns.signs) {
    console.log('\nABCDE Warning Signs:');
    suspiciousInsights.warningSigns.signs.forEach(sign => {
      console.log(`  ${sign.letter}: ${sign.description}`);
    });
  }
  console.log('\nRecommendations:', suspiciousInsights.recommendations.length, 'recommendations');
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 3: Generate insights for malignant lesion
console.log('TEST 3: Malignant Lesion (High Confidence)');
console.log('-'.repeat(80));
try {
  const malignantInsights = generateInsights('malignant', 0.88);
  console.log('✓ Insights generated successfully');
  console.log('\nExplanation:');
  console.log(malignantInsights.explanation);
  console.log('\nCritical Features:', malignantInsights.warningSigns ? 'Present' : 'None');
  if (malignantInsights.warningSigns && malignantInsights.warningSigns.features) {
    console.log('\nCritical Features Identified:');
    Object.entries(malignantInsights.warningSigns.features).forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  }
  console.log('\nUrgent Recommendations:', malignantInsights.recommendations.length, 'recommendations');
  malignantInsights.recommendations.forEach((rec, i) => {
    console.log(`  ${i + 1}. ${rec}`);
  });
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 4: Search knowledge base
console.log('TEST 4: Knowledge Base Search');
console.log('-'.repeat(80));
try {
  const searchResults = searchKnowledge('melanoma skin cancer');
  console.log('✓ Search completed successfully');
  console.log(`\nFound ${searchResults.length} results for "melanoma skin cancer":`);
  searchResults.forEach((result, i) => {
    console.log(`\n${i + 1}. ${result.lesion} (${result.category})`);
    console.log(`   Relevance: ${(result.relevanceScore * 100).toFixed(1)}%`);
    console.log(`   ${result.description.substring(0, 100)}...`);
  });
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 5: Get prevention guidelines
console.log('TEST 5: Prevention Guidelines');
console.log('-'.repeat(80));
try {
  const prevention = getPreventionGuidelines();
  console.log('✓ Prevention guidelines retrieved successfully');
  console.log('\nSun Protection Tips:', prevention.sunProtection.length, 'tips');
  console.log('Self-Examination Tips:', prevention.selfExamination.length, 'tips');
  console.log('Professional Care Tips:', prevention.professionalCare.length, 'tips');
  console.log('\nExample Sun Protection Tip:');
  console.log('  •', prevention.sunProtection[0]);
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 6: Get risk factors
console.log('TEST 6: Risk Factors Information');
console.log('-'.repeat(80));
try {
  const riskFactors = getRiskFactors();
  console.log('✓ Risk factors retrieved successfully');
  console.log('\nEnvironmental Factors:', riskFactors.environmental.length, 'factors');
  console.log('Genetic Factors:', riskFactors.genetic.length, 'factors');
  console.log('Medical Factors:', riskFactors.medical.length, 'factors');
  console.log('\nExample Environmental Factor:');
  console.log('  •', riskFactors.environmental[0]);
} catch (error) {
  console.error('✗ Error:', error.message);
}
console.log();

// Test 7: Edge cases
console.log('TEST 7: Edge Cases and Error Handling');
console.log('-'.repeat(80));

// Test invalid result type
try {
  generateInsights('invalid', 0.8);
  console.log('✗ Should have thrown error for invalid result type');
} catch (error) {
  console.log('✓ Correctly rejected invalid result type');
}

// Test invalid confidence (too high)
try {
  generateInsights('benign', 1.5);
  console.log('✗ Should have thrown error for confidence > 1');
} catch (error) {
  console.log('✓ Correctly rejected confidence > 1');
}

// Test invalid confidence (negative)
try {
  generateInsights('benign', -0.1);
  console.log('✗ Should have thrown error for negative confidence');
} catch (error) {
  console.log('✓ Correctly rejected negative confidence');
}

// Test low confidence
try {
  const lowConfInsights = generateInsights('benign', 0.55);
  console.log('✓ Successfully generated insights for low confidence (0.55)');
  console.log('  Confidence Level:', lowConfInsights.confidenceLevel);
} catch (error) {
  console.error('✗ Error:', error.message);
}

console.log();
console.log('='.repeat(80));
console.log('ALL TESTS COMPLETED');
console.log('='.repeat(80));
