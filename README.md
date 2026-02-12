# Plutocalc Designer MCP Server

MCP server for the Plutocalc Designer REST API, providing access to water and wastewater treatment system design tools through the Model Context Protocol.

**Registry Name:** `io.github.danpeig/plutocalcdesigner-mcp`<BR>
**Version:** 2.5.1<BR>
**MCP server URL:** https://www.plutocalc.com/designer/mcp<BR>
**OpenAPI specs:** https://www.plutocalc.com/designer/server/openapi.json<BR>

## About Plutocalc Designer

Plutocalc Designer is an online engineering tool for sizing water and wastewater treatment systems. Engineers select a design model, fill in a calculation template, and run the computation to receive a completed template with design results. Learn more at https://www.plutocalc.com/designer.

---

## Using Plutocalc Designer from your AI platform

There are three ways of connecting Plutocalc Designer to AI applications:
- Connecting via the MCP server (recommended)
- Connecting directly to the API using OpenAPI specs (alternative)
- Hosting your own instance of the MCP server (for developers)

### Connecting via the MCP server (automatic)

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
   - "Get the template for the stripping tower"
   - "Help me design a biological treatment system"

### Connecting via the MCP server (manual)

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

**For other MCP clients:**
- **Server URL:** `https://www.plutocalc.com/designer/mcp`
- **Transport Type:** HTTP
- **Name:** plutocalcdesigner (or any name you prefer)

### Connecting directly to the API using the OpenAPI specifications

Another way to connect AI models to Plutocalc Designer is use the API directly. In this case, the model can retrieve instructions from the OpenAPI json specifications available at https://www.plutocalc.com/designer/server/openapi.json

A more detailed description of the API with instructions and examples, suitable for humans or LLMs, can be found in: https://www.plutocalc.com/designer/api.html

### Hosting the MCP server

This method hosts the MCP server only, not the Plutocalc Designer. The local server requires internet connectivity to connect to the Plutocalc Designer API. 

Use this method if you are facing connectivity issues with Plutocalc Designer MCP server or for development purposes.

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

If you need to check if the server is working, see [TEST_CLIENT_README.md](TEST_CLIENT_README.md) for detailed instructions.

## Available tools

1. **server_version** - Get Plutocalc Designer server version string
2. **server_status** - Get Plutocalc Designer server status
3. **license_status** - Check license credits balance (requires `licenseKey`)
4. **list_models** - List available calculation models
5. **list_models_info** - List available models with detailed information including manuals (recommended starting point)
6. **get_model** - Get model name and version (requires `model`)
7. **get_model_information** - Get detailed model information (requires `model`)
8. **get_model_template** - Get calculation input template (requires `model`)
9. **get_model_referencedb** - Get reference database entries (requires `model`)
10. **get_model_unitslist** - Get supported units list (requires `model`)
11. **compute_model** - Run model calculation (requires `model` and `input`)
12. **json_to_markdown** - Convert model JSON template to readable Markdown format (requires `model` and `input`)
13. **markdown_to_json** - Convert Markdown format back to JSON template (requires `model` and `input`)
14. **model_manual** - Get URL to the model help/manual page (requires `model`)
15. **license_help** - Get information about license key requirements

## Contact

- **Author**: Daniel BP
- **Email**: contact@plutocalc.com
- **Website**: https://www.plutocalc.com
- **Repository**: https://github.com/danpeig/plutocalcdesigner-mcp
- **MCP Registry**: https://registry.modelcontextprotocol.io (search for "plutocalcdesigner")
