-- ============================================================
-- AI MEMORIES — v3 design
-- embedding is NULLABLE with no fixed dimension until an embedding
-- provider is ever chosen (EmbeddingProviderRouter.getProvider() returns
-- null by design — see src/core/embedding-provider). content is always
-- stored and always searchable via pg_trgm, independent of embedding
-- status. No ivfflat vector index is created here — that only happens in
-- the future one-time memory-reindex job once a provider + dimension are
-- fixed. Phase 0 does not populate this table; it only ships the schema.
-- ============================================================
create table ai_memories (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('fact', 'preference', 'pattern')),
  content text not null,
  embedding vector,                          -- NULLABLE, dimension-flexible
  embedding_provider text,                   -- e.g. 'openai' — null until set
  embedded_at timestamptz,                   -- null until embedded
  confidence numeric(3, 2) not null default 0.8,
  source_event_id uuid references domain_events(id) on delete set null,
  reinforced_count integer not null default 1,
  last_reinforced_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Full-text/fuzzy fallback — always available, independent of embeddings.
create index ai_memories_content_trgm_idx on ai_memories using gin (content gin_trgm_ops);
create index ai_memories_user_idx on ai_memories (user_id);

-- The vector index is intentionally NOT created here. It is created only
-- by the future supabase/functions/memory-reindex job, once an embedding
-- provider fixes a concrete dimension:
--   alter table ai_memories alter column embedding type vector(N);
--   create index ai_memories_embedding_idx on ai_memories
--     using ivfflat (embedding vector_cosine_ops);

alter table ai_memories enable row level security;

create policy "ai_memories: own rows only" on ai_memories
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
