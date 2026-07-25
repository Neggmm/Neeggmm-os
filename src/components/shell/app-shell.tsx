import { Sidebar } from '@/components/shell/sidebar';
import { Topbar } from '@/components/shell/topbar';

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail?: string | null;
}) {
  return (
    <div className="bg-grid bg-ambient relative flex min-h-screen">
      {/* Vignette for depth — darkens edges so glass panels read as floating
          above the void rather than sitting on a flat plane. */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_120%_100%_at_50%_0%,transparent_40%,var(--background)_100%)]" />

      <Sidebar />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <Topbar userEmail={userEmail} />
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-10">
          <div className="mx-auto w-full max-w-4xl">{children}</div>
        </main>
      </div>

      {/* Mount point for the floating AI assistant (Milestone 8). Portaled
          into so it can render above all shell chrome regardless of scroll
          context. Empty until the assistant feature registers into it. */}
      <div id="assistant-portal-root" className="relative z-50" />
    </div>
  );
}
