import { useShallow } from 'zustand/react/shallow';
import { Panel } from '../../components/Panel';
import { titleCase } from '../../lib/formatters';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function RolesPage() {
  const { designations } = useWorkspaceStore(useShallow((state) => ({
    designations: state.designations
  })));

  return (
    <div className="space-y-6">
      <Panel eyebrow="RBAC" title="Dynamic designation model">
        <p className="text-sm leading-7 text-text-muted">
          Role checks stay permission-based. New designations can be added without changing business logic.
        </p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        {designations.map((designation) => (
          <Panel key={designation.id} eyebrow={designation.key} title={designation.name}>
            <p className="text-sm leading-6 text-text-muted">{designation.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {designation.permissions.map((permission) => (
                <span
                  key={permission}
                  className="rounded-full border border-border-soft bg-surface-card px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-text-muted"
                >
                  {titleCase(permission)}
                </span>
              ))}
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
