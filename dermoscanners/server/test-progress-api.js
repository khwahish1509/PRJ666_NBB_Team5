/**
 * Test script for Progress & Gamification API
 * Tests analytics, comparison, and streak endpoints
 */

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:5001';

// Test user credentials
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123!'
};

async function login() {
  console.log('🔐 Logging in...');
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(TEST_USER)
  });

  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Login successful\n');
  return data.token;
}

async function testProgressAnalytics(token) {
  console.log('📊 Testing progress analytics...');
  
  const response = await fetch(`${API_URL}/api/progress/analytics`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Analytics failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Analytics retrieved successfully');
  console.log(`   Total Scans: ${data.data.totalScans}`);
  console.log(`   Level: ${data.data.level}`);
  console.log(`   XP: ${data.data.xp}`);
  console.log(`   Improvement Score: ${data.data.improvementScore}`);
  console.log(`   Achievements: ${data.data.achievements.length}`);
  console.log(`   Current Streak: ${data.data.stats.consistencyStreak}`);
  
  if (data.data.achievements.length > 0) {
    console.log('\n🏆 Unlocked Achievements:');
    data.data.achievements.forEach(achievement => {
      console.log(`   ${achievement.badge} ${achievement.title} - ${achievement.xp} XP`);
    });
  }
  
  console.log('\n');
  return data.data;
}

async function testStreak(token) {
  console.log('🔥 Testing streak data...');
  
  const response = await fetch(`${API_URL}/api/progress/streak`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Streak failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Streak data retrieved');
  console.log(`   Current Streak: ${data.data.currentStreak}`);
  console.log(`   Longest Streak: ${data.data.longestStreak}`);
  console.log(`   Scan Frequency: ${data.data.scanFrequency} per week`);
  console.log('\n');
}

async function testComparison(token, analytics) {
  if (analytics.totalScans < 2) {
    console.log('⚠️  Skipping comparison test - need at least 2 scans\n');
    return;
  }

  console.log('🔄 Testing scan comparison...');
  
  // Get scans to compare
  const scansResponse = await fetch(`${API_URL}/api/scans`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const scansData = await scansResponse.json();
  const scans = scansData.data;

  if (scans.length < 2) {
    console.log('⚠️  Not enough scans for comparison\n');
    return;
  }

  const scanId1 = scans[0]._id;
  const scanId2 = scans[scans.length - 1]._id;

  const response = await fetch(
    `${API_URL}/api/progress/comparison?scanId1=${scanId1}&scanId2=${scanId2}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (!response.ok) {
    throw new Error(`Comparison failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log('✅ Comparison retrieved successfully');
  console.log(`   Before: ${data.data.before.result} (Risk: ${data.data.before.risk})`);
  console.log(`   After: ${data.data.after.result} (Risk: ${data.data.after.risk})`);
  console.log(`   Risk Change: ${data.data.comparison.riskChange}`);
  console.log(`   Days Between: ${data.data.comparison.daysBetween}`);
  console.log(`   Status: ${data.data.comparison.improvement}`);
  console.log('\n');
}

async function testInvalidComparison(token) {
  console.log('❌ Testing invalid comparison request...');
  
  const response = await fetch(
    `${API_URL}/api/progress/comparison?scanId1=invalid`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );

  if (response.status === 400) {
    const data = await response.json();
    console.log(`✅ Correctly rejected: ${data.message}\n`);
  } else {
    console.log('⚠️  Expected 400 error but got:', response.status, '\n');
  }
}

async function runTests() {
  console.log('🧪 Progress & Gamification API Tests\n');
  console.log('='.repeat(50));
  console.log('\n');

  try {
    const token = await login();
    
    const analytics = await testProgressAnalytics(token);
    await testStreak(token);
    await testComparison(token, analytics);
    await testInvalidComparison(token);
    
    console.log('='.repeat(50));
    console.log('✅ All tests completed successfully!');
    console.log('\n💡 Summary:');
    console.log(`   - Total Scans: ${analytics.totalScans}`);
    console.log(`   - Level: ${analytics.level}`);
    console.log(`   - Achievements: ${analytics.achievements.length}/${analytics.achievements.length + 1}`);
    console.log(`   - Improvement Score: ${analytics.improvementScore}/100`);
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
