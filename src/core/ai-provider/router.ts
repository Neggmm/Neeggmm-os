import 'server-only';
import { MockProvider } from '@/core/ai-provider/adapters/mock';
import {
  AIProviderError,
  type AIProvider,
  type AIProviderCapabilities,
} from '@/core/ai-provider/types';

/**
 * Resolves which AIProvider handles a given capability, with fallback.
 *
 * Phase 0 only ever registers MockProvider — real adapters (Anthropic,
 * OpenAI, Gemini, Groq, OpenRouter, Ollama) are added in later phases as
 * thin wrappers over the Vercel AI SDK, registered here the same way:
 * only if their env credentials are present. Nothing outside this file
 * should construct a provider adapter directly.
 */
export class AIProviderRouter {
  private providers = new Map<string, AIProvider>();
  private primaryId: string;
  private fallbackOrder: string[];

  constructor() {
    this.primaryId = process.env.AI_CHAT_PROVIDER || 'mock';
    this.fallbackOrder = (process.env.AI_FALLBACK_ORDER || '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    this.registerAvailableProviders();
  }

  private registerAvailableProviders() {
    // MockProvider needs no credentials — always available, and is the
    // Phase 0 default so the app works with zero API keys.
    this.providers.set('mock', new MockProvider());

    // Future adapters register here, guarded by credential presence, e.g.:
    //   if (process.env.ANTHROPIC_API_KEY) {
    //     this.providers.set('anthropic', new AnthropicProvider());
    //   }
    // Only adapters with credentials present get registered at startup —
    // per architecture doc v3 §6.
  }

  getProvider(capability: keyof AIProviderCapabilities): AIProvider {
    const primary = this.providers.get(this.primaryId);
    if (primary?.capabilities[capability]) return primary;

    for (const fallbackId of this.fallbackOrder) {
      const candidate = this.providers.get(fallbackId);
      if (candidate?.capabilities[capability]) return candidate;
    }

    // Final safety net: MockProvider always supports chat/stream/summarize,
    // so this only throws if a capability MockProvider itself lacks
    // (functionCalling) and nothing else is configured — a real, honest
    // failure rather than a silent no-op.
    const mock = this.providers.get('mock');
    if (mock?.capabilities[capability]) return mock;

    throw new AIProviderError(
      `No configured provider supports capability "${capability}". ` +
        `Primary: "${this.primaryId}", fallback order: [${this.fallbackOrder.join(', ') || 'none'}].`,
    );
  }
}

let cachedRouter: AIProviderRouter | null = null;

/** Singleton accessor — avoids re-reading env / re-instantiating adapters per call. */
export function getAIProviderRouter(): AIProviderRouter {
  if (!cachedRouter) {
    cachedRouter = new AIProviderRouter();
  }
  return cachedRouter;
}
