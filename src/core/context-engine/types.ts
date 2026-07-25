/**
 * Context Engine — types only in Phase 0.
 *
 * LifeContext is rebuilt fresh on every AI request in Phase 1+ (once
 * plugins exist to contribute to it). Phase 0 has no plugins with
 * contextContributors registered yet, so build-context.ts in this
 * directory is a stub that returns an empty-shaped LifeContext — this
 * file settles the shape ahead of that work, per the v3 architecture.
 */
export interface LifeContext {
  now: { date: string; time: string; timezone: string; dayOfWeek: string };
  activeProjects: { id: string; name: string; status: string; progress: number }[];
  todaySchedule: { title: string; startsAt: string; endsAt: string }[];
  delayedTasks: { id: string; title: string; projectName: string; daysOverdue: number }[];
  recentActivity: { title: string; occurredAt: string }[];
  currentGoals: { id: string; title: string; progress: number }[];
  mood: { latestValue: number | null; loggedAt: string | null };
  focusSession: { active: boolean; startedAt?: string; intention?: string };
}
