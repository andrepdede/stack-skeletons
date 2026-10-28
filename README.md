# stack-skeletons

Minimal, tested skeletons for the technologies that appear most in current senior remote job posts (AI/agents, integrations, full-stack). Each folder is small on purpose: enough to learn the shape, read the code in an afternoon, and say truthfully "I built X with Y".

| # | Folder | Technology | Competing / similar | Verified here |
|---|--------|-----------|---------------------|---------------|
| 01 | agents-langgraph-py | LangGraph (state graph agents) | CrewAI, Google ADK | 4 tests pass |
| 02 | agents-toolloop-ts | Tool-use loop, Anthropic SDK (TypeScript) | LangGraph.js, Vercel AI SDK, Claude Agent SDK | typecheck + 2 tests (Anthropic adapter NOT tested live) |
| 03 | mcp-server-ts | Model Context Protocol server | n/a (standard) | 1 in-memory client test |
| 04 | rag-pgvector-py | RAG with PostgreSQL + pgvector | Pinecone, Weaviate, Qdrant, Chroma | 2 tests (offline hashing embedder; SQL not run against a DB) |
| 05 | api-fastapi-py | FastAPI + Pydantic | Fastify (see agent-handoff-demo), Go (08) | 2 tests |
| 06 | web-nextjs | Next.js App Router + TanStack Query + TS | React + Vite (what you already use) | typecheck + `next build` OK |
| 07 | aws-lambda-sam-ts | AWS Lambda + API Gateway | SAM (template.yaml) vs Terraform (main.tf) | handler tests only; IaC NOT validated or deployed |
| 08 | service-go | Go HTTP service | FastAPI, Node | `go vet` + 2 tests |

Not included (and why): CrewAI/ADK (heavy dependencies; LangGraph is the closest to the explicit state machine you built by hand), Kubernetes/Docker deployment (needs a cluster), Langfuse/LangSmith tracing (add after 01 works), real embeddings (needs a provider key).

## How to use this to learn fast
1. Read `01` after `agent-handoff-demo`: compare your hand-built state machine to a LangGraph graph (docstring maps the terms).
2. Run every folder's tests; break something on purpose and fix it.
3. Pick 2 folders that match jobs you want and extend them (persistence, auth, a real LLM). Publish only what you can explain line by line.

CI: `.github/workflows/ci.yml` runs all folders. Local services: `docker-compose.yml` (pgvector + Redis).
