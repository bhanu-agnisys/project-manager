import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { ActivityTimeline } from '../../components/ActivityTimeline';
import { CanvasPreview } from '../../components/CanvasPreview';
import { KanbanBoard } from '../../components/KanbanBoard';
import { MemberList } from '../../components/MemberList';
import { Panel } from '../../components/Panel';
import { ProjectComments } from '../../components/ProjectComments';
import { titleCase } from '../../lib/formatters';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { ProjectStatus } from '../../types/workspace';

const statusStyles: Record<string, string> = {
  planning: 'bg-surface-muted text-text-muted',
  in_progress: 'bg-accent text-accent-contrast',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  scrapped: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
};

export function ProjectsPage() {
  const {
    projects,
    activeProjectId,
    projectMembers,
    tasks,
    teams,
    users,
    comments,
    activityLogs,
    currentUserId,
    updateProject,
    addComment
  } = useWorkspaceStore(
    useShallow((state) => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      projectMembers: state.projectMembers,
      tasks: state.tasks,
      teams: state.teams,
      users: state.users,
      comments: state.comments,
      activityLogs: state.activityLogs,
      currentUserId: state.currentUserId,
      updateProject: state.updateProject,
      addComment: state.addComment
    }))
  );
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [projectDraft, setProjectDraft] = useState<{
    name: string;
    key: string;
    status: ProjectStatus;
    description: string;
  }>({
    name: '',
    key: '',
    status: 'planning',
    description: ''
  });

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) || projects[0],
    [activeProjectId, projects]
  );

  useEffect(() => {
    setProjectDraft({
      name: activeProject.name,
      key: activeProject.key,
      status: activeProject.status,
      description: activeProject.description
    });
    setIsEditingProject(false);
  }, [activeProject]);

  const projectTasks = tasks.filter((task) => task.projectId === activeProject.id);
  const members = projectMembers.filter((member) => member.projectId === activeProject.id);
  const projectComments = comments
    .filter((comment) => comment.projectId === activeProject.id)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  const canComment = members.some((member) => member.userId === currentUserId);
  const timeline = activityLogs
    .filter((log) => {
      if (log.entityType === 'project' && log.entityId === activeProject.id) {
        return true;
      }
      if (log.entityType === 'project_member') {
        return members.some((member) => member.id === log.entityId);
      }
      return projectTasks.some((task) => task.id === log.entityId);
    })
    .sort((left, right) => right.timestamp.localeCompare(left.timestamp));

  function handleProjectSave() {
    updateProject(activeProject.id, projectDraft);
    setIsEditingProject(false);
  }

  return (
    <div className="space-y-6">
      <Panel
        title="Projects"
        action={
          <div className="flex flex-wrap gap-2">
            {isEditingProject ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setProjectDraft({
                      name: activeProject.name,
                      key: activeProject.key,
                      status: activeProject.status,
                      description: activeProject.description
                    });
                    setIsEditingProject(false);
                  }}
                  className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProjectSave}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow"
                >
                  Save Project
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingProject(true)}
                className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
              >
                Edit Project
              </button>
            )}
          </div>
        }
      >
        <div className="rounded-[1.5rem] bg-surface-card px-5 py-5">
          {isEditingProject ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-muted">Project name</span>
                <input
                  value={projectDraft.name}
                  onChange={(event) =>
                    setProjectDraft((current) => ({ ...current, name: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-muted">Project key</span>
                <input
                  value={projectDraft.key}
                  onChange={(event) =>
                    setProjectDraft((current) => ({
                      ...current,
                      key: event.target.value.toUpperCase()
                    }))
                  }
                  className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                />
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-medium text-text-muted">Status</span>
                <select
                  value={projectDraft.status}
                  onChange={(event) =>
                    setProjectDraft((current) => ({
                      ...current,
                      status: event.target.value as typeof current.status
                    }))
                  }
                  className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="scrapped">Scrapped</option>
                </select>
              </label>

              <div className="md:col-span-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-text-muted">Description</span>
                  <textarea
                    rows={4}
                    value={projectDraft.description}
                    onChange={(event) =>
                      setProjectDraft((current) => ({
                        ...current,
                        description: event.target.value
                      }))
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  />
                </label>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {activeProject.key}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold">{activeProject.name}</h3>
                </div>
                <span
                  className={[
                    'rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em]',
                    statusStyles[activeProject.status] || 'bg-surface-muted text-text-muted'
                  ].join(' ')}
                >
                  {titleCase(activeProject.status)}
                </span>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-text-muted">
                {activeProject.description}
              </p>
            </>
          )}
        </div>
      </Panel>

      <div className="mx-auto w-full max-w-5xl space-y-6">
        <Panel eyebrow="Overview" title="Project summary">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-surface-card px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Teams</p>
              <p className="mt-2 text-3xl font-black">{activeProject.teamIds.length}</p>
            </div>
            <div className="rounded-2xl bg-surface-card px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Members</p>
              <p className="mt-2 text-3xl font-black">{members.length}</p>
            </div>
            <div className="rounded-2xl bg-surface-card px-4 py-4">
              <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Tasks</p>
              <p className="mt-2 text-3xl font-black">{projectTasks.length}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            Removing a team from a project does not automatically remove users. Membership stays explicit and auditable.
          </p>
        </Panel>

        <Panel eyebrow="Delivery" title="Kanban board">
          <KanbanBoard tasks={projectTasks} users={users} />
        </Panel>

        <Panel eyebrow="Canvas" title="Visual planning space">
          <CanvasPreview canvas={activeProject.canvas} />
        </Panel>

        <Panel eyebrow="Access" title="Project members">
          <MemberList members={members} users={users} teams={teams} />
        </Panel>

        <Panel eyebrow="Discussion" title="Project comments">
          <ProjectComments
            comments={projectComments}
            tasks={projectTasks}
            users={users}
            canComment={canComment}
            onAddComment={addComment}
            projectId={activeProject.id}
          />
        </Panel>

        <Panel eyebrow="Audit Trail" title="Project timeline">
          <ActivityTimeline activity={timeline} users={users} />
        </Panel>
      </div>
    </div>
  );
}
