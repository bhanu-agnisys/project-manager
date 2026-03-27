type ThemeMode = 'light' | 'dark';

type WelcomeProps = {
  theme: ThemeMode;
  onToggleTheme: () => void;
};

export default function Welcome({ theme, onToggleTheme }: WelcomeProps) {
  const isDark = theme === 'dark';

  return (
    <main className="relative min-h-screen overflow-hidden bg-app-bg text-app-text">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--surface-glow),_transparent_32%),radial-gradient(circle_at_bottom_right,_var(--surface-accent),_transparent_28%)]" />

      <section className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center px-6 py-10 sm:px-10 lg:px-16">
        <div className="grid w-full gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-6">
            <span className="inline-flex rounded-full border border-border-soft bg-surface-muted px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
              Project Manager
            </span>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-5xl font-black tracking-tight sm:text-6xl">
                Build faster with a workspace that feels right day and night.
              </h1>

              <p className="max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
                This theme setup gives your Electron renderer a persistent light
                and dark mode using Tailwind classes, CSS variables, and a
                simple app-level toggle.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={onToggleTheme}
                className="inline-flex items-center gap-3 rounded-full bg-accent px-5 py-3 text-sm font-semibold text-accent-contrast shadow-accent-glow transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span className="text-xs uppercase tracking-[0.22em]">
                  {isDark ? 'Light' : 'Dark'}
                </span>
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>

              <div className="inline-flex items-center rounded-full border border-border-soft bg-surface-muted px-4 py-3 text-sm text-text-muted">
                Active theme:{' '}
                <span className="ml-2 font-semibold text-app-text">{theme}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border-soft bg-surface-panel p-6 shadow-panel-depth backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-muted">
                  Theme Preview
                </p>
                <h2 className="mt-1 text-2xl font-bold">Renderer Surface</h2>
              </div>

              <div className="flex gap-2">
                <span className="h-3 w-3 rounded-full bg-dot-1" />
                <span className="h-3 w-3 rounded-full bg-dot-2" />
                <span className="h-3 w-3 rounded-full bg-dot-3" />
              </div>
            </div>

            <div className="space-y-4 rounded-[1.5rem] bg-surface-card p-5">
              <div className="rounded-2xl border border-border-soft bg-surface-muted p-4">
                <p className="text-sm text-text-muted">Status</p>
                <p className="mt-1 text-lg font-semibold">
                  Theme tokens are flowing across the app shell.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-border-soft bg-surface-muted p-4">
                  <p className="text-sm text-text-muted">Background</p>
                  <p className="mt-1 font-semibold text-app-text">
                    Adaptive
                  </p>
                </div>

                <div className="rounded-2xl border border-border-soft bg-surface-muted p-4">
                  <p className="text-sm text-text-muted">Persistence</p>
                  <p className="mt-1 font-semibold text-app-text">
                    localStorage
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
