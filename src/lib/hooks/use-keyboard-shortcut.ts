'use client';

import { useEffect } from 'react';

interface ShortcutOptions {
  key: string;
  ctrlOrCmd?: boolean;
  shift?: boolean;
  handler: () => void;
  /** Skip while the event target is an editable field, unless explicitly allowed. */
  allowInInputs?: boolean;
}

/**
 * Registers a global keyboard shortcut for as long as the calling
 * component is mounted. Used for the Quick Capture bar's Ctrl/Cmd+Shift+N,
 * but written generically so future global shortcuts (command palette,
 * etc.) can reuse it.
 */
export function useKeyboardShortcut({
  key,
  ctrlOrCmd = false,
  shift = false,
  handler,
  allowInInputs = false,
}: ShortcutOptions) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const isEditableTarget =
        target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA' || target?.isContentEditable;

      if (isEditableTarget && !allowInInputs) return;

      const modifierMatches = ctrlOrCmd ? event.metaKey || event.ctrlKey : true;
      const shiftMatches = shift ? event.shiftKey : true;
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();

      if (keyMatches && modifierMatches && shiftMatches) {
        event.preventDefault();
        handler();
      }
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, ctrlOrCmd, shift, handler, allowInInputs]);
}
