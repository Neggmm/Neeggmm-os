/**
 * Embeddings are a fully separate interface from AIProvider — not a
 * capability flag on it. An adapter can implement EmbeddingProvider,
 * AIProvider, both, or neither (e.g. Anthropic's adapter will only ever
 * implement AIProvider, since Anthropic has no first-party embeddings
 * API). See architecture doc v3 §6.
 */
export interface EmbeddingProvider {
  readonly id: 'openai' | 'voyage' | 'gemini' | 'ollama' | (string & {});
  /** Fixed per provider, e.g. 1536, 1024, 512. Used by the future memory-reindex job. */
  readonly dimensions: number;
  embed(input: string | string[]): Promise<number[][]>;
}
