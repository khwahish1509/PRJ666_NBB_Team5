/**
 * Quick Server Test Script
 * Tests if the server is running and endpoints are accessible
 */

const http = require('http');

const BASE_URL = 'http://localhost:5001';

function testEndpoint(path, description) {
  return new Promise((resolve) => {
    const url = `${BASE_URL}${path}`;
    console.log(`\nTesting: ${description}`);
    console.log(`URL: ${url}`);
    
    http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ SUCCESS (${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            console.log('Response preview:', JSON.stringify(json, null, 2).substring(0, 200) + '...');
          } catch (e) {
            console.log('Response:', data.substring(0, 100));
          }
          resolve(true);
        } else {
          console.log(`❌ FAILED (${res.statusCode})`);
          console.log('Response:', data);
          resolve(false);
        }
      });
    }).on('error', (err) => {
      console.log(`❌ ERROR: ${err.message}`);
      resolve(false);
    });
  });
}

async function runTests() {
  console.log('='.repeat(60));
  console.log('DermoScanner Server Test');
  console.log('='.repeat(60));
  
  const tests = [
    { path: '/api/health', description: 'Health Check Endpoint' },
    { path: '/api/ai/recommendations', description: 'AI Recommendations Endpoint' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    const result = await testEndpoint(test.path, test.description);
    if (result) {
      passed++;
    } else {
      failed++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Test Results');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Total: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 All tests passed! Server is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check:');
    console.log('   1. Is the server running? (npm start in dermoscanners/server)');
    console.log('   2. Is it running on port 5001?');
    console.log('   3. Check server console for errors');
  }
  
  console.log('='.repeat(60));
}

runTests();
