/**
 * The provider-agnostic AI layer. Nothing outside core/ai-provider should
 * ever import a vendor SDK (@anthropic-ai/sdk, openai, etc.) directly —
 * everything talks to these types instead. See architecture doc v3 §6.
 */

export interface AIMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  toolCalls?: ToolCall[];
  toolCallId?: string;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

/** Plain JSON Schema — provider-agnostic tool definition. */
export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface ChatOptions {
  messages: AIMessage[];
  tools?: ToolDefinition[];
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResult {
  content: string;
  toolCalls?: ToolCall[];
  usage?: { inputTokens: number; outputTokens: number };
}

export interface StreamChunk {
  type: 'text-delta' | 'tool-call' | 'done';
  textDelta?: string;
  toolCall?: ToolCall;
}

export interface AIProviderCapabilities {
  chat: boolean;
  stream: boolean;
  functionCalling: boolean;
  summarize: boolean;
}

export interface AIProvider {
  readonly id:
    'anthropic' | 'openai' | 'gemini' | 'groq' | 'openrouter' | 'ollama' | 'mock' | (string & {});
  readonly capabilities: AIProviderCapabilities;

  chat(options: ChatOptions): Promise<ChatResult>;
  stream(options: ChatOptions): AsyncIterable<StreamChunk>;
  summarize(text: string, opts?: { maxLength?: number }): Promise<string>;
}

export class AIProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AIProviderError';
  }
}
