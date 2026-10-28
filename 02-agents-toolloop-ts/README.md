# 02 – Tool-use agent loop (TypeScript, Anthropic SDK)
The loop that Claude Agent SDK / OpenAI function calling wrap: model -> tool_use -> run tool -> tool_result -> repeat, with a step limit guardrail.
Run: `npm i && npm test`. Real use: `new AnthropicClient()` (needs ANTHROPIC_API_KEY; adapter not covered by tests).
Competitors: LangGraph.js, Vercel AI SDK, Claude Agent SDK (higher level, adds subagents/hooks).
