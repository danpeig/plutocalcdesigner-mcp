# Plutocalc Designer MCP Server

MCP server for the Plutocalc Designer REST API, providing access to water and wastewater treatment system design tools through the Model Context Protocol.

**Registry Name:** `io.github.danpeig/plutocalcdesigner-mcp`  
**Version:** 2.1.0  
**Server URL:** https://www.plutocalc.com/designer/mcp

## About Plutocalc Designer

Plutocalc Designer is an online engineering tool for sizing water and wastewater treatment systems. Engineers select a design model, fill in a calculation template, and run the computation to receive a completed template with design results. Learn more at https://www.plutocalc.com/designer.

---

## For End Users: Using Plutocalc Designer in Your AI Application

### Quick Start

The easiest way to use Plutocalc Designer with your AI assistant is through the **MCP Registry**:

1. **In Claude Desktop or your MCP-compatible client**, search for:
   ```
   plutocalcdesigner-mcp
   ```
   or
   ```
   io.github.danpeig/plutocalcdesigner-mcp
   ```

2. **Click "Add" or "Install"** - The server will be automatically configured.

3. **Start using it!** Ask your AI assistant:
   - "List available wastewater treatment models"
   - "Get the template for the     stripping tower"
   - "Help me design a biological treatment system"

### Manual Configuration

If you need to configure manually, add this to your MCP client configuration:

**For Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "plutocalcdesigner": {
      "url": "https://www.plutocalc.com/designer/mcp",
      "transport": "http"
    }
  }
}
```

### Alternative: OpenAPI specifications

Another way to connect AI models to Plutocalc Designer is use the API directly. In this case, the model can retrieve instructions directly from the OpenAPI json specifications available at https://www.plutocalc.com/designer/server/openapi.json

**For other MCP clients:**
- **Server URL:** `https://www.plutocalc.com/designer/mcp`
- **Transport Type:** HTTP
- **Name:** plutocalcdesigner (or any name you prefer)

### Models

The server provides access to, at least, these water and wastewater treatment system design models:
- **cmasbod** - Complete Mix Activated Sludge for BOD removal
- **cmasbodnh4** - Complete Mix Activated Sludge (CMAS) for BOD and NH4 removal
- **cmasbodno3** - Complete Mix Activated Sludge for BOD and NO3 removal
- **mbrbodnh4** - Membrane Bioreactor (MBR) for BOD and NH4 removal
- **mbrbodno3** - MBR for BOD and NO3 removal
- **stripping** - Gas and VOC stripping tower
- **rocip** - Reverse Osmosis CIP system (Clean-in-place)

### What You Can Do

Once configured, ask your AI assistant to:
- **List models**: "What treatment models are available?"
- **Get information**: "Tell me about the CMAS BOD removal mode."
- **Get templates**: "Show me the input template for MBR design"
- **Check license requirements**: "Do I need a license to use these models?"
- **Access documentation**: "Open the manual page for the stripping model"

---

## For Developers: Installation & Testing

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/danpeig/plutocalcdesigner-mcp.git
cd plutocalcdesigner-mcp

# Install dependencies
npm install

# Start the server
npm start
```

The server will start on port 3003 by default (configurable via `PORT` environment variable).

### Testing

### Run Syntax Check
```bash
npm test
```

### Test All Endpoints (Local)
Start the server first, then in another terminal:
```bash
npm run test:local
```

### Test All Endpoints (Remote)
Test against the production deployment:
```bash
npm run test:remote
```

See [TEST_CLIENT_README.md](TEST_CLIENT_README.md) for detailed test information.

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3003)
- `BASE_PATH` - Base URL path (default: `/designer/mcp`)
- `PLUTOCALC_API_BASE_URL` - Override the Plutocalc Designer API base URL (default: `https://www.plutocalc.com/designer/server`)

## API Endpoints

### Health Check
```
GET /health
```
Returns server health status and information.

### Server Info
```
GET /designer/mcp/info
```
Returns MCP server information including name, version, and available tools.

### List Tools
```
GET /designer/mcp/tools
```
Returns a list of all available MCP tools with their descriptions and input schemas.

