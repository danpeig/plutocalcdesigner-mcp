# Test Client for Plutocalc Designer MCP

Comprehensive test client for testing all MCP server tools in local or remote mode.

## Usage

### Local Testing
Tests against a local instance running on port 3003:
```bash
npm run test:local
```

Or directly:
```bash
node test-client.js local
```

**Prerequisites**: Start the server first:
```bash
npm start
```

### Remote Testing
Tests against the production deployment:
```bash
npm run test:remote
```

Or directly:
```bash
node test-client.js remote
```

This connects to: `https://www.plutocalc.com/designer/mcp`

## What It Tests

### Basic Tools (3 tests)
- ✅ `server_version` - Get server version
- ✅ `server_status` - Get server status
- ✅ `license_help` - Get license information

### Model Discovery (2 tests)
- ✅ `list_models` - List all available models
- ✅ `list_models_info` - List models with detailed information and manual pages

### Model-Specific Tools (per model)
For the first 3 models, tests:
- ✅ `get_model` - Get model name and version
- ✅ `get_model_information` - Get detailed model information
- ✅ `model_manual` - Get model help page URL
- ✅ `get_model_template` - Get calculation template
- ✅ `json_to_markdown` - Convert JSON template to Markdown format
- ✅ `markdown_to_json` - Convert Markdown back to JSON format
- ✅ `get_model_referencedb` - Get reference database
- ✅ `get_model_unitslist` - Get supported units
- ✅ `compute_model` - Run calculation (tests endpoint, expects license error)

### License Tools (1 test)
- ✅ `license_status` - Check license status (tests with invalid key)

## Test Results

Total tests run: **32** (with 3 models)

### Expected Behavior
- Most tests should pass ✅
- `compute_model` will show a note about requiring a license (this is expected)
- `license_status` with invalid key will show rejection (this is expected)

### Example Output
```
======================================================================
  MCP SERVER TEST CLIENT - LOCAL MODE
  Base URL: http://localhost:3003/designer/mcp
======================================================================

Checking server accessibility...
✅ Server is accessible (version: 2.0.0)

Testing Basic Tools:
----------------------------------------------------------------------
  server_version... ✅ PASS
  server_status... ✅ PASS
  license_help... ✅ PASS

Testing Model Discovery:
----------------------------------------------------------------------
  list_models...     Found 7 models
✅ PASS
  list_models_info...     Found 7 models with full info
✅ PASS

Testing Model-Specific Tools (3 models):
----------------------------------------------------------------------

  Model: cmasbod
    get_model(cmasbod)... ✅ PASS
    get_model_information(cmasbod)... ✅ PASS
    model_manual(cmasbod)... ✅ PASS
    get_model_template(cmasbod)... ✅ PASS
    json_to_markdown(cmasbod)... ✅ PASS
    markdown_to_json(cmasbod)... ✅ PASS
    get_model_referencedb(cmasbod)... ✅ PASS
    get_model_unitslist(cmasbod)... ✅ PASS
    compute_model(cmasbod)...
      Note: Compute requires valid license (expected)
✅ PASS

======================================================================
  TEST SUMMARY
======================================================================
  ✅ Passed: 32
  ❌ Failed: 0
  Total:  32
======================================================================

🎉 All tests passed!
```

## Features

- **Automatic server detection**: Checks if server is accessible before running tests
- **Clear output**: Color-coded pass/fail indicators
- **Comprehensive coverage**: Tests all 15 tools
- **Smart error handling**: Distinguishes expected errors (license) from real failures
- **Model iteration**: Automatically discovers and tests multiple models
- **Template-based compute testing**: Fetches template before testing compute
- **Conversion tool testing**: Tests JSON to Markdown and Markdown to JSON round-trip conversion

## Use Cases

### Development
```bash
# Start server
npm start

# In another terminal, run tests
npm run test:local
```

### CI/CD
```bash
# Test against staging/production
npm run test:remote
```

### Debugging
Run tests to verify all endpoints are working after:
- Code changes
- Deployment
- Configuration updates
- Server restart

## Exit Codes

- `0` - All tests passed
- `1` - One or more tests failed or server unreachable

## Notes

- Tests first 3 models only (to keep runtime reasonable)
- Compute tests expect license errors - this is normal behavior
- Remote tests require the production server to be accessible
- Local tests require a server running on port 3003
