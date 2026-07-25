/**
 * Plugin System — skeleton only in Phase 0.
 *
 * Each feature module (projects, finance, capture, ...) will eventually
 * export an OSPlugin describing its tools and its slice of LifeContext.
 * The Context Engine (Phase 1+) collects every registered plugin's
 * contextContributors and runs them in parallel before each AI turn.
 *
 * Nothing consumes this yet in Phase 0 — capture/ doesn't register a
 * plugin, and there's no registry to register it with. This file exists
 * now, ahead of Phase 1, so the shape is settled before modules start
 * depending on it.
 */

export interface ContextContributor {
  /** Unique key this contributor writes into LifeContext, e.g. "activeProjects". */
  key: string;
  /** Fast, read-only. Must tolerate being dropped on timeout — see build-context.ts (Phase 1). */
  contribute: () => Promise<unknown>;
}

export interface OSPlugin {
  id: string;
  name: string;
  /** JSON-Schema tool definitions this plugin exposes to the AI Provider's function calling. */
  tools?: unknown[];
  /** Slices of LifeContext this plugin can contribute. Optional — most Phase 0/1 plugins won't have any yet. */
  contextContributors?: ContextContributor[];
}
