import { LogOutIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { signOut } from '@/features/auth/actions/sign-out';
import { CaptureBar } from '@/features/capture/components/capture-bar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { GlowBadge } from '@/components/hud/glow-badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export function Topbar({ userEmail }: { userEmail?: string | null }) {
  const initial = userEmail?.trim()?.[0]?.toUpperCase() ?? '?';

  return (
    <header className="glass-blur border-glass-border bg-glass-1 flex h-14 shrink-0 items-center justify-between border-b px-5">
      <div className="flex items-center gap-3">
        <span className="text-text-muted font-mono text-xs tracking-widest uppercase">
          Life Command Center
        </span>
        <GlowBadge accent="success" pulse>
          Online
        </GlowBadge>
      </div>

      <div className="flex items-center gap-3">
        {/* Reserved slot for the floating AI assistant trigger (Milestone 8).
            Present now so the shell already reads as "AI-resident"; wired later. */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              disabled
              className="glow-cognition border-cognition/30 bg-cognition/10 text-cognition-strong flex size-9 cursor-not-allowed items-center justify-center rounded-full border opacity-60"
            >
              <SparklesIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>AI Assistant — coming online</TooltipContent>
        </Tooltip>

        <CaptureBar />

        <DropdownMenu>
          <DropdownMenuTrigger className="focus-visible:outline-signal rounded-full outline-none focus-visible:outline-2 focus-visible:outline-offset-2">
            <Avatar>
              <AvatarFallback>
                {initial === '?' ? <UserIcon className="size-4" /> : initial}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="text-text-muted px-2 py-1.5 text-xs">{userEmail}</div>
            <form action={signOut}>
              <DropdownMenuItem asChild variant="destructive">
                <button type="submit" className="w-full">
                  <LogOutIcon />
                  Log out
                </button>
              </DropdownMenuItem>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
