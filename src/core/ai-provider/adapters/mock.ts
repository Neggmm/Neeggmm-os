import type {
  AIMessage,
  AIProvider,
  AIProviderCapabilities,
  ChatOptions,
  ChatResult,
  StreamChunk,
} from '@/core/ai-provider/types';

/**
 * Deterministic, zero-API-key provider for local development. Lets the
 * Context Engine, Tool Registry, and Proactive Engine be built and tested
 * end-to-end (per Phase 0's deliverable) before any real vendor is
 * configured. Responses are canned but content-aware enough to be useful
 * for manual testing — not randomized, so tests stay deterministic.
 */
export class MockProvider implements AIProvider {
  readonly id = 'mock' as const;

  readonly capabilities: AIProviderCapabilities = {
    chat: true,
    stream: true,
    functionCalling: false,
    summarize: true,
  };

  async chat(options: ChatOptions): Promise<ChatResult> {
    const content = this.buildReply(options.messages);
    return {
      content,
      usage: {
        inputTokens: estimateTokens(options.messages.map((m) => m.content).join(' ')),
        outputTokens: estimateTokens(content),
      },
    };
  }

  async *stream(options: ChatOptions): AsyncIterable<StreamChunk> {
    const content = this.buildReply(options.messages);
    const words = content.split(' ');

    for (const word of words) {
      yield { type: 'text-delta', textDelta: word + ' ' };
      // Small delay so streaming UI can be tested against something that
      // actually arrives incrementally rather than in one tick.
      await sleep(15);
    }

    yield { type: 'done' };
  }

  async summarize(text: string, opts?: { maxLength?: number }): Promise<string> {
    const maxLength = opts?.maxLength ?? 240;
    const trimmed = text.trim().replace(/\s+/g, ' ');
    if (trimmed.length <= maxLength) return trimmed;
    return trimmed.slice(0, maxLength).trimEnd() + '…';
  }

  private buildReply(messages: AIMessage[]): string {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');

    if (!lastUserMessage || !lastUserMessage.content.trim()) {
      return "[mock] I didn't receive any message content to respond to.";
    }

    return (
      `[mock provider] I received your message: "${lastUserMessage.content.trim()}". ` +
      'No real AI provider is configured yet — this is a deterministic canned response from ' +
      'MockProvider, used so the Context Engine, Tool Registry, and AI Provider Router can be ' +
      'built and tested end-to-end with zero API keys. Set AI_CHAT_PROVIDER once you configure a ' +
      'real adapter.'
    );
  }
}

function estimateTokens(text: string): number {
  // Rough approximation (~4 chars/token) — good enough for mock usage stats.
  return Math.max(1, Math.round(text.length / 4));
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
