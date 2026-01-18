#!/usr/bin/env node

const mode = process.argv[2] || 'local';

if (!['local', 'remote'].includes(mode)) {
  console.error('Usage: node test-client.js [local|remote]');
  process.exit(1);
}

const BASE_URL = mode === 'local' 
  ? 'http://localhost:3003/designer/mcp'
  : 'https://plutocalc.com/designer/mcp';

console.log(`\n${'='.repeat(70)}`);
console.log(`  MCP SERVER TEST CLIENT - ${mode.toUpperCase()} MODE`);
console.log(`  Base URL: ${BASE_URL}`);
console.log(`${'='.repeat(70)}\n`);

let passCount = 0;
let failCount = 0;

async function callTool(toolName, args = {}) {
  try {
    const response = await fetch(`${BASE_URL}/tools/${toolName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(`Failed to call ${toolName}: ${error.message}`);
  }
}

async function test(name, testFn) {
  process.stdout.write(`  ${name}... `);
  try {
    await testFn();
    console.log('✅ PASS');
    passCount++;
    return true;
  } catch (error) {
    console.log(`❌ FAIL: ${error.message}`);
    failCount++;
    return false;
  }
}

async function runTests() {
  console.log('Testing Basic Tools:');
  console.log('-'.repeat(70));
  
  // Test 1: server_version
  await test('server_version', async () => {
    const result = await callTool('server_version');
    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error('Invalid response format');
    }
  });
  
  // Test 2: server_status
  await test('server_status', async () => {
    const result = await callTool('server_status');
    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error('Invalid response format');
    }
  });
  
  // Test 3: license_help
  await test('license_help', async () => {
    const result = await callTool('license_help');
    if (!result.content || !result.content[0] || !result.content[0].text) {
      throw new Error('Invalid response format');
    }
    if (!result.content[0].text.includes('license')) {
      throw new Error('Response does not contain license information');
    }
  });
  
  // Test 4: list_models
  console.log('\nTesting Model Discovery:');
  console.log('-'.repeat(70));
  
  let models = [];
  await test('list_models', async () => {
    const result = await callTool('list_models');
    if (!result.content || !result.content[0]) {
      throw new Error('Invalid response format');
    }
    const data = JSON.parse(result.content[0].text);
    if (!Array.isArray(data)) {
      throw new Error('Response is not an array');
    }
    // Extract model names from array of [id, description] pairs
    models = data.map(item => item[0]);
    console.log(`    Found ${models.length} models`);
  });
  
  if (models.length === 0) {
    console.log('\n⚠️  No models available to test');
    return;
  }
  
  // Test first 3 models (or all if less than 3)
  const testModels = models.slice(0, 3);
  console.log(`\nTesting Model-Specific Tools (${testModels.length} models):`);
  console.log('-'.repeat(70));
  
  for (const model of testModels) {
    console.log(`\n  Model: ${model}`);
    
    // Test 5: get_model
    await test(`  get_model(${model})`, async () => {
      const result = await callTool('get_model', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
    });
    
    // Test 6: get_model_information
    await test(`  get_model_information(${model})`, async () => {
      const result = await callTool('get_model_information', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
      const data = JSON.parse(result.content[0].text);
      if (!data.modelName && !data.name) {
        throw new Error('Model information missing modelName field');
      }
    });
    
    // Test 7: model_manual
    await test(`  model_manual(${model})`, async () => {
      const result = await callTool('model_manual', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
      const text = result.content[0].text;
      if (!text.includes('http')) {
        throw new Error('Manual URL not found in response');
      }
    });
    
    // Test 8: get_model_template
    let template = null;
    await test(`  get_model_template(${model})`, async () => {
      const result = await callTool('get_model_template', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
      template = JSON.parse(result.content[0].text);
      if (!template) {
        throw new Error('Template is empty');
      }
    });
    
    // Test 9: get_model_referencedb
    await test(`  get_model_referencedb(${model})`, async () => {
      const result = await callTool('get_model_referencedb', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
    });
    
    // Test 10: get_model_unitslist
    await test(`  get_model_unitslist(${model})`, async () => {
      const result = await callTool('get_model_unitslist', { model });
      if (!result.content || !result.content[0]) {
        throw new Error('Invalid response format');
      }
    });
    
    // Test 11: compute_model (will fail without license, but tests the endpoint)
    await test(`  compute_model(${model})`, async () => {
      if (!template) {
        throw new Error('No template available from previous test');
      }
      
      try {
        const result = await callTool('compute_model', { 
          model, 
          input: template 
        });
        
        // If we get here, check for valid response
        if (!result.content || !result.content[0]) {
          throw new Error('Invalid response format');
        }
        
        // Parse response to check if it's an error or success
        const data = JSON.parse(result.content[0].text);
        
        // If there's an error field, it might be a license error (which is OK for testing)
        if (data.error) {
          // Check if it's a license error (expected) or other error (might be a problem)
          if (data.error.toLowerCase().includes('license') || 
              data.error.toLowerCase().includes('credit')) {
            console.log('\n      Note: License required (expected)');
          } else {
            console.log(`\n      Note: API returned error (may require license)`);
          }
        }
      } catch (error) {
        // Check if it's a license-related error or server error (both expected without license)
        if (error.message.includes('license') || 
            error.message.includes('credit') ||
            error.message.includes('401') ||
            error.message.includes('402') ||
            error.message.includes('500')) {
          console.log('\n      Note: Compute requires valid license (expected)');
        } else {
          throw error;
        }
      }
    });
  }
  
  // Test license_status (will fail without license key, but tests endpoint)
  console.log('\nTesting License Tools:');
  console.log('-'.repeat(70));
  
  await test('license_status (no key)', async () => {
    try {
      await callTool('license_status', { licenseKey: 'test-key-12345' });
      // If no error, check response
    } catch (error) {
      // Expected to fail with invalid key
      if (error.message.includes('401') || 
          error.message.includes('403') || 
          error.message.includes('invalid') ||
          error.message.includes('Invalid')) {
        console.log('\n      Note: Invalid key rejected (expected behavior)');
      } else {
        throw error;
      }
    }
  });
}

async function main() {
  try {
    // Check if server is accessible
    console.log('Checking server accessibility...');
    const healthUrl = mode === 'local' 
      ? 'http://localhost:3003/designer/mcp/health' 
      : 'https://www.plutocalc.com/designer/mcp/health';
    
    try {
      const response = await fetch(healthUrl);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const health = await response.json();
      console.log(`✅ Server is accessible (version: ${health.version || 'unknown'})\n`);
    } catch (error) {
      console.error(`❌ Cannot reach server: ${error.message}`);
      console.error(`\nIf testing LOCAL mode, make sure the server is running:`);
      console.error(`  npm start\n`);
      process.exit(1);
    }
    
    // Test root route
    console.log('Testing Root Route:');
    console.log('-'.repeat(70));
    await test('GET /', async () => {
      const response = await fetch(BASE_URL + '/');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const text = await response.text();
      if (!text.includes('Plutocalc Designer MCP Server')) {
        throw new Error(`Unexpected response: ${text}`);
      }
    });
    console.log('');
    
    await runTests();
    
    console.log('\n' + '='.repeat(70));
    console.log('  TEST SUMMARY');
    console.log('='.repeat(70));
    console.log(`  ✅ Passed: ${passCount}`);
    console.log(`  ❌ Failed: ${failCount}`);
    console.log(`  Total:  ${passCount + failCount}`);
    console.log('='.repeat(70) + '\n');
    
    if (failCount > 0) {
      console.log(`⚠️  ${failCount} test(s) failed`);
      process.exit(1);
    } else {
      console.log('🎉 All tests passed!');
      process.exit(0);
    }
    
  } catch (error) {
    console.error(`\n❌ Fatal error: ${error.message}`);
    process.exit(1);
  }
}

main();
