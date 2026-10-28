import { describe, it, expect } from 'vitest';
import { handler } from '../src/handler.js';

const ev = (method: string, body?: string) => ({ requestContext: { http: { method } }, body }) as any;

describe('webhook lambda', () => {
  it('accepts a valid POST with 202', async () => {
    const r: any = await handler(ev('POST', JSON.stringify({ phone: '55', text: 'hi' })));
    expect(r.statusCode).toBe(202);
  });
  it('rejects other methods, bad json and missing fields', async () => {
    expect(((await handler(ev('GET'))) as any).statusCode).toBe(405);
    expect(((await handler(ev('POST', '{bad'))) as any).statusCode).toBe(400);
    expect(((await handler(ev('POST', '{}'))) as any).statusCode).toBe(422);
  });
});
