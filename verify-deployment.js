#!/usr/bin/env node

/**
 * Deployment Verification Script
 * 
 * This script verifies that the deployed DermoScanner application is working correctly.
 * Run this after deployment to ensure all services are operational.
 * 
 * Usage:
 *   node verify-deployment.js <backend-url> <frontend-url>
 * 
 * Example:
 *   node verify-deployment.js https://dermoscanner-api.onrender.com https://dermoscanner-client.onrender.com
 */

import https from 'https';
import http from 'http';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: []
};

/**
 * Make HTTP/HTTPS request
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const startTime = Date.now();
    
    const req = protocol.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data,
          duration
        });
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

/**
 * Log test result
 */
function logTest(name, passed, message = '', duration = null) {
  const status = passed ? `${colors.green}✓ PASS${colors.reset}` : `${colors.red}✗ FAIL${colors.reset}`;
  const durationStr = duration ? ` (${duration}ms)` : '';
  console.log(`  ${status} ${name}${durationStr}`);
  
  if (message) {
    const color = passed ? colors.cyan : colors.red;
    console.log(`    ${color}${message}${colors.reset}`);
  }
  
  results.tests.push({ name, passed, message, duration });
  if (passed) {
    results.passed++;
  } else {
    results.failed++;
  }
}

/**
 * Log warning
 */
function logWarning(message) {
  console.log(`  ${colors.yellow}⚠ WARNING${colors.reset} ${message}`);
  results.warnings++;
}

/**
 * Test backend health endpoint
 */
async function testBackendHealth(backendUrl) {
  console.log(`\n${colors.blue}Testing Backend API...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${backendUrl}/api/health`);
    
    // Test 1: Health endpoint returns 200
    const healthOk = response.statusCode === 200;
    logTest(
      'Health endpoint accessible',
      healthOk,
      healthOk ? 'Endpoint returned 200 OK' : `Returned status ${response.statusCode}`,
      response.duration
    );
    
    // Test 2: Health endpoint returns correct JSON
    try {
      const data = JSON.parse(response.body);
      const correctFormat = data.status === 'ok';
      logTest(
        'Health endpoint returns correct format',
        correctFormat,
        correctFormat ? 'Response: {"status":"ok"}' : `Response: ${response.body}`
      );
    } catch (e) {
      logTest('Health endpoint returns valid JSON', false, 'Response is not valid JSON');
    }
    
    // Test 3: HTTPS enforced
    const isHttps = backendUrl.startsWith('https://');
    logTest(
      'HTTPS enforced',
      isHttps,
      isHttps ? 'Using secure HTTPS connection' : 'WARNING: Using insecure HTTP'
    );
    
    // Test 4: Response time
    const fastResponse = response.duration < 2000;
    if (!fastResponse) {
      logWarning(`Slow response time: ${response.duration}ms (expected < 2000ms)`);
    } else {
      logTest('Response time acceptable', true, `${response.duration}ms < 2000ms`);
    }
    
    // Test 5: Security headers
    const hasSecurityHeaders = response.headers['x-frame-options'] || response.headers['x-content-type-options'];
    if (hasSecurityHeaders) {
      logTest('Security headers present', true, 'Found security headers');
    } else {
      logWarning('No security headers detected (helmet may not be configured)');
    }
    
  } catch (error) {
    logTest('Backend API accessible', false, error.message);
    console.log(`\n${colors.red}Backend API is not accessible. Skipping remaining backend tests.${colors.reset}`);
    return false;
  }
  
  return true;
}

/**
 * Test frontend
 */
