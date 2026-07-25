# Abdelrahman OS — Handoff Document

**Read this fully before writing any code.** This document is the single source of truth for continuing development. Do not restart, redesign, or second-guess decisions already made — they were made deliberately and are documented below.

---

## 1. Project Overview

**What it is:** Abdelrahman OS is a personal AI operating system — a single-user web app unifying projects, finance, goals, habits, journal, notes ("brain"), and calendar under one system, with an AI layer that has real situational awareness of the user's life (via a "Context Engine" that assembles a `LifeContext` snapshot before every AI turn).

**Final vision:** A futuristic, JARVIS/Iron Man HUD-inspired command center. Not a SaaS dashboard — a cinematic, premium, dark, glassmorphic AI cockpit: holographic panels, glow/energy states, animated system indicators, a persistent AI presence, and eventually memory + knowledge-graph visualization.

**Core architecture decisions (v3, do not redesign):**
- **Event Bus** — Postgres outbox pattern (`domain_events` table). Every state-mutating Server Action ends with `publishEvent(...)`. A future webhook/Edge-Function fan-out (Timeline projector, Graph updater, Memory extractor, Notification dispatcher, Proactive AI Engine) is **not built yet** — only the publish side exists.
- **AI Provider layer is fully vendor-agnostic.** Nothing outside `core/ai-provider` may import a vendor SDK directly. `AIProviderRouter` resolves a provider by capability with fallback; only `MockProvider` is registered today (zero API keys required).
- **Embeddings are a separate, optional interface from AI chat** — not a capability flag on `AIProvider`. `EmbeddingProviderRouter.getProvider()` returning `null` is a **permanent, normal, fully-supported state**, not a gap to fill. Never treat a null embedding provider as a bug.
- **Plugin System** — `OSPlugin` interface with optional `contextContributors`, for future feature modules to contribute slices of `LifeContext`. Currently just a type, nothing registers into it.
- **Context Engine** — `buildContext()` is a **stub** that returns an empty-shaped `LifeContext` with only `now` populated. It is not wired into any AI call yet. This is intentional Phase 0 scaffolding, not a bug.
- **`ai_memories` table** has a nullable, dimension-flexible `embedding` column and no vector index — by design, until an embedding provider is ever chosen.

---

## 2. Tech Stack

- **Next.js**: `^15.5.21` (App Router, `src/` dir, `@/*` import alias)
- **React**: `^19.2.8` (React 19 — **not** React 18; `useActionState` from `react`, `useFormStatus` from `react-dom`)
- **TypeScript**: `^5`, strict mode
- **Tailwind CSS**: `^4` — **CSS-first config**, no `tailwind.config.ts`. All tokens live in `src/app/globals.css` via `:root` custom properties + `@theme inline`. `tailwindcss-animate` and `tw-animate-css` both installed.
- **Supabase**: `@supabase/supabase-js` + `@supabase/ssr`. Three client entry points: `src/lib/supabase/{client,server,middleware}.ts`. Auth session refresh happens in `src/middleware.ts`.
- **UI primitives**: Hand-built shadcn/ui-style components (Radix primitives + `class-variance-authority` + `tailwind-merge`) in `src/components/ui/`. **Note:** the real `shadcn` CLI registry (`ui.shadcn.com`) was unreachable in the build sandbox — components were hand-authored in shadcn's exact conventions instead. `components.json` exists, so `npx shadcn add <x>` should work in a normal environment; verify before assuming it'll drop in cleanly.
- **Animation**: `framer-motion@^12`
- **Data/forms**: `@tanstack/react-query@^5`, `zustand@^5` (installed, **not yet used anywhere**), `react-hook-form` + `zod` + `@hookform/resolvers` (installed, **not yet used anywhere**)
- **Toasts**: `sonner`
- **Icons**: `lucide-react`
- **Not yet installed**: no chart library (`recharts` etc.) — install only when a milestone first needs a real chart, per the additive/no-premature-dependency convention already established.
- **Deployment target**: Vercel + Supabase Cloud (per architecture doc). No deployment has actually happened — this has only been built and verified locally/in-sandbox.

