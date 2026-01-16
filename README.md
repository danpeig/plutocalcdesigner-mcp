# Plutocalc Designer MCP Server

This MCP server exposes the Plutocalc Designer REST API as MCP tools over stdio.

## About Plutocalc Designer

Plutocalc Designer is an online engineering tool for sizing water and wastewater treatment systems. Engineers select a design model, fill in a calculation template, and run the computation to receive a completed template with design results. Learn more at https://www.plutocalc.com/designer.

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

`server.json` contains the MCP registry manifest for this server.

## Configuration

- `PLUTOCALC_API_BASE_URL` (optional): override the default base URL (`https://www.plutocalc.com/designer/server`).

## Tools

- `server_version` - Fetch server version string.
- `server_status` - Fetch server status.
- `license_status` - Check license credits balance.
- `list_models` - List available models.
- `get_model` - Fetch model name/version.
- `get_model_information` - Fetch detailed model information.
- `get_model_template` - Fetch calculation template.
- `get_model_referencedb` - Fetch reference database entries.
- `get_model_unitslist` - Fetch supported units list.
- `compute_model` - Submit a filled template for calculation.

## Contact

Email: contact@plutocalc.com  
Website: https://www.plutocalc.com
