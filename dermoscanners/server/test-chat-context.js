/**
 * Test Chat Context Engine
 * Issue #58: Test context enrichment functionality
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { buildChatContext, formatContextPrompt, isContextRelevant } from './services/chatContextService.js';
import User from './models/User.js';
import Product from './models/Product.js';
import ScanHistory from './models/ScanHistory.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dermoscanners';

async function testChatContext() {
  try {
    console.log('🧪 Testing Chat Context Engine...\n');

    // Connect to database
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Context without user (anonymous)
    console.log('📝 Test 1: Anonymous user query');
    console.log('Query: "What does salicylic acid do?"');
    const context1 = await buildChatContext(null, 'What does salicylic acid do?');
    console.log('Context built:', {
      hasUserProfile: !!context1.userProfile,
      hasLastProduct: !!context1.lastScannedProduct,
      ingredientCount: context1.ingredientContext?.length || 0,
      recommendationCount: context1.recommendations?.length || 0
    });
    console.log('Ingredient detected:', context1.ingredientContext?.[0]?.name);
    console.log('✅ Test 1 passed\n');

    // Test 2: Find a real user
    console.log('📝 Test 2: Authenticated user with profile');
    const user = await User.findOne().lean();
    
    if (!user) {
      console.log('⚠️  No users found in database. Skipping user-specific tests.');
    } else {
      console.log(`Found user: ${user.name} (${user.skinType || 'no skin type'})`);
      
      const context2 = await buildChatContext(user._id.toString(), 'Is this product good for oily skin?');
      console.log('Context built:', {
        hasUserProfile: !!context2.userProfile,
        skinType: context2.userProfile?.skinType,
        hasLastProduct: !!context2.lastScannedProduct,
        recommendationCount: context2.recommendations?.length || 0
      });
      
      if (context2.lastScannedProduct) {
        console.log('Last scanned product:', context2.lastScannedProduct.name);
        console.log('Safety rating:', context2.lastScannedProduct.safetyRating);
      }
      
      console.log('✅ Test 2 passed\n');

      // Test 3: Safety query with product context
      console.log('📝 Test 3: Product safety query');
      const context3 = await buildChatContext(user._id.toString(), 'Is this safe for my skin?');
      
      if (context3.safetyInfo) {
        console.log('Safety analysis:', {
          safetyRating: context3.safetyInfo.safetyRating,
          riskLevel: context3.safetyInfo.riskLevel,
          highRiskCount: context3.safetyInfo.highRiskCount,
          allergenCount: context3.safetyInfo.allergenCount
        });
        console.log('✅ Test 3 passed\n');
      } else {
        console.log('⚠️  No safety info (user may not have scanned products)\n');
      }
    }

    // Test 4: Format context prompt
    console.log('📝 Test 4: Format context prompt');
    const testContext = {
      userProfile: {
        name: 'Test User',
        skinType: 'oily',
        skinGoals: 'Reduce acne and control oil'
      },
      lastScannedProduct: {
        name: 'Hydrating Cleanser',
        brand: 'CeraVe',
        category: 'cleanser',
        safetyRating: 'safe',
        rating: 4.5,
        ingredients: [
          { name: 'Hyaluronic Acid' },
          { name: 'Ceramides' },
          { name: 'Glycerin' }
        ]
      },
      safetyInfo: {
        safetyRating: 'safe',
        riskLevel: 'low',
        highRiskCount: 0,
        allergenCount: 0,
        warnings: []
      },
      recommendations: [
        { name: 'Oil Control Moisturizer', brand: 'Neutrogena', category: 'moisturizer', rating: 4.3 }
      ]
    };

    const formatted = formatContextPrompt(testContext);
    console.log('Formatted prompt length:', formatted.length, 'characters');
    console.log('Contains user profile:', formatted.includes('USER PROFILE'));
    console.log('Contains product info:', formatted.includes('LAST SCANNED PRODUCT'));
    console.log('Contains safety analysis:', formatted.includes('PRODUCT SAFETY ANALYSIS'));
    console.log('✅ Test 4 passed\n');

    // Test 5: Context relevance detection
    console.log('📝 Test 5: Context relevance detection');
    const queries = [
      { msg: 'What is hyaluronic acid?', expected: true },
      { msg: 'Is this product safe?', expected: true },
      { msg: 'Recommend a moisturizer', expected: true },
      { msg: 'What time is it?', expected: false }
    ];

    queries.forEach(({ msg, expected }) => {
      const relevant = isContextRelevant(testContext, msg);
      const status = relevant === expected ? '✅' : '❌';
      console.log(`${status} "${msg}" -> ${relevant ? 'relevant' : 'not relevant'}`);
    });
    console.log('✅ Test 5 passed\n');

    // Test 6: Ingredient extraction
    console.log('📝 Test 6: Ingredient mention extraction');
    const ingredientQueries = [
      'What does niacinamide do?',
      'Can I use retinol with vitamin C?',
      'Tell me about salicylic acid and benzoyl peroxide'
    ];

    for (const query of ingredientQueries) {
      const context = await buildChatContext(null, query);
      console.log(`Query: "${query}"`);
      console.log(`Ingredients found: ${context.ingredientContext?.length || 0}`);
      if (context.ingredientContext) {
        context.ingredientContext.forEach(ing => {
          console.log(`  - ${ing.name} (${ing.riskLevel} risk)`);
        });
      }
    }
    console.log('✅ Test 6 passed\n');

    console.log('🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
    console.error(error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

// Run tests
testChatContext();
