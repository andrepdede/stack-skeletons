"""Same sales -> legal -> finance -> support hand-off as agent-handoff-demo, expressed as a LangGraph StateGraph.
Concept map (what you already built by hand -> LangGraph term):
  conversation state dict        -> State (TypedDict)
  your agent functions           -> nodes
  your if/else routing           -> conditional edges
  human escalation               -> a terminal node (END) + checkpointer/interrupt in production
"""
from typing import Literal, TypedDict
from langgraph.graph import END, StateGraph


class State(TypedDict, total=False):
    text: str
    is_customer: bool
    intent: Literal["question", "purchase", "other"]
    confidence: float
    lead: dict
    reply: str
    route: str


def classify(state: State) -> State:
    """Stand-in for an LLM call (swap for a ChatAnthropic / ChatOpenAI structured-output call)."""
    t = state["text"].lower()
    if any(w in t for w in ("buy", "purchase", "contract")):
        return {"intent": "purchase", "confidence": 0.95}
    if any(w in t for w in ("price", "plan", "how", "help")):
        return {"intent": "question", "confidence": 0.8}
    return {"intent": "other", "confidence": 0.2}


def choose_route(state: State) -> str:
    if state.get("is_customer"):
        return "support"
    if state["confidence"] < 0.5:
        return "human"
    return "sales" if state["intent"] == "question" else "legal"


def sales(state: State) -> State:
    return {"reply": "Happy to explain the plans. Tell me if you want to buy.", "route": "sales"}


def legal(state: State) -> State:
    return {"reply": "I will prepare your contract and ask finance for a payment link.", "route": "legal"}


def finance(state: State) -> State:
    return {"reply": "Payment link: https://pay.example.test/checkout/1", "route": "finance"}


def support(state: State) -> State:
    return {"reply": "Support here. Describe the problem you see.", "route": "support"}


def human(state: State) -> State:
    return {"reply": "A team member will take over this conversation.", "route": "human"}


def build_graph():
    g = StateGraph(State)
    for name, fn in [("classify", classify), ("sales", sales), ("legal", legal),
                     ("finance", finance), ("support", support), ("human", human)]:
        g.add_node(name, fn)
    g.set_entry_point("classify")
    g.add_conditional_edges("classify", choose_route,
                            {"sales": "sales", "legal": "legal", "support": "support", "human": "human"})
    g.add_edge("legal", "finance")  # legal asks finance for the payment link
    for end in ("sales", "finance", "support", "human"):
        g.add_edge(end, END)
    return g.compile()
