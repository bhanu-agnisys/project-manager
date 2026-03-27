import type { ReactNode } from 'react';

type PanelProps = {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, eyebrow, action, children, className = '' }: PanelProps) {
  return (
    <section
      className={`rounded-[1.75rem] border border-border-soft bg-surface-panel p-5 shadow-panel-depth ${className}`.trim()}
    >
      {(title || eyebrow || action) && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
          <div>
            {eyebrow && (
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
                {eyebrow}
              </p>
            )}
            {title && <h2 className="mt-1 text-xl font-bold">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
