import 'server-only';
import type { EmbeddingProvider } from '@/core/embedding-provider/types';

/**
 * Reads AI_EMBEDDINGS_PROVIDER and returns the matching adapter, or null
 * if unset. Returning null is a normal, permanent, fully-supported state
 * — NOT a bootstrapping gap to fill in later. Unlike AIProviderRouter
 * (chat is required for the app to function and throws loudly if
 * unconfigured), embeddings are optional infrastructure: every caller
 * (e.g. the future memory.searchMemory) must treat null as expected and
 * fall back to Postgres full-text/trigram search — see
 * ai_memories_content_trgm_idx in supabase/migrations.
 *
 * No adapters are registered in Phase 0 — this class exists so the
 * "returns null" contract is real code, not a TODO comment, from day one.
 */
export class EmbeddingProviderRouter {
  private providers = new Map<string, EmbeddingProvider>();
  private configuredId: string | undefined;

  constructor() {
    this.configuredId = process.env.AI_EMBEDDINGS_PROVIDER || undefined;

    // Future adapters register here, guarded by credential presence, e.g.:
    //   if (process.env.OPENAI_API_KEY) {
    //     this.providers.set('openai', new OpenAIEmbeddingProvider());
    //   }
    // Deliberately empty in Phase 0 — no embedding work happens until an
    // adapter exists AND AI_EMBEDDINGS_PROVIDER names it.
  }

  getProvider(): EmbeddingProvider | null {
    if (!this.configuredId) return null;
    return this.providers.get(this.configuredId) ?? null;
  }
}

let cachedRouter: EmbeddingProviderRouter | null = null;

export function getEmbeddingProviderRouter(): EmbeddingProviderRouter {
  if (!cachedRouter) {
    cachedRouter = new EmbeddingProviderRouter();
  }
  return cachedRouter;
}
