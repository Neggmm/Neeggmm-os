'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { useActionState } from 'react';
import { signInWithPassword } from '@/features/auth/actions/sign-in';
import { signUpWithPassword } from '@/features/auth/actions/sign-up';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="primary" className="w-full" disabled={pending}>
      {pending ? 'Working…' : label}
    </Button>
  );
}

export function LoginForm() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const [signInState, signInAction] = useActionState(signInWithPassword, {});
  const [signUpState, signUpAction] = useActionState(signUpWithPassword, {});

  const state = mode === 'sign-in' ? signInState : signUpState;
  const action = mode === 'sign-in' ? signInAction : signUpAction;

  return (
    <form action={action} className="flex flex-col gap-4">
      {mode === 'sign-up' && (
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="fullName">Name</Label>
          <Input id="fullName" name="fullName" placeholder="Abdelrahman" autoComplete="name" />
        </div>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          required
        />
      </div>

      {state.error && (
        <p role="alert" className="text-danger text-sm">
          {state.error}
        </p>
      )}

      {mode === 'sign-up' && state.success && (
        <p className="text-success text-sm">
          Account created. Check your email if confirmation is required, then log in.
        </p>
      )}

      <SubmitButton label={mode === 'sign-in' ? 'Log in' : 'Create account'} />

      <button
        type="button"
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
        className="text-text-muted hover:text-text-secondary text-center text-sm transition-colors"
      >
        {mode === 'sign-in' ? "Don't have an account? Sign up" : 'Already have an account? Log in'}
      </button>
    </form>
  );
}
