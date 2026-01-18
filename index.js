#!/usr/bin/env node
/* --------------------------------------------------------------------------- */
/* Plutocalc Designer MCP Server
/* By Daniel BP
/* Version 2.0.0
/* --------------------------------------------------------------------------- */

//Load modules
const express = require('express');
const cors = require('cors');
const app = express();

//Server configuration
const APP_VERSION = '2.0.0';
const API_BASE_URL = process.env.PLUTOCALC_API_BASE_URL?.replace(/\/$/, '') ?? 'https://www.plutocalc.com/designer/server';
const PORT = process.env.PORT || 3003;
const BASE_PATH = process.env.BASE_PATH || '/designer/mcp';
const APP_NAME = "Plutocalc Designer MCP Server";

//Tools metadata
const tools = [
  {
    name: 'server_version',
    description: 'Get Plutocalc Designer server version string.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'server_status',
    description: 'Get Plutocalc Designer server status string.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'license_status',
    description: 'Check license credits balance.',
    inputSchema: {
      type: 'object',
      properties: {
        licenseKey: { type: 'string', description: 'License key to check' }
      },
      required: ['licenseKey']
    }
  },
  {
    name: 'list_models',
    description: 'List available Plutocalc Designer models.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  },
  {
    name: 'get_model',
    description: 'Get model name and version string.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier, e.g. mbrbodnh4' }
      },
      required: ['model']
    }
  },
  {
    name: 'get_model_information',
    description: 'Get detailed model information.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' }
      },
      required: ['model']
    }
  },
  {
    name: 'get_model_template',
    description: 'Get model calculation input template.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' }
      },
      required: ['model']
    }
  },
  {
    name: 'get_model_referencedb',
    description: 'Get model reference database entries.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' }
      },
      required: ['model']
    }
  },
  {
    name: 'get_model_unitslist',
    description: 'Get model supported units list.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' }
      },
      required: ['model']
    }
  },
  {
    name: 'compute_model',
    description: 'Run a model calculation with a filled input template.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' },
        input: { type: 'object', description: 'Filled template JSON to send to compute' }
      },
      required: ['model', 'input']
    }
  },
  {
    name: 'model_manual',
    description: 'Get the URL to the model help/manual page.',
    inputSchema: {
      type: 'object',
      properties: {
        model: { type: 'string', description: 'Model identifier' }
      },
      required: ['model']
    }
  },
  {
    name: 'license_help',
    description: 'Get information about license key requirements.',
    inputSchema: { type: 'object', properties: {}, required: [] }
  }
];

//Tool handlers
const toolHandlers = {
  async server_version() {
    const response = await fetch(`${API_BASE_URL}/`);
    if (!response.ok) {
      throw new Error(`Server version request failed (${response.status})`);
    }
    const text = await response.text();
    return { content: [{ type: 'text', text }] };
  },

  async server_status() {
    const response = await fetch(`${API_BASE_URL}/status`);
    if (!response.ok) {
      throw new Error(`Status request failed (${response.status})`);
    }
    const text = await response.text();
    return { content: [{ type: 'text', text }] };
  },

  async license_status({ licenseKey }) {
    const body = { license_key: licenseKey, client: 'MCP' };
    const response = await fetch(`${API_BASE_URL}/license/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`License status request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async list_models() {
    const response = await fetch(`${API_BASE_URL}/listmodels`);
    if (!response.ok) {
      throw new Error(`List models request failed (${response.status})`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async get_model({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}`);
    if (!response.ok) {
      throw new Error(`Get model request failed (${response.status})`);
    }
    const text = await response.text();
    return { content: [{ type: 'text', text }] };
  },

  async get_model_information({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/information`);
    if (!response.ok) {
      throw new Error(`Model information request failed (${response.status})`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async get_model_template({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/template`);
    if (!response.ok) {
      throw new Error(`Model template request failed (${response.status})`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async get_model_referencedb({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/referencedb`);
    if (!response.ok) {
      throw new Error(`Model referencedb request failed (${response.status})`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async get_model_unitslist({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/unitslist`);
    if (!response.ok) {
      throw new Error(`Model unitslist request failed (${response.status})`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async compute_model({ model, input }) {
    const body = { ...input, client: 'MCP' };
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/compute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Compute request failed (${response.status}): ${errorText}`);
    }
    const data = await response.json();
    return {
      content: [{ type: 'text', text: JSON.stringify(data, null, 2) }]
    };
  },

  async model_manual({ model }) {
    const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/information`);
    if (!response.ok) {
      throw new Error(`Model information request failed (${response.status})`);
    }
    const data = await response.json();
    if (data.manualPage) {
      return {
        content: [{ type: 'text', text: `Model manual page: ${data.manualPage}` }]
      };
    } else {
      return {
        content: [{ type: 'text', text: 'No manual page available for this model.' }]
      };
    }
  },

  async license_help() {
    const helpText = `License Key Information:

Some calculation models require a license key to be included in the template submission. When a model requires a license key, the template will explicitly include a "license_key" field that must be filled.

If the model template does not explicitly require a license key field, then no license is needed to perform calculations with that model.

To purchase a license key or learn more about licensing options, please visit:
https://www.plutocalc.com/designer

For questions about licensing, contact: contact@plutocalc.com`;
    
    return {
      content: [{ type: 'text', text: helpText }]
    };
  }
};

//-------------------------------------------------------------------------------------------------------
//Express middleware

app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  req.url = req.url.replace(BASE_PATH, "");
  next();
});

//-------------------------------------------------------------------------------------------------------
//Express routes

//Default ROOT route
app.get('/', function(req, res) {
  res.send(`${APP_NAME} v${APP_VERSION}`);
});

app.get('/health', function(req, res) {
  res.json({ 
    status: 'ok', 
    service: 'plutocalcdesigner-mcp',
    version: APP_VERSION,
    apiBaseUrl: API_BASE_URL
  });
});

app.get('/info', function(req, res) {
  res.json({
    name: 'plutocalcdesigner',
    version: APP_VERSION,
    description: 'MCP web service for the Plutocalc Designer REST API',
    tools: tools
  });
});

app.get('/tools', function(req, res) {
  res.json({ tools });
});

app.post('/tools/:toolName', async function(req, res) {
  const toolName = req.params.toolName;
  const args = req.body;

  //console.log(`Calling tool: ${toolName} with args:`, JSON.stringify(args, null, 2));

  if (!toolHandlers[toolName]) {
    return res.status(404).json({
      error: 'Tool not found',
      availableTools: tools.map(t => t.name)
    });
  }

  try {
    const result = await toolHandlers[toolName](args);
    res.json(result);
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error.message);
    res.status(500).json({
      error: error.message,
      tool: toolName
    });
  }
});

//-------------------------------------------------------------------------------------------------------
//Express error handling and initialization

app.use(function (err, req, res, next) {
  console.error("Error: " + err);
  res.status(500).send('Internal server error. See log...');
});

//Start the app (only if run directly, not when required by Passenger)
let server = app.listen(PORT, () => {
    console.log(`${APP_NAME} v${APP_VERSION}`);
    console.log(`Server running on port ${PORT}`);
    console.log(`Health: http://localhost:${PORT}${BASE_PATH}/health`);
    console.log(`Info: http://localhost:${PORT}${BASE_PATH}/info`);
    console.log(`Tools: http://localhost:${PORT}${BASE_PATH}/tools`);
    console.log(`Call tool: POST http://localhost:${PORT}${BASE_PATH}/tools/:toolName`);
    console.log(`Base API URL: ${API_BASE_URL}`);
  });

//Export for Passenger and testing
module.exports = { app, server };
