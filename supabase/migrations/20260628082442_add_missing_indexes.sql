-- Add missing indexes for date-range queries
-- conversations table: frequently queried by created_at for date filtering
CREATE INDEX IF NOT EXISTS idx_conversations_created_at
  ON conversations(created_at DESC);

-- audit_logs table: frequently queried by created_at for date filtering
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs(created_at DESC);

-- usage_tracking table: add index for month-based lookups
CREATE INDEX IF NOT EXISTS idx_usage_tracking_month
  ON usage_tracking(month);

-- Note on IVFFlat vs HNSW:
-- IVFFlat with lists=100 is reasonable for <100k chunks
-- For larger datasets, consider HNSW index which has better query performance
-- but higher memory usage. Current IVFFlat is fine for MVP scale.
-- If needed later, replace with:
--   CREATE INDEX idx_document_chunks_embedding
--     ON document_chunks USING hnsw (embedding vector_cosine_ops)
--     WITH (m = 16, ef_construction = 64);
