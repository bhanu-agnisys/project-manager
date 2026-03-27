type CanvasPreviewProps = {
  canvas: {
    version: number;
    type: string;
    elements: Array<Record<string, string | number>>;
  };
};

export function CanvasPreview({ canvas }: CanvasPreviewProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-[1.5rem] border border-border-soft bg-surface-card p-5">
        <div className="grid min-h-[220px] place-items-center rounded-[1.25rem] border border-dashed border-border-soft bg-[radial-gradient(circle_at_top_left,_var(--surface-glow),_transparent_35%),var(--surface-muted)]">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
              Visual Canvas
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-text-muted">
              Store diagram state as JSON and render it with an Excalidraw-style surface later.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-border-soft bg-surface-card p-5">
        <p className="text-sm font-semibold text-app-text">Stored JSON payload</p>
        <pre className="mt-3 overflow-auto rounded-2xl bg-app-bg p-4 text-xs leading-6 text-text-muted">
          {JSON.stringify(canvas, null, 2)}
        </pre>
      </div>
    </div>
  );
}
