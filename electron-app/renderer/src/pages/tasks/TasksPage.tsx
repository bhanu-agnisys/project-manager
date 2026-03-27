import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Panel } from '../../components/Panel';
import { formatDate, titleCase } from '../../lib/formatters';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Task } from '../../types/workspace';

type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'assignedUserId'
>;

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function TasksPage() {
  const { tasks, users, projects, projectMembers, updateTask } = useWorkspaceStore(
    useShallow((state) => ({
      tasks: state.tasks,
      users: state.users,
      projects: state.projects,
      projectMembers: state.projectMembers,
      updateTask: state.updateTask
    }))
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDraft, setTaskDraft] = useState<TaskDraft | null>(null);

  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const projectMap = useMemo(
    () => new Map(projects.map((project) => [project.id, project])),
    [projects]
  );
  const taskMembersMap = useMemo(
    () =>
      new Map(
        projects.map((project) => [
          project.id,
          projectMembers
            .filter((member) => member.projectId === project.id)
            .map((member) => userMap.get(member.userId))
            .filter(Boolean)
        ])
      ),
    [projectMembers, projects, userMap]
  );

  function startEdit(task: Task) {
    setEditingTaskId(task.id);
    setTaskDraft({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: toDateInputValue(task.dueDate),
      assignedUserId: task.assignedUserId
    });
  }

  function cancelEdit() {
    setEditingTaskId(null);
    setTaskDraft(null);
  }

  function saveTask(taskId: string) {
    if (!taskDraft) {
      return;
    }

    updateTask(taskId, taskDraft);
    cancelEdit();
  }

  const renderTaskList = (items: typeof tasks) => (
    <div className="space-y-3">
      {items.map((task) => (
        <article
          key={task.id}
          className="rounded-2xl border border-border-soft bg-surface-card px-4 py-4"
        >
          {editingTaskId === task.id && taskDraft ? (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="block space-y-2">
                  <span className="text-sm font-medium text-text-muted">Title</span>
                  <input
                    value={taskDraft.title}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current ? { ...current, title: event.target.value } : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-text-muted">Status</span>
                  <select
                    value={taskDraft.status}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current
                          ? { ...current, status: event.target.value as TaskDraft['status'] }
                          : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-text-muted">Priority</span>
                  <select
                    value={taskDraft.priority}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current
                          ? { ...current, priority: event.target.value as TaskDraft['priority'] }
                          : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-medium text-text-muted">Due date</span>
                  <input
                    type="date"
                    value={taskDraft.dueDate}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current ? { ...current, dueDate: event.target.value } : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  />
                </label>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-text-muted">Description</span>
                  <textarea
                    rows={4}
                    value={taskDraft.description}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current ? { ...current, description: event.target.value } : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  />
                </label>

                <label className="block space-y-2 md:col-span-2">
                  <span className="text-sm font-medium text-text-muted">Assignee</span>
                  <select
                    value={taskDraft.assignedUserId || ''}
                    onChange={(event) =>
                      setTaskDraft((current) =>
                        current
                          ? {
                              ...current,
                              assignedUserId: event.target.value || null
                            }
                          : current
                      )
                    }
                    className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
                  >
                    <option value="">Unassigned</option>
                    {(taskMembersMap.get(task.projectId) || []).map((member) => (
                      <option key={member?.id} value={member?.id}>
                        {member?.fullName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-full border border-border-soft bg-surface-panel px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => saveTask(task.id)}
                  className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow"
                >
                  Save Task
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-semibold">{task.title}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                    {titleCase(task.status)}
                  </span>
                  <button
                    type="button"
                    onClick={() => startEdit(task)}
                    className="rounded-full border border-border-soft bg-surface-panel px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-app-text"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <p className="mt-2 text-sm leading-6 text-text-muted">{task.description}</p>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-muted">
                <span>Priority: {titleCase(task.priority)}</span>
                <span>Due: {formatDate(task.dueDate)}</span>
                <span>
                  Assignee:{' '}
                  {task.assignedUserId ? userMap.get(task.assignedUserId)?.fullName : 'Unassigned'}
                </span>
                <span>Project: {projectMap.get(task.projectId)?.name}</span>
              </div>
            </>
          )}
        </article>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Panel eyebrow="Project Delivery" title="Tasks under projects">
        <p className="mb-4 text-sm leading-7 text-text-muted">
          Every task now belongs to a project, which keeps planning, permissions, and delivery history tied to a single workspace.
        </p>
        {renderTaskList(tasks)}
      </Panel>
    </div>
  );
}
