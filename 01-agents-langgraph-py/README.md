# 01 – Agents with LangGraph (Python)
Same hand-off flow as `agent-handoff-demo`, as a LangGraph `StateGraph`. Read `app/graph.py` top docstring: it maps your hand-built concepts to LangGraph terms.
Run: `pip install -r requirements.txt && pytest`
Next steps to learn: checkpointer (persistence), `interrupt` (human-in-the-loop), streaming, LangSmith/Langfuse tracing.
Alternatives (not included): CrewAI (role/task abstraction), Google ADK. LangGraph is the closest to an explicit state machine.
