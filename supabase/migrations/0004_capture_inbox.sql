-- ============================================================
-- QUICK CAPTURE / BRAIN DUMP
-- Global capture bar writes here instantly with zero required
-- categorization. Triage (ai_suggested_type / ai_suggested_target via the
-- classifyCapture tool) is a later-phase feature — this migration only
-- ships the raw capture + untriaged inbox that Phase 0 needs.
-- ============================================================
create table capture_inbox (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  raw_content text not null,
  status text not null default 'untriaged' check (status in ('untriaged', 'triaged', 'discarded')),
  ai_suggested_type text,             -- 'task' | 'brain_item' | 'journal_entry' | 'calendar_event'
  ai_suggested_target jsonb,          -- e.g. { "project_id": "..." } for a suggested task
  triaged_into_type text,
  triaged_into_id uuid,
  captured_at timestamptz not null default now(),
  triaged_at timestamptz
);

create index capture_inbox_user_status_idx on capture_inbox (user_id, status, captured_at desc);

alter table capture_inbox enable row level security;

create policy "capture_inbox: own rows only" on capture_inbox
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
