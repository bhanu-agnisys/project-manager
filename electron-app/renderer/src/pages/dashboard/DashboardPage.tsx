import { useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Panel } from '../../components/Panel';
import { ActivityTimeline } from '../../components/ActivityTimeline';
import { formatDate } from '../../lib/formatters';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';

export function DashboardPage() {
  const { currentUserId, users, projects, tasks, activityLogs, designations } = useWorkspaceStore(
    useShallow((state) => ({
      currentUserId: state.currentUserId,
      users: state.users,
      projects: state.projects,
      tasks: state.tasks,
      activityLogs: state.activityLogs,
      designations: state.designations
    }))
  );

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId),
    [currentUserId, users]
  );
  const currentDesignation = useMemo(
    () => designations.find((designation) => designation.id === currentUser?.designationId),
    [currentUser?.designationId, designations]
  );

  const assignedTasks = tasks.filter((task) => task.assignedUserId === currentUserId);
  const activeProjects = projects.filter((project) => project.status === 'in_progress').length;
  const recentActivity = [...activityLogs].sort((left, right) =>
    right.timestamp.localeCompare(left.timestamp)
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Projects', value: `${projects.length}`, hint: `${activeProjects} active now` },
          { label: 'Assigned Tasks', value: `${assignedTasks.length}`, hint: 'Across active project work' },
          { label: 'Teams', value: '2', hint: 'Grouping only, never access control' },
          {
            label: 'Permissions',
            value: `${currentDesignation?.permissions.length || 0}`,
            hint: currentDesignation?.name || 'Current designation'
          }
        ].map((item) => (
          <Panel key={item.label} className="bg-surface-card">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-text-muted">
              {item.label}
            </p>
            <p className="mt-3 text-4xl font-black tracking-tight">{item.value}</p>
            <p className="mt-2 text-sm text-text-muted">{item.hint}</p>
          </Panel>
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.2fr_0.8fr]">
        <Panel eyebrow="My Work" title="Assigned tasks">
          <div className="space-y-3">
            {assignedTasks.map((task) => (
              <article
                key={task.id}
                className="rounded-2xl border border-border-soft bg-surface-card px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-semibold">{task.title}</h3>
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    Due {formatDate(task.dueDate)}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-text-muted">{task.description}</p>
              </article>
            ))}
          </div>
        </Panel>

        <Panel eyebrow="Rules" title="Access model">
          <div className="space-y-3 text-sm leading-7 text-text-muted">
            <p>Designation permissions decide what actions a user can attempt globally.</p>
            <p>Project membership decides what they can do inside a specific project.</p>
            <p>Teams only make bulk assignment easier and never directly grant access.</p>
          </div>
        </Panel>
      </div>

      <Panel eyebrow="Timeline" title="Recent activity">
        <ActivityTimeline activity={recentActivity.slice(0, 6)} users={users} />
      </Panel>
    </div>
  );
}