### Call Tool
```
POST /designer/mcp/tools/:toolName
Content-Type: application/json

{
  // Tool-specific arguments
}
```
Executes a specific tool and returns the result.

## Available Tools

1. **server_version** - Get Plutocalc Designer server version string
2. **server_status** - Get Plutocalc Designer server status
3. **license_status** - Check license credits balance (requires `licenseKey`)
4. **list_models** - List available calculation models
5. **get_model** - Get model name and version (requires `model`)
6. **get_model_information** - Get detailed model information (requires `model`)
7. **get_model_template** - Get calculation input template (requires `model`)
8. **get_model_referencedb** - Get reference database entries (requires `model`)
9. **get_model_unitslist** - Get supported units list (requires `model`)
10. **compute_model** - Run model calculation (requires `model` and `input`)
11. **model_manual** - Get URL to the model help/manual page (requires `model`)
12. **license_help** - Get information about license key requirements

## Example Usage

### List Models
```bash
curl -X POST http://localhost:3003/designer/mcp/tools/list_models \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Get Model Template
```bash
curl -X POST http://localhost:3003/designer/mcp/tools/get_model_template \
  -H "Content-Type: application/json" \
  -d '{"model": "cmasbod"}'
```

### Get Model Manual
```bash
curl -X POST http://localhost:3003/designer/mcp/tools/model_manual \
  -H "Content-Type: application/json" \
  -d '{"model": "cmasbod"}'
```

### Get License Help
```bash
curl -X POST http://localhost:3003/designer/mcp/tools/license_help \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Run Calculation
```bash
curl -X POST http://localhost:3003/designer/mcp/tools/compute_model \
  -H "Content-Type: application/json" \
  -d '{
    "model": "cmasbod",
    "input": {
      "license_key": "your-license-key",
      "parameters": {
        // ... calculation parameters
      }
    }
  }'
```

## Response Format

All tool responses follow the MCP content format:
```json
{
  "content": [
    {
      "type": "text",
      "text": "Response content as text or JSON string"
    }
  ]
}
```

## Features

- **CORS Enabled**: Allows cross-origin requests from web applications
- **MCP Client Identification**: All POST requests to the Plutocalc API automatically include `"client": "MCP"` in the request body
- **RESTful HTTP Interface**: Standard HTTP/JSON interface for easy integration

## Production Deployment

For production deployment on https://www.plutocalc.com:

1. Set the `PORT` environment variable to the desired port
2. Configure reverse proxy (nginx/Apache) to route `/designer/mcp` to this service
3. Use a process manager like PM2 to keep the service running:
   ```bash
   pm2 start index.js --name plutocalc-mcp
   ```

## Architecture

The web service acts as a bridge between HTTP clients and the Plutocalc Designer REST API:

```
Client → HTTP Request → MCP Web Server → Plutocalc Designer API
                                      ← JSON Response ←
```

Each tool call:
1. Receives HTTP POST with tool arguments
2. Transforms arguments to Plutocalc API format
3. Injects `"client": "MCP"` for tracking
4. Makes request to Plutocalc Designer API
5. Returns response in MCP format

## MCP Registry

This server is published in the **official MCP Registry**:

- **Registry Name:** `io.github.danpeig/plutocalcdesigner-mcp`
- **Version:** 2.1.0
- **Browse:** https://registry.modelcontextprotocol.io

### For Publishers: Updating the Registry

This package is published manually using `mcp-publisher` with GitHub authentication.

**Steps to Publish Updates:**

1. **Install mcp-publisher** (if not already installed):
   ```bash
   npm install -g @modelcontextprotocol/mcp-publisher
   ```

2. **Update version** in both `package.json` and `server.json`

3. **Authenticate with GitHub**:
   ```bash
   mcp-publisher login github
   ```
   Follow the browser prompts to authorize.

4. **Publish to MCP Registry**:
   ```bash
   mcp-publisher publish
   ```

The `server.json` file contains the registry configuration.

## Contact

- **Author**: Daniel BP
- **Email**: contact@plutocalc.com
- **Website**: https://www.plutocalc.com
- **Repository**: https://github.com/danpeig/plutocalcdesigner-mcp
- **MCP Registry**: https://registry.modelcontextprotocol.io (search for "plutocalcdesigner")
