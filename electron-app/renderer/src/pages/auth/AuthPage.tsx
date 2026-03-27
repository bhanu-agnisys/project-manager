import { useState } from 'react';
import type { ThemeMode } from '../../types/workspace';

type AuthPageProps = {
  theme: ThemeMode;
  status: 'bootstrapping' | 'guest' | 'authenticated' | 'submitting';
  error: string | null;
  onLogin: (payload: { email: string; password: string }) => Promise<void>;
  onSignup: (payload: { fullName: string; email: string; password: string }) => Promise<void>;
  onToggleTheme: () => void;
};

export function AuthPage({
  theme,
  status,
  error,
  onLogin,
  onSignup,
  onToggleTheme
}: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('bhanu@project-manager.local');
  const [password, setPassword] = useState('Password@123');
  const demoAccounts = [
    {
      label: 'Engineering Manager',
      email: 'asha@project-manager.local'
    },
    {
      label: 'Team Lead',
      email: 'rahul@project-manager.local'
    },
    {
      label: 'Software Engineer',
      email: 'bhanu@project-manager.local'
    },
    {
      label: 'Admin',
      email: 'priya@project-manager.local'
    }
  ];

  const isSubmitting = status === 'submitting' || status === 'bootstrapping';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (mode === 'login') {
      await onLogin({ email, password });
      return;
    }

    await onSignup({ fullName, email, password });
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-bg text-app-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--surface-glow),_transparent_34%),radial-gradient(circle_at_bottom_right,_var(--surface-accent),_transparent_28%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-16">
        <div className="mb-10 space-y-6 lg:mb-0">
          <span className="inline-flex rounded-full border border-border-soft bg-surface-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-text-muted">
            Desktop Project Hub
          </span>

          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-black tracking-tight sm:text-6xl">
              Log in to your projects and keep every task anchored to real delivery.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
              We simplified the product model so projects are the core workspace and tasks always live under them.
              Sign in to continue, or create a new account to join the workspace.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              'Project-first task tracking',
              'Role and permission aware workspace',
              'Desktop-focused planning flow'
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] border border-border-soft bg-surface-panel px-4 py-4 text-sm text-text-muted"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border-soft bg-surface-panel p-6 shadow-panel-depth backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                Authentication
              </p>
              <h2 className="mt-1 text-2xl font-bold">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h2>
            </div>

            <button
              type="button"
              onClick={onToggleTheme}
              className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
            >
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </div>

          <div className="mt-6 inline-flex rounded-full bg-surface-muted p-1">
            {(['login', 'signup'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={[
                  'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
                  mode === option
                    ? 'bg-accent text-accent-contrast'
                    : 'text-text-muted hover:text-app-text'
                ].join(' ')}
              >
                {option === 'login' ? 'Log In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-muted">Full name</span>
                <input
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                  placeholder="Asha Menon"
                  required
                />
              </label>
            )}

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Email</span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                placeholder="name@company.com"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Password</span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                placeholder="At least 8 characters"
                required
              />
            </label>

            {error && (
              <div className="rounded-2xl border border-border-soft bg-surface-card px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast shadow-accent-glow transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? 'Please wait...'
                : mode === 'login'
                  ? 'Log In'
                  : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 rounded-[1.5rem] border border-border-soft bg-surface-card px-4 py-4 text-sm text-text-muted">
            <p className="font-semibold text-app-text">Demo accounts</p>
            <div className="mt-3 space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setEmail(account.email);
                    setPassword('Password@123');
                  }}
                  className="block w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 text-left transition-colors hover:border-accent"
                >
                  <p className="font-semibold text-app-text">{account.label}</p>
                  <p className="mt-1 text-text-muted">{account.email}</p>
                </button>
              ))}
            </div>
            <p className="mt-3">Password for all demo accounts: `Password@123`</p>
          </div>
        </div>
      </section>
    </main>
  );
}
