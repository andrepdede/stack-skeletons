"""RAG core: chunk -> embed -> retrieve top-k -> build a grounded prompt.
The embedder is a hashing stand-in so tests are offline and deterministic. In production swap `embed` for a real
embedding model and `InMemoryStore` for PgVectorStore (SQL in schema.sql, operator <=> = cosine distance)."""
import hashlib
import math
import re

DIM = 64


def chunk(text: str, size: int = 200, overlap: int = 40) -> list[str]:
    words = text.split()
    step = max(1, size - overlap)
    return [" ".join(words[i:i + size]) for i in range(0, max(1, len(words)), step) if words[i:i + size]]


def embed(text: str) -> list[float]:
    v = [0.0] * DIM
    for tok in re.findall(r"\w+", text.lower()):
        v[int(hashlib.md5(tok.encode()).hexdigest(), 16) % DIM] += 1.0
    n = math.sqrt(sum(x * x for x in v)) or 1.0
    return [x / n for x in v]


def cosine(a: list[float], b: list[float]) -> float:
    return sum(x * y for x, y in zip(a, b))


class InMemoryStore:
    def __init__(self):
        self.rows: list[tuple[str, str, list[float]]] = []

    def add(self, doc: str, text: str):
        for c in chunk(text):
            self.rows.append((doc, c, embed(c)))

    def search(self, query: str, k: int = 3):
        q = embed(query)
        return sorted(self.rows, key=lambda r: cosine(q, r[2]), reverse=True)[:k]


def build_prompt(question: str, hits) -> str:
    ctx = "\n---\n".join(f"[{d}] {c}" for d, c, _ in hits)
    return f"Answer ONLY from the context. If it is not there, say you don't know.\n\nContext:\n{ctx}\n\nQuestion: {question}"
