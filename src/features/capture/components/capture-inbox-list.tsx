'use client';

import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { InboxIcon } from 'lucide-react';
import { GlassPanel } from '@/components/hud/glass-panel';
import { scanIn, staggerContainer } from '@/components/motion/variants';
import { createClient } from '@/lib/supabase/client';

export const CAPTURE_INBOX_QUERY_KEY = ['capture-inbox'] as const;

interface CaptureInboxRow {
  id: string;
  raw_content: string;
  captured_at: string;
  status: 'untriaged' | 'triaged' | 'discarded';
}

async function fetchInbox(): Promise<CaptureInboxRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('capture_inbox')
    .select('id, raw_content, captured_at, status')
    .eq('status', 'untriaged')
    .order('captured_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

function formatRelativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.round(diffMs / 60_000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export function CaptureInboxList() {
  const { data, isLoading } = useQuery({
    queryKey: CAPTURE_INBOX_QUERY_KEY,
    queryFn: fetchInbox,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="glass-blur border-glass-border bg-glass-2 h-16 animate-pulse rounded-lg border"
          />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="border-glass-border flex flex-col items-center gap-2 rounded-lg border border-dashed py-10 text-center">
        <span className="glow-signal border-signal/30 bg-signal/10 flex size-9 items-center justify-center rounded-full border">
          <InboxIcon className="text-signal-strong size-4" aria-hidden="true" />
        </span>
        <p className="text-text-secondary mt-1 text-sm">Your inbox is empty.</p>
        <p className="text-text-muted text-xs">
          Press <span className="font-mono">⇧⌘N</span> anywhere to capture a thought.
        </p>
      </div>
    );
  }

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={staggerContainer()}
      className="flex flex-col gap-2"
    >
      <AnimatePresence initial={false}>
        {data.map((item) => (
          <motion.li key={item.id} variants={scanIn} layout>
            <GlassPanel level={2} className="p-4">
              <p className="text-text-primary text-sm leading-relaxed">{item.raw_content}</p>
              <p className="text-text-muted mt-2 font-mono text-[11px]">
                {formatRelativeTime(item.captured_at)} · untriaged
              </p>
            </GlassPanel>
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
