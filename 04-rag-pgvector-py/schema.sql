CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS chunks (
  id BIGSERIAL PRIMARY KEY,
  doc TEXT NOT NULL,
  content TEXT NOT NULL,
  embedding vector(64) NOT NULL  -- use your embedding model's dimension in production (e.g. 1024/1536)
);
CREATE INDEX IF NOT EXISTS chunks_embedding_idx ON chunks USING hnsw (embedding vector_cosine_ops);
-- retrieval: SELECT content FROM chunks ORDER BY embedding <=> $1 LIMIT 4;
