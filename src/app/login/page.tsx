import { LoginForm } from '@/features/auth/components/login-form';
import { StatusRail } from '@/components/motion/status-rail';

export const metadata = {
  title: 'Log in',
};

export default function LoginPage() {
  return (
    <div className="bg-grid flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <span className="text-text-muted font-mono text-xs tracking-widest uppercase">
            Abdelrahman OS
          </span>
          <h1 className="font-display text-text-primary text-2xl font-medium">Welcome back</h1>
          <p className="text-text-secondary text-sm">Log in to reach your command center.</p>
        </div>

        <div className="border-border bg-surface-2 rounded-xl border p-6 shadow-lg">
          <LoginForm />
        </div>

        <div className="mt-6 flex justify-center">
          <StatusRail label="event bus idle" />
        </div>
      </div>
    </div>
  );
}
