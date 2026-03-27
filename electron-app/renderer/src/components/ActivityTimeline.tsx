import type { ActivityLog, User } from '../types/workspace';
import { formatDateTime, titleCase } from '../lib/formatters';

type ActivityTimelineProps = {
  activity: ActivityLog[];
  users: User[];
};

export function ActivityTimeline({ activity, users }: ActivityTimelineProps) {
  const userMap = new Map(users.map((user) => [user.id, user]));

  return (
    <div className="space-y-4">
      {activity.map((entry) => (
        <div
          key={entry.id}
          className="rounded-2xl border border-border-soft bg-surface-card px-4 py-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{titleCase(entry.action)}</p>
              <p className="mt-1 text-sm text-text-muted">
                {userMap.get(entry.performedBy)?.fullName || 'Unknown user'} on{' '}
                {formatDateTime(entry.timestamp)}
              </p>
            </div>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs uppercase tracking-[0.18em] text-text-muted">
              {entry.entityType}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
