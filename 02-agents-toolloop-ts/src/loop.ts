/**
 * Minimal tool-use agent loop (the pattern behind the Claude Agent SDK / function calling).
 * The model client is an interface so tests run offline; AnthropicClient is the real adapter.
 */
import Anthropic from '@anthropic-ai/sdk';

export interface ToolDef { name: string; description: string; input_schema: object; run(input: any): Promise<string> }
export type Block = { type: 'text'; text: string } | { type: 'tool_use'; id: string; name: string; input: any };
export interface ModelResponse { stop_reason: 'end_turn' | 'tool_use'; content: Block[] }
export interface ModelClient { create(args: { system: string; messages: any[]; tools: any[] }): Promise<ModelResponse> }

export async function runAgent(client: ModelClient, system: string, user: string, tools: ToolDef[], maxSteps = 5): Promise<string> {
  const messages: any[] = [{ role: 'user', content: user }];
  const defs = tools.map(({ name, description, input_schema }) => ({ name, description, input_schema }));
  for (let step = 0; step < maxSteps; step++) {
    const res = await client.create({ system, messages, tools: defs });
    messages.push({ role: 'assistant', content: res.content });
    if (res.stop_reason !== 'tool_use') {
      return res.content.filter((b): b is Extract<Block, { type: 'text' }> => b.type === 'text').map((b) => b.text).join('\n');
    }
    const results = [];
    for (const b of res.content) {
      if (b.type !== 'tool_use') continue;
      const tool = tools.find((t) => t.name === b.name);
      const out = tool ? await tool.run(b.input).catch((e) => `error: ${e.message}`) : `error: unknown tool ${b.name}`;
      results.push({ type: 'tool_result', tool_use_id: b.id, content: out });
    }
    messages.push({ role: 'user', content: results });
  }
  return 'escalated: step limit reached'; // guardrail: never loop forever
}

export class AnthropicClient implements ModelClient {
  private c = new Anthropic();
  constructor(private model = process.env.LLM_MODEL ?? 'claude-sonnet-5-5') {}
  async create(a: { system: string; messages: any[]; tools: any[] }) {
    const r = await this.c.messages.create({ model: this.model, max_tokens: 1024, system: a.system, messages: a.messages, tools: a.tools });
    return { stop_reason: r.stop_reason === 'tool_use' ? 'tool_use' : 'end_turn', content: r.content as Block[] } as ModelResponse;
  }
}