---

## 3. Current Repository State

Full file tree (everything that exists right now):

```
src/
├── app/
│   ├── (app)/
│   │   ├── layout.tsx          — fetches user server-side, wraps in AppShell
│   │   └── page.tsx             — renders <CommandCenter />
│   ├── api/ai/route.ts          — POST, round-trips through AIProviderRouter
│   ├── login/page.tsx           — public login/signup page
│   ├── layout.tsx               — root layout: fonts (next/font/google) + AppProviders
│   └── globals.css              — ALL design tokens (base + HUD/glass/glow, Phase 1)
├── components/
│   ├── hud/                     — Phase 1 primitives (see §4)
│   │   ├── glass-panel.tsx
│   │   ├── hud-frame.tsx
│   │   ├── glow-badge.tsx
│   │   ├── animated-counter.tsx
│   │   └── stat-ring.tsx
│   ├── motion/
│   │   ├── variants.ts          — fadeUp/fade/scaleIn/slideInRight/stagger (Phase 0) + scanIn/radialReveal/glowPulse* (Phase 1)
│   │   ├── fade-in.tsx          — FadeIn wrapper (accepts className, used for grid spans)
│   │   └── status-rail.tsx      — pulsing "system alive" dot, sidebar + login
│   ├── shared/app-providers.tsx — TanStack Query + Sonner Toaster
│   ├── shell/
│   │   ├── app-shell.tsx        — ambient bg, vignette, #assistant-portal-root mount point
│   │   ├── sidebar.tsx          — client component, usePathname, active-route glow
│   │   └── topbar.tsx           — glass header, Online badge, disabled AI-assistant slot
│   └── ui/                      — 13 hand-built shadcn-style primitives (button, input, textarea, label, card, badge, separator, avatar, tooltip, scroll-area, dialog, dropdown-menu, sonner, kbd)
├── core/                        — UNTOUCHED since Phase 0, do not modify without explicit instruction
│   ├── ai-provider/{types,router}.ts, adapters/mock.ts
│   ├── embedding-provider/{types,router}.ts
│   ├── context-engine/{types,build-context}.ts   — STUB, not wired to any AI call
│   ├── event-bus/{types,publish-event}.ts
│   ├── plugin-system/types.ts
│   └── tool-registry/                — EMPTY, no files yet
├── features/
│   ├── auth/
│   │   ├── actions/{sign-in,sign-up,sign-out}.ts
│   │   └── components/login-form.tsx
│   ├── capture/
│   │   ├── actions/capture-raw.ts
│   │   └── components/{capture-bar,capture-inbox-list}.tsx   — restyled Phase 1
│   └── command-center/
│       └── components/
│           ├── command-center.tsx      — orchestrator, cockpit grid layout
│           ├── greeting-header.tsx     — server component, real profile name + live clock
│           ├── live-clock.tsx          — client, ticking clock
│           ├── system-status-panel.tsx — server component, 3 REAL signals
│           ├── status-tile.tsx         — client subcomponent for one status entry
│           ├── quick-actions.tsx       — Capture / Assistant(disabled) / Command Center
│           └── event-timeline.tsx      — Milestone 5: real domain_events feed
├── lib/
│   ├── hooks/{use-keyboard-shortcut,use-live-clock}.ts
│   ├── supabase/{client,server,middleware}.ts
│   └── utils.ts                 — cn()
├── middleware.ts                — invokes lib/supabase/middleware updateSession
└── types/supabase.ts             — hand-written Database type (matches migrations exactly)

supabase/
├── config.toml
└── migrations/
    ├── 0001_extensions.sql       — uuid-ossp, vector, pg_trgm
    ├── 0002_profiles.sql         — + handle_new_user trigger, RLS
    ├── 0003_domain_events.sql    — Event Bus outbox, RLS
    ├── 0004_capture_inbox.sql    — Quick Capture, RLS
    └── 0005_ai_memories.sql      — nullable embedding, RLS, NO vector index yet
```

