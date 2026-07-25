import { AppShell } from '@/components/shell/app-shell';
import { createClient } from '@/lib/supabase/server';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // middleware.ts already redirects unauthenticated requests to /login
  // before this layout renders — user should always be present here.
  return <AppShell userEmail={user?.email}>{children}</AppShell>;
}
