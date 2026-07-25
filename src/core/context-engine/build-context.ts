import type { LifeContext } from '@/core/context-engine/types';

/**
 * STUB — Phase 0 only.
 *
 * Real implementation (Phase 1) collects every registered plugin's
 * contextContributors and runs them in parallel with a timeout, dropping
 * any contributor that's slow or fails rather than blocking the AI
 * response. No plugins contribute anything yet, so this just returns an
 * empty-shaped LifeContext with `now` populated — enough for the
 * MockProvider round-trip in Phase 0 without pretending the real
 * assembly logic exists yet.
 */
export async function buildContext(timezone = 'UTC'): Promise<LifeContext> {
  const now = new Date();

  return {
    now: {
      date: now.toISOString().slice(0, 10),
      time: now.toISOString().slice(11, 16),
      timezone,
      dayOfWeek: now.toLocaleDateString('en-US', { weekday: 'long' }),
    },
    activeProjects: [],
    todaySchedule: [],
    delayedTasks: [],
    recentActivity: [],
    currentGoals: [],
    mood: { latestValue: null, loggedAt: null },
    focusSession: { active: false },
  };
}
