import { describe, it, expect } from 'vitest';
import { runAgent, type ModelClient, type ToolDef } from '../src/loop.js';

const tool: ToolDef = { name: 'get_plan', description: 'price of a plan', input_schema: { type: 'object', properties: { plan: { type: 'string' } } },
  run: async (i) => (i.plan === 'Pro' ? 'USD 99' : 'unknown') };

function fakeClient(): ModelClient {
  let n = 0;
  return { async create() {
    n++;
    return n === 1
      ? { stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 't1', name: 'get_plan', input: { plan: 'Pro' } }] }
      : { stop_reason: 'end_turn', content: [{ type: 'text', text: 'Pro costs USD 99' }] };
  } };
}

describe('tool loop', () => {
  it('calls the tool then answers', async () => {
    expect(await runAgent(fakeClient(), 'sys', 'price of Pro?', [tool])).toBe('Pro costs USD 99');
  });
  it('stops at the step limit', async () => {
    const looping: ModelClient = { async create() { return { stop_reason: 'tool_use', content: [{ type: 'tool_use', id: 'x', name: 'get_plan', input: {} }] }; } };
    expect(await runAgent(looping, 's', 'u', [tool], 3)).toMatch(/escalated/);
  });
});
