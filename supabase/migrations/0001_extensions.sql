-- ============================================================
-- EXTENSIONS
-- Required by later migrations:
--   uuid-ossp -> uuid_generate_v4() used as the default id generator
--   pgvector  -> the `vector` type on ai_memories.embedding (nullable,
--                unconfigured dimension until an embedding provider is
--                chosen — see 0005_ai_memories.sql)
--   pg_trgm   -> trigram indexes powering full-text/fuzzy search, which
--                is the *only* search strategy while no embedding
--                provider is configured (the permanent Phase 0/1 state)
-- ============================================================
create extension if not exists "uuid-ossp";
create extension if not exists vector;
create extension if not exists pg_trgm;
