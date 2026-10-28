from app.rag import InMemoryStore, build_prompt, chunk


def test_chunk_overlap():
    words = " ".join(str(i) for i in range(500))
    cs = chunk(words, size=200, overlap=40)
    assert len(cs) >= 3 and cs[0].split()[-40:] == cs[1].split()[:40]


def test_retrieval_finds_relevant_doc_and_prompt_is_grounded():
    s = InMemoryStore()
    s.add("billing", "Invoices are issued on the first day of each month and paid by card or bank slip.")
    s.add("support", "To reset your password open settings and choose reset password then check your email.")
    hits = s.search("how do I reset my password", k=1)
    assert hits[0][0] == "support"
    assert "ONLY from the context" in build_prompt("q", hits)
