# 04 – RAG with PostgreSQL + pgvector (Python)
Chunking, embedding, retrieval and a grounded prompt, tested offline. `schema.sql` is the pgvector target (HNSW index, cosine `<=>`). Run `pip install -r requirements.txt && pytest`.
Competitors: Pinecone, Weaviate, Qdrant, Chroma (managed/dedicated vector DBs). pgvector is the cheapest first choice when you already run PostgreSQL.
Not covered here: real embeddings, reranking, evaluation sets (add these before calling it production).
