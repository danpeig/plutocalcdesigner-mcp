#!/usr/bin/env node
import * as z from 'zod/v4';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const API_BASE_URL = process.env.PLUTOCALC_API_BASE_URL?.replace(/\/$/, '') ?? 'https://www.plutocalc.com/designer/server';

const createServer = () => {
  const server = new McpServer({
    name: 'plutocalcdesigner',
    version: '1.2.0'
  });

  server.registerTool(
    'server_version',
    {
      description: 'Get Plutocalc Designer server version string.'
    },
    async () => {
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) {
        throw new Error(`Server version request failed (${response.status})`);
      }
      const text = await response.text();
      return {
        content: [{ type: 'text', text }]
      };
    }
  );

  server.registerTool(
    'server_status',
    {
      description: 'Get Plutocalc Designer server status string.'
    },
    async () => {
      const response = await fetch(`${API_BASE_URL}/status`);
      if (!response.ok) {
        throw new Error(`Status request failed (${response.status})`);
      }
      const text = await response.text();
      return {
        content: [{ type: 'text', text }]
      };
    }
  );

  server.registerTool(
    'license_status',
    {
      description: 'Check license credits balance.',
      inputSchema: {
        licenseKey: z.string().describe('License key to check')
      }
    },
    async ({ licenseKey }) => {
      const response = await fetch(`${API_BASE_URL}/license/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ license_key: licenseKey })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`License status request failed (${response.status}): ${errorText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'list_models',
    {
      description: 'List available Plutocalc Designer models.'
    },
    async () => {
      const response = await fetch(`${API_BASE_URL}/listmodels`);
      if (!response.ok) {
        throw new Error(`List models request failed (${response.status})`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'get_model',
    {
      description: 'Get model name and version string.',
      inputSchema: {
        model: z.string().describe('Model identifier, e.g. mbrbodnh4')
      }
    },
    async ({ model }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}`);
      if (!response.ok) {
        throw new Error(`Get model request failed (${response.status})`);
      }
      const text = await response.text();
      return {
        content: [{ type: 'text', text }]
      };
    }
  );

  server.registerTool(
    'get_model_information',
    {
      description: 'Get detailed model information.',
      inputSchema: {
        model: z.string().describe('Model identifier')
      }
    },
    async ({ model }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/information`);
      if (!response.ok) {
        throw new Error(`Model information request failed (${response.status})`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'get_model_template',
    {
      description: 'Get model calculation input template.',
      inputSchema: {
        model: z.string().describe('Model identifier')
      }
    },
    async ({ model }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/template`);
      if (!response.ok) {
        throw new Error(`Model template request failed (${response.status})`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'get_model_referencedb',
    {
      description: 'Get model reference database entries.',
      inputSchema: {
        model: z.string().describe('Model identifier')
      }
    },
    async ({ model }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/referencedb`);
      if (!response.ok) {
        throw new Error(`Model referencedb request failed (${response.status})`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'get_model_unitslist',
    {
      description: 'Get model supported units list.',
      inputSchema: {
        model: z.string().describe('Model identifier')
      }
    },
    async ({ model }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/unitslist`);
      if (!response.ok) {
        throw new Error(`Model unitslist request failed (${response.status})`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  server.registerTool(
    'compute_model',
    {
      description: 'Run a model calculation with a filled input template.',
      inputSchema: {
        model: z.string().describe('Model identifier'),
        input: z.record(z.any()).describe('Filled template JSON to send to compute')
      }
    },
    async ({ model, input }) => {
      const response = await fetch(`${API_BASE_URL}/${encodeURIComponent(model)}/compute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Compute request failed (${response.status}): ${errorText}`);
      }
      const data = await response.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
        structuredContent: data
      };
    }
  );

  return server;
};

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Plutocalc Designer MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
