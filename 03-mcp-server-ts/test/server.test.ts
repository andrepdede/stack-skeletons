import { describe, it, expect } from 'vitest';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { buildServer } from '../src/server.js';

describe('mcp server', () => {
  it('lists and calls the tool over an in-memory transport', async () => {
    const [ct, st] = InMemoryTransport.createLinkedPair();
    await buildServer().connect(st);
    const client = new Client({ name: 't', version: '0' });
    await client.connect(ct);
    expect((await client.listTools()).tools.map((t) => t.name)).toContain('is_customer');
    const r: any = await client.callTool({ name: 'is_customer', arguments: { phone: '5541000002' } });
    expect(r.content[0].text).toBe('true');
  });
});