**Not yet created:** `src/features/ai-assistant/`, `src/features/memory/`, `src/features/knowledge-graph/` — all planned, none started.

**What's fully implemented and working end-to-end:**
- Auth (sign in / sign up / sign out) via Supabase, middleware-enforced redirects
- Quick Capture: `⇧⌘N`/`Ctrl+Shift+N` anywhere → dialog → `captureRaw` Server Action → `capture_inbox` insert → `publishEvent('capture.created')` → toast → TanStack Query invalidation → inbox list updates with animation
- `/api/ai` round-trips through `AIProviderRouter` → `MockProvider`
- Command Center renders real data only: profile name, live clock, live untriaged-capture count, live 24h event count, live AI provider id/capabilities

**What is explicitly NOT implemented (do not assume it exists):**
- No Projects/Finance/Goals/Brain/Calendar modules (sidebar shows them as "dormant" placeholders on purpose)
- No AI assistant chat UI (topbar has a disabled placeholder button only)
- No memory writing/reading in the UI (`ai_memories` table exists, nothing writes to it)
- No knowledge graph anything
- No Context Engine wiring into any real AI call (stub only)
- No Event Bus consumer/fan-out (only the publish side)
- No streaming AI responses in the UI (MockProvider supports `.stream()`, nothing calls it yet)
- No real-time Supabase subscriptions anywhere (inbox refresh is via query invalidation on the capture action's own success, not a live subscription)

---

## 4. Completed Milestones

### Phase 0 (foundation — approved and deployed before Phase 1 began)
- Next.js 15 + TS + Tailwind v4 + hand-built shadcn/ui + Framer Motion, ESLint/Prettier configured
- Full `src/` folder structure per architecture doc
- Design system v1: dark-void tokens, signal/cognition accent split, 3-font system (Space Grotesk/Inter/JetBrains Mono)
- Supabase: 3 clients, middleware session refresh, 4 migrations (profiles, domain_events, capture_inbox, ai_memories)
- Event Bus: `publishEvent()` write side only
- Plugin System: `OSPlugin` type only
- AI Provider: full interface + router + `MockProvider`, proven via `/api/ai`
- Embedding Provider: interface + router returning `null` by design
- Auth: sign-in/up/out, login page
- Quick Capture: full working feature, backend to UI
- Shell: Sidebar/Topbar/AppShell v1 (plain, pre-HUD)
- Command Center v1: plain vertical card stack

### Phase 1 (JARVIS HUD transformation — in progress)
- **Milestone 1 — HUD Design Language Foundation** ✅: Glass tokens, glow-recipe tokens, ambient-wash token, all added additively to `globals.css`. Primitives: `GlassPanel`, `HudFrame`, `GlowBadge`, `AnimatedCounter`, `StatRing`. Motion additions: `scanIn`, `radialReveal`, `glowPulseKeyframes`/`glowPulseTransition`.
- **Milestone 2 — Shell Upgrade** ✅: Sidebar is now a client component with real active-route glow (`usePathname`) and a "dormant" visual language for disabled modules. Topbar has glass treatment, an "Online" `GlowBadge`, and a **disabled, tooltipped** AI-assistant trigger slot reserved for Milestone 8. AppShell has an ambient radial background + edge vignette + `#assistant-portal-root` empty mount div.
- **Milestone 3 — Greeting + System Status** ✅: `GreetingHeader` (server component, real `profiles.full_name` + live clock) and `SystemStatusPanel` (server component, 3 **real** signals: Event Bus 24h count, Capture untriaged count, AI provider id/capabilities — explicitly no fabricated numbers). Command Center restructured from a vertical stack into a cockpit grid (greeting row → status row → 2-col grid).
- **Milestone 4 — Quick Actions + Inbox restyle** ✅: `QuickActions` panel (Capture — real, re-dispatches the existing keyboard-shortcut event rather than duplicating dialog state; Assistant — disabled placeholder; Command Center — scroll-to-top). Inbox restyled into `GlassPanel` items with `scanIn` animation and an upgraded empty state (glowing icon badge). All existing query/mutation logic untouched.
- **Milestone 5 — Recent Events Timeline** ✅: `event-timeline.tsx` (server component), first real UI consumer of `domain_events`. Queries current user's events desc, limit 12, connector-line UI in a `GlassPanel`, graceful fallback for unmapped `event_type`s (only `capture.created` exists today). Wired in as a full-width row below the main grid in `command-center.tsx`.

**Verification status:** After every milestone, `eslint .`, `tsc --noEmit`, and a full `next build` were run and confirmed clean. **Sandbox caveat:** this build environment cannot reach `fonts.googleapis.com` (network allowlist), so `next/font/google` fails at build time *here only*. The verification method used each time: temporarily stub the two font-loader lines in `src/app/layout.tsx` with plain objects, run the build, confirm success, then restore the file byte-for-byte (diffed to confirm). **This is not a real issue** — it will build normally on Vercel or any machine with normal internet access. The next session should still do this stub-and-restore dance for local build verification unless it has real internet access, in which case just run `next build` directly.

---

## 5. Current UI State

**What the user sees right now, on `/` (Command Center), logged in:**
1. A translucent glass sidebar (left, hidden on mobile) — logo mark with a violet glow, 7 nav modules, only "Command center" and "Inbox" are active/clickable (with amber glow when the route is current), the other 5 show a small dim dot + "dormant" label. `StatusRail` (pulsing dot) at the bottom.
2. A glass topbar — "Life Command Center" label + a green pulsing "Online" badge, a disabled violet-glow sparkle button (assistant, tooltip explains it's coming), the working Capture button, and the user avatar dropdown (sign out).
3. Main content, over an ambient dark radial-gradient background with a vignette:
   - **Greeting panel** (glass, corner brackets): "Good [morning/afternoon/evening], [Name]." + live ticking clock (HH:MM:SS + weekday/date).
   - **System Status panel** (glass): 3 tiles — Event Bus (green, live 24h event count), Capture System (green, live untriaged count), AI Core (violet, "Mock" badge + `chat · stream · summarize — provider: mock`).
   - **Left column (2/3 width)**: Inbox — glass panel, each captured thought in its own glass card with a scan-in entrance animation, or a glowing-icon empty state.
   - **Right column (1/3 width)**: Quick Actions (3 icon tiles) above a "Coming online" list (Projects/Finance/Goals, dashed borders, muted).

**Gap vs. the JARVIS/Iron Man vision — what's still missing:**
- **No AI presence yet.** The assistant is a disabled button and a portal mount point — there is no floating orb, no chat surface, no visible "AI core" anywhere. This is the single biggest gap against the stated vision and is explicitly Milestone 8.
- **No data visualization.** No charts, no trend lines, no rings showing genuine percentage data (StatRing exists but nothing uses it yet — there's no real 0–100 metric in the product yet besides a placeholder-worthy "dormant module" case).
- **No event timeline.** `domain_events` has real rows (every capture publishes one) but nothing in the UI ever displays them as a feed/timeline.
- **Missions/Projects panel is still just a plain "Coming online" list**, not yet the "premium dormant-system" visual treatment the user approved (glow-less dashed cards, not a HUD-styled inert module display with e.g. a 0% `StatRing`).
- **No memory or knowledge-graph visualization anywhere** (correctly deferred — no writer to `ai_memories` exists yet).
- **Scanline effect (`.scanline` utility) is built but essentially unused** — only implicitly available via `GlassPanel`'s `scanline` prop, which nothing currently sets to `true`.
- **No cinematic "boot sequence" or page-transition choreography** — panels fade/scan in individually via stagger, but there's no overarching "system initializing" feel on first load.
- Responsive behavior beyond "sidebar hides under `md`" hasn't been deliberately designed — Quick Actions/status grids should be checked on small viewports.

---

## 6. Remaining Roadmap (continue from here)

Per the approved Phase 1 plan, in order:

**Milestone 6 — AI Insights Panel** (next up)
- First real UI consumer of `AIProviderRouter.getProvider('chat')` from *within* the product surface (not just `/api/ai`).
- New Server Action (e.g. `src/features/command-center/actions/get-ai-insight.ts`) calling `provider.chat(...)` with a lightweight, honest prompt (e.g., summarizing current inbox count / greeting-style observation) — **must** visibly badge "MOCK" (reuse `GlowBadge accent="cognition"`) whenever `provider.id === 'mock'`, per the approved decision: **never fake intelligence, always show real provider status.**
- New: `ai-insights-panel.tsx`. Loading state should feel like the AI "thinking" (consider the `.scanline` utility here — it's built and unused, this is a natural fit).

**Milestone 7 — Missions/Projects panel upgrade**
- Per the user's approved decision: **keep it in Phase 1** as a visual system module, **do not build the real Projects feature**, but upgrade the current plain "Coming online" list into a genuinely premium "dormant system" HUD treatment.
- Suggest: use `StatRing` at `value={0}` with `accent="muted"` per module (this is the exact honest use case `StatRing`'s docstring calls out), plus `HudFrame`/dashed-glass treatment, "STANDBY" or "AWAITING ACTIVATION" `GlowBadge` (accent="neutral" or a new muted treatment).
- This can absorb/replace the current inline "Coming online" block in `command-center.tsx` — likely worth extracting into its own `missions-overview.tsx` component for consistency with the other panels.

**Milestone 8 — Floating AI Assistant**
- New: `src/features/ai-assistant/` — `components/floating-trigger.tsx` (glowing orb, likely using `glowPulseKeyframes`/`glowPulseTransition` from `variants.ts` — built in Milestone 1, unused so far), `components/assistant-panel.tsx` (slide-in/expand, use `radialReveal` variant — also built, unused), `hooks/use-assistant.ts`.
- Should render via the `#assistant-portal-root` mount point already reserved in `app-shell.tsx` (use `createPortal` from `react-dom`).
- Functional target for this milestone: real round-trip through `/api/ai` (already proven), rendered as an actual chat surface — polish/streaming is a stretch goal, not required.
- This is also the natural point to finally wire up the topbar's disabled assistant button (`topbar.tsx`) — remove `disabled`, wire `onClick` to open the same panel/portal.

**Milestone 9 — Memory + Knowledge Graph scaffolding (architecture prep only)**
- `src/features/memory/` and `src/features/knowledge-graph/` — types + empty-state components only, matching the Context Engine's Phase 0 stub pattern. **No fake visualizations** — `ai_memories` has no writer yet, so any UI here must honestly show an empty/not-yet-active state, not sample data.

**After Milestone 9, Phase 1 is complete.** Do not plan past this without new instructions from the user — Phase 2 (real Projects/Finance/Goals modules, Context Engine going live, Event Bus fan-out, real embedding provider) has not been scoped yet.

---

## 7. Important Rules (non-negotiable)

- **Do not rewrite or redesign `core/`** (ai-provider, embedding-provider, event-bus, context-engine, plugin-system, tool-registry) without explicit new instructions. These are Phase 0 architecture, approved and stable.
- **Do not remove or weaken** existing Supabase RLS policies, auth flow, or middleware redirect logic.
- **Keep the AI layer provider-agnostic.** Any new AI-calling code goes through `getAIProviderRouter().getProvider(capability)` — never import a vendor SDK directly, even for a "quick" feature.
- **Keep the Supabase schema/migration pattern.** New tables get a new numbered migration file in `supabase/migrations/`, RLS enabled, policy scoped to `auth.uid()`. Never edit an already-applied migration — add a new one.
- **All changes should be additive.** Extend `globals.css`, `variants.ts`, etc. — do not restructure token names or delete existing utilities/classes that earlier components depend on.
- **Never fabricate data.** Every number/status shown in the UI must come from a real query or a real router/provider state (`AnimatedCounter`, `GlowBadge`, `StatRing` were all built with this constraint in mind — read their docstrings before using them).
- **Maintain the premium dark HUD aesthetic** established in Milestone 1: glass panels (`GlassPanel`), glow accents (signal=amber/interactive, cognition=violet/AI-only, success/warning/danger=status), the `--ease-os` motion curve, and the "system alive" motif (`StatusRail`, pulsing `GlowBadge`s). Don't introduce new colors or motion patterns without adding them to the shared token/variant files first.

---

## 8. Development Instructions for the Next Session

**Setup:**
```bash
cd abdelrahman-os
npm install
cp .env.example .env.local   # fill in NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```
Migrations in `supabase/migrations/` (0001–0005) must be applied to whatever Supabase project is linked, in order, before auth/capture features will work.

**Before writing any code for a new milestone:**
1. Re-read §6 above for the next milestone's scope and suggested approach.
2. `view` the actual current file(s) you're about to touch — don't trust memory of file contents, they may have been reformatted by Prettier.
3. Reuse existing primitives (`GlassPanel`, `HudFrame`, `GlowBadge`, `AnimatedCounter`, `StatRing`, motion variants) before inventing new visual patterns. Most of what Milestones 5–9 need already exists as unused building blocks from Milestone 1 (`scanline`, `radialReveal`, `glowPulseKeyframes` are all built and waiting).

**Verification after every milestone (do all of these, in order):**
```bash
npx prettier --write "src/**/*.{ts,tsx,css}"
npx eslint .
npx tsc --noEmit
```
Then a production build. **In a sandboxed environment without access to `fonts.googleapis.com`:** back up `src/app/layout.tsx`, temporarily replace the `next/font/google` import + the three font-loader calls with plain `{ variable: '--font-x' }` objects, run:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder-anon-key npx next build
```
then restore `layout.tsx` from the backup and `diff` to confirm it's byte-for-byte identical before continuing. **In an environment with real internet access, skip the stub entirely and just run `next build` directly.**

**Coding conventions already established — follow them:**
- Server Components by default; add `'use client'` only when you need state/effects/browser APIs.
- Server Actions live in `<feature>/actions/*.ts` with `'use server'` at the top; mutations end with `publishEvent(...)` where semantically appropriate.
- Supabase server client: `await createClient()` from `@/lib/supabase/server` (async — don't forget `await`). Browser client: `createClient()` from `@/lib/supabase/client` (sync).
- Every new panel-level component wraps content in `<GlassPanel>` — don't reach for the old flat `<Card>` from `components/ui/card.tsx` for new HUD surfaces (that component still exists for non-HUD contexts like dialogs/forms — don't delete it).
- Status/accent color usage: `signal` = interactive/primary only, `cognition` = AI-related surfaces only, `success`/`warning`/`danger` = real status semantics only, `neutral`/`muted` = dormant/inactive. Don't mix these up for decoration.
- Run `npx prettier --write` on any file you touch before finishing a milestone — the codebase has zero lint/format debt right now; keep it that way.

**Response style expected by this user (established over the conversation):** After approval to proceed, implement without re-explaining architecture. End each milestone with a short "DONE + files changed + notes" summary, verify (lint/tsc/build), then either stop if told to, or continue directly to the next milestone. Ask for a decision only when something is genuinely ambiguous (as was done for the Missions panel and AI Insights badge before Phase 1 began) — otherwise pick the most reasonable interpretation and proceed.
