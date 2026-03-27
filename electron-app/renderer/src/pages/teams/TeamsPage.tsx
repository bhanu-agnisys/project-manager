import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Panel } from '../../components/Panel';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function TeamsPage() {
  const { teams, users } = useWorkspaceStore(useShallow((state) => ({
    teams: state.teams,
    users: state.users
  })));

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  return (
    <div className="space-y-6">
      <Panel eyebrow="Grouping" title="Team structure">
        <p className="text-sm leading-7 text-text-muted">
          Teams simplify assignment and planning, but never replace project membership for access control.
        </p>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        {teams.map((team) => (
          <Panel key={team.id} eyebrow="Team" title={team.name}>
            <div className="space-y-4">
              <p className="text-sm leading-6 text-text-muted">{team.description}</p>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-surface-card px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Manager</p>
                  <p className="mt-2 font-semibold">{userMap.get(team.managerId)?.fullName}</p>
                </div>
                <div className="rounded-2xl bg-surface-card px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Lead</p>
                  <p className="mt-2 font-semibold">
                    {team.leadId ? userMap.get(team.leadId)?.fullName : 'Unassigned'}
                  </p>
                </div>
                <div className="rounded-2xl bg-surface-card px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Members</p>
                  <p className="mt-2 font-semibold">{team.memberIds.length}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border-soft bg-surface-card p-4">
                <p className="text-sm font-semibold">Members</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {team.memberIds.map((memberId) => (
                    <span
                      key={memberId}
                      className="rounded-full bg-surface-muted px-3 py-2 text-sm text-text-muted"
                    >
                      {userMap.get(memberId)?.fullName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
