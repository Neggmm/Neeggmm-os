-- ============================================================
-- DOMAIN EVENTS — the Event Bus outbox
-- Every Server Action that mutates state should end with publishEvent(...)
-- (see src/core/event-bus). A future webhook + Edge Function fan-out
-- (Timeline projector, Graph updater, Memory extractor, Notification
-- dispatcher, Proactive AI Engine) subscribes to this table — none of
-- that fan-out is built in Phase 0, this migration only lays the spine.
-- ============================================================
create table domain_events (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,          -- e.g. 'capture.created', 'task.overdue'
  entity_type text,                  -- generic entity_type/entity_id kept
  entity_id uuid,                    -- free-form on purpose (see v3 §5, Digital Twin note)
  payload jsonb not null default '{}',
  occurred_at timestamptz not null default now(),
  processed_at timestamptz,          -- set by the (future) fan-out consumer
  created_at timestamptz not null default now()
);

create index domain_events_user_occurred_idx on domain_events (user_id, occurred_at desc);
create index domain_events_unprocessed_idx on domain_events (occurred_at) where processed_at is null;
create index domain_events_type_idx on domain_events (event_type);

alter table domain_events enable row level security;

create policy "domain_events: read own" on domain_events
  for select using (auth.uid() = user_id);

create policy "domain_events: insert own" on domain_events
  for insert with check (auth.uid() = user_id);
