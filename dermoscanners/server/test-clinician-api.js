/**
 * Test script for Clinician Finder API
 * Tests both coordinate-based and postal code-based searches
 */

import fetch from 'node-fetch';

const API_URL = process.env.API_URL || 'http://localhost:5001';

// Test user credentials (use your test account)
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

async function testCoordinateSearch(token) {
  console.log('📍 Testing coordinate-based search...');
  console.log('Location: Toronto, Canada (43.6532, -79.3832)');
  
  const response = await fetch(`${API_URL}/api/clinicians/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      latitude: 43.6532,
      longitude: -79.3832,
      radius: 10,
      filters: {
        openNow: false,
        topRated: true
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Coordinate search failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.count} clinicians`);
  console.log(`📊 Search radius: ${data.radius} km`);
  
  if (data.clinicians.length > 0) {
    console.log('\n🏥 Top 3 Results:');
    data.clinicians.slice(0, 3).forEach((clinic, index) => {
      console.log(`\n${index + 1}. ${clinic.name}`);
      console.log(`   📍 ${clinic.address}`);
      console.log(`   📏 Distance: ${clinic.distance} km`);
      if (clinic.phone) console.log(`   📞 ${clinic.phone}`);
      if (clinic.rating) console.log(`   ⭐ Rating: ${clinic.rating.toFixed(1)} (${clinic.reviewCount} reviews)`);
    });
  }
  console.log('\n');
}

async function testPostalCodeSearch(token) {
  console.log('📮 Testing postal code-based search...');
  console.log('Postal Code: M5H 2N2 (Toronto Downtown)');
  
  const response = await fetch(`${API_URL}/api/clinicians/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      postalCode: 'M5H 2N2',
      radius: 5,
      filters: {
        openNow: false,
        topRated: false
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Postal code search failed: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(`✅ Found ${data.count} clinicians`);
  console.log(`📊 Search radius: ${data.radius} km`);
  console.log(`📍 Geocoded location: ${data.location.latitude}, ${data.location.longitude}`);
  
  if (data.clinicians.length > 0) {
    console.log('\n🏥 Nearest Clinician:');
    const nearest = data.clinicians[0];
    console.log(`   Name: ${nearest.name}`);
    console.log(`   Address: ${nearest.address}`);
    console.log(`   Distance: ${nearest.distance} km`);
    if (nearest.phone) console.log(`   Phone: ${nearest.phone}`);
    if (nearest.website) console.log(`   Website: ${nearest.website}`);
  }
  console.log('\n');
}

async function testInvalidRequest(token) {
  console.log('❌ Testing invalid request (no location data)...');
  
  const response = await fetch(`${API_URL}/api/clinicians/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      radius: 10
    })
  });

  if (response.status === 400) {
    const data = await response.json();
    console.log(`✅ Correctly rejected: ${data.error}\n`);
  } else {
    console.log('⚠️  Expected 400 error but got:', response.status, '\n');
  }
}

async function runTests() {
  console.log('🧪 Clinician Finder API Tests\n');
  console.log('='.repeat(50));
  console.log('\n');

  try {
    const token = await login();
    
    await testCoordinateSearch(token);
    await testPostalCodeSearch(token);
    await testInvalidRequest(token);
    
    console.log('='.repeat(50));
    console.log('✅ All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

runTests();