async function testFrontend(frontendUrl) {
  console.log(`\n${colors.blue}Testing Frontend...${colors.reset}`);
  
  try {
    const response = await makeRequest(frontendUrl);
    
    // Test 1: Frontend accessible
    const accessible = response.statusCode === 200;
    logTest(
      'Frontend accessible',
      accessible,
      accessible ? 'Homepage loaded successfully' : `Returned status ${response.statusCode}`,
      response.duration
    );
    
    // Test 2: HTTPS enforced
    const isHttps = frontendUrl.startsWith('https://');
    logTest(
      'HTTPS enforced',
      isHttps,
      isHttps ? 'Using secure HTTPS connection' : 'WARNING: Using insecure HTTP'
    );
    
    // Test 3: HTML content
    const isHtml = response.body.includes('<!DOCTYPE html>') || response.body.includes('<html');
    logTest(
      'Returns HTML content',
      isHtml,
      isHtml ? 'Valid HTML document' : 'Response does not appear to be HTML'
    );
    
    // Test 4: Response time
    const fastResponse = response.duration < 3000;
    if (!fastResponse) {
      logWarning(`Slow response time: ${response.duration}ms (expected < 3000ms)`);
    } else {
      logTest('Response time acceptable', true, `${response.duration}ms < 3000ms`);
    }
    
    // Test 5: Check for common assets
    const hasAssets = response.body.includes('.js') || response.body.includes('.css');
    if (hasAssets) {
      logTest('Assets referenced', true, 'Found JS/CSS references');
    } else {
      logWarning('No JS/CSS assets found in HTML');
    }
    
  } catch (error) {
    logTest('Frontend accessible', false, error.message);
    console.log(`\n${colors.red}Frontend is not accessible. Skipping remaining frontend tests.${colors.reset}`);
    return false;
  }
  
  return true;
}

/**
 * Test CORS configuration
 */
async function testCORS(backendUrl, frontendUrl) {
  console.log(`\n${colors.blue}Testing CORS Configuration...${colors.reset}`);
  
  try {
    const response = await makeRequest(`${backendUrl}/api/health`, {
      headers: {
        'Origin': frontendUrl,
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    // Test 1: CORS headers present
    const hasCorsHeaders = response.headers['access-control-allow-origin'];
    logTest(
      'CORS headers present',
      hasCorsHeaders !== undefined,
      hasCorsHeaders ? `Origin: ${response.headers['access-control-allow-origin']}` : 'No CORS headers found'
    );
    
    // Test 2: Correct origin allowed
    if (hasCorsHeaders) {
      const correctOrigin = response.headers['access-control-allow-origin'] === frontendUrl || 
                           response.headers['access-control-allow-origin'] === '*';
      logTest(
        'Frontend origin allowed',
        correctOrigin,
        correctOrigin ? 'Frontend URL is allowed' : `Expected ${frontendUrl}, got ${response.headers['access-control-allow-origin']}`
      );
    }
    
    // Test 3: Credentials allowed
    const credentialsAllowed = response.headers['access-control-allow-credentials'] === 'true';
    if (credentialsAllowed) {
      logTest('Credentials allowed', true, 'CORS allows credentials');
    } else {
      logWarning('Credentials not allowed in CORS (may cause authentication issues)');
    }
    
  } catch (error) {
    logTest('CORS configuration', false, error.message);
  }
}

/**
 * Print summary
 */
function printSummary() {
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}                    TEST SUMMARY${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  
  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
  
  console.log(`\nTotal Tests: ${total}`);
  console.log(`${colors.green}Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${results.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${results.warnings}${colors.reset}`);
  console.log(`\nPass Rate: ${passRate}%`);
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log(`\n${colors.green}✓ All tests passed! Deployment is successful.${colors.reset}`);
  } else if (results.failed === 0) {
    console.log(`\n${colors.yellow}⚠ All tests passed with warnings. Review warnings above.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}✗ Some tests failed. Please review and fix issues above.${colors.reset}`);
  }
  
  console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`${colors.red}Error: Missing required arguments${colors.reset}\n`);
    console.log('Usage: node verify-deployment.js <backend-url> <frontend-url>\n');
    console.log('Example:');
    console.log('  node verify-deployment.js https://dermoscanner-api.onrender.com https://dermoscanner-client.onrender.com\n');
    process.exit(1);
  }
  
  const backendUrl = args[0].replace(/\/$/, ''); // Remove trailing slash
  const frontendUrl = args[1].replace(/\/$/, '');
  
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}        DermoScanner Deployment Verification${colors.reset}`);
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
  console.log(`\nBackend URL:  ${backendUrl}`);
  console.log(`Frontend URL: ${frontendUrl}`);
  
  // Run tests
  const backendOk = await testBackendHealth(backendUrl);
  const frontendOk = await testFrontend(frontendUrl);
  
  if (backendOk && frontendOk) {
    await testCORS(backendUrl, frontendUrl);
  }
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  process.exit(results.failed > 0 ? 1 : 0);
}

// Run main function
main().catch((error) => {
  console.error(`${colors.red}Unexpected error:${colors.reset}`, error);
  process.exit(1);
});
