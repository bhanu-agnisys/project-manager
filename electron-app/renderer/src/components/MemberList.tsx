import type { ProjectMember, Team, User } from '../types/workspace';

type MemberListProps = {
  members: ProjectMember[];
  users: User[];
  teams: Team[];
};

export function MemberList({ members, users, teams }: MemberListProps) {
  const userMap = new Map(users.map((user) => [user.id, user]));
  const teamMap = new Map(teams.map((team) => [team.id, team]));
  const grouped = {
    team: members.filter((member) => member.addedVia === 'team'),
    manual: members.filter((member) => member.addedVia === 'manual')
  };

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {(['team', 'manual'] as const).map((mode) => (
        <div key={mode} className="rounded-[1.5rem] border border-border-soft bg-surface-card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-text-muted">
            Added via {mode}
          </h3>
          <div className="mt-4 space-y-3">
            {grouped[mode].map((member) => (
              <div
                key={member.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface-muted px-4 py-3"
              >
                <div>
                  <p className="font-semibold">
                    {userMap.get(member.userId)?.fullName || 'Unknown user'}
                  </p>
                  <p className="text-sm text-text-muted">
                    {mode === 'team' && member.sourceTeamId
                      ? teamMap.get(member.sourceTeamId)?.name
                      : 'Direct project assignment'}
                  </p>
                </div>
                <span className="rounded-full bg-surface-card px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-muted">
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
