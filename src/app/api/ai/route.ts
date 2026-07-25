import { NextResponse } from 'next/server';
import { getAIProviderRouter } from '@/core/ai-provider/router';
import type { AIMessage } from '@/core/ai-provider/types';

/**
 * Phase 0 minimal AI route: takes a message, resolves a chat-capable
 * provider via the router (MockProvider by default, since no real
 * adapter is registered yet), and returns its reply.
 *
 * NOT wired to the Context Engine yet — that's Phase 1, once plugins
 * exist to contribute LifeContext. This route exists purely to prove the
 * round-trip: client -> route -> AIProviderRouter -> provider -> back.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.message !== 'string' || !body.message.trim()) {
    return NextResponse.json(
      { error: 'Request body must include a non-empty "message" string.' },
      { status: 400 },
    );
  }

  const messages: AIMessage[] = [{ role: 'user', content: body.message }];

  const router = getAIProviderRouter();
  const provider = router.getProvider('chat');
  const result = await provider.chat({ messages });

  return NextResponse.json({
    providerId: provider.id,
    reply: result.content,
    usage: result.usage,
  });
}
