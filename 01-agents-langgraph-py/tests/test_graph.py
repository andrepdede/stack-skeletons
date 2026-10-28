from app.graph import build_graph

g = build_graph()


def run(text, customer=False):
    return g.invoke({"text": text, "is_customer": customer})


def test_question_goes_to_sales():
    assert run("how does the plan work")["route"] == "sales"


def test_purchase_goes_legal_then_finance_with_link():
    out = run("I want to buy")
    assert out["route"] == "finance" and "pay.example.test" in out["reply"]


def test_customer_goes_to_support():
    assert run("I want to buy", customer=True)["route"] == "support"


def test_low_confidence_escalates_to_human():
    assert run("asdf qwer")["route"] == "human"
