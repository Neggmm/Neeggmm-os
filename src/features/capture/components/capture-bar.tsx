'use client';

import { useQueryClient } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { captureRaw } from '@/features/capture/actions/capture-raw';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Kbd } from '@/components/ui/kbd';
import { Textarea } from '@/components/ui/textarea';
import { useKeyboardShortcut } from '@/lib/hooks/use-keyboard-shortcut';
import { CAPTURE_INBOX_QUERY_KEY } from '@/features/capture/components/capture-inbox-list';

export function CaptureBar() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const queryClient = useQueryClient();

  useKeyboardShortcut({
    key: 'n',
    ctrlOrCmd: true,
    shift: true,
    handler: () => setOpen(true),
  });

  function handleSubmit() {
    const content = value.trim();
    if (!content) return;

    startTransition(async () => {
      const result = await captureRaw(content);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setValue('');
      setOpen(false);
      toast.success('Captured');
      queryClient.invalidateQueries({ queryKey: CAPTURE_INBOX_QUERY_KEY });
    });
  }

  return (
    <>
      <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
        <PlusIcon />
        Capture
        <Kbd className="text-signal-foreground/80 ml-1 hidden bg-black/15 sm:inline-flex">⇧⌘N</Kbd>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Quick capture</DialogTitle>
            <DialogDescription>
              Write it down before it&apos;s gone. It lands in your inbox untriaged — sort it out
              later.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            autoFocus
            rows={4}
            placeholder="What's on your mind?"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                handleSubmit();
              }
            }}
          />

          <div className="flex items-center justify-between">
            <span className="text-text-muted font-mono text-xs">⌘/Ctrl + Enter to save</span>
            <Button variant="primary" onClick={handleSubmit} disabled={isPending || !value.trim()}>
              {isPending ? 'Saving…' : 'Save to inbox'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
