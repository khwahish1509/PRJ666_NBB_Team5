/**
 * Test script for recommendations endpoint
 */

const BASE_URL = 'http://localhost:5000';

async function testRecommendations() {
  console.log('Testing GET /api/ai/recommendations endpoint...\n');

  try {
    // Test 1: Get all recommendations
    console.log('Test 1: Get all recommendations');
    const response1 = await fetch(`${BASE_URL}/api/ai/recommendations`);
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', JSON.stringify(data1, null, 2));
    console.log('\n---\n');

    // Test 2: Get benign recommendations
    console.log('Test 2: Get benign category recommendations');
    const response2 = await fetch(`${BASE_URL}/api/ai/recommendations?category=benign`);
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    console.log('Response:', JSON.stringify(data2, null, 2));
    console.log('\n---\n');

    // Test 3: Get suspicious recommendations
    console.log('Test 3: Get suspicious category recommendations');
    const response3 = await fetch(`${BASE_URL}/api/ai/recommendations?category=suspicious`);
    const data3 = await response3.json();
    console.log('Status:', response3.status);
    console.log('Response:', JSON.stringify(data3, null, 2));
    console.log('\n---\n');

    // Test 4: Get malignant recommendations
    console.log('Test 4: Get malignant category recommendations');
    const response4 = await fetch(`${BASE_URL}/api/ai/recommendations?category=malignant`);
    const data4 = await response4.json();
    console.log('Status:', response4.status);
    console.log('Response:', JSON.stringify(data4, null, 2));
    console.log('\n---\n');

    // Test 5: Invalid category
    console.log('Test 5: Invalid category (should return 400)');
    const response5 = await fetch(`${BASE_URL}/api/ai/recommendations?category=invalid`);
    const data5 = await response5.json();
    console.log('Status:', response5.status);
    console.log('Response:', JSON.stringify(data5, null, 2));

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRecommendations();
