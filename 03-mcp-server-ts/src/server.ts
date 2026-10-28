import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/** An MCP server exposing a CRM-style tool. Any MCP client (Claude, Cursor, your own agent) can call it. */
export function buildServer() {
  const server = new McpServer({ name: 'crm-demo', version: '0.1.0' });
  const customers = new Set(['5541000002']);
  server.tool('is_customer', 'Check whether a phone number belongs to an existing customer', { phone: z.string() },
    async ({ phone }) => ({ content: [{ type: 'text', text: String(customers.has(phone)) }] }));
  return server;
}
