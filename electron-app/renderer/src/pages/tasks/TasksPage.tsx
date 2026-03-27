import { useEffect, useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { Panel } from '../../components/Panel';
import {
  canAssignTasksInProject,
  canEditTaskInProject,
  getCreatableProjects
} from '../../lib/access';
import { formatDate, titleCase } from '../../lib/formatters';
import { useWorkspaceStore } from '../../store/useWorkspaceStore';
import type { Task } from '../../types/workspace';

type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'assignedUserId'
>;
type NewTaskDraft = TaskDraft & {
  projectId: string;
};

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

export function TasksPage() {
  const { tasks, users, projects, projectMembers, designations, currentUserId, createTask, updateTask, deleteTask } = useWorkspaceStore(
    useShallow((state) => ({
      tasks: state.tasks,
      users: state.users,
      projects: state.projects,
      projectMembers: state.projectMembers,
      designations: state.designations,
      currentUserId: state.currentUserId,
      createTask: state.createTask,
      updateTask: state.updateTask,
      deleteTask: state.deleteTask
    }))
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDraft, setTaskDraft] = useState<TaskDraft | null>(null);
  const creatableProjects = useMemo(
    () => getCreatableProjects(currentUserId, users, designations, projectMembers, projects),
    [currentUserId, users, designations, projectMembers, projects]
  );
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskDraft, setNewTaskDraft] = useState<NewTaskDraft>({
    projectId: creatableProjects[0]?.id || '',
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedUserId: null
  });

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
  const newTaskAssignableUsers = (taskMembersMap.get(newTaskDraft.projectId) || []).filter(Boolean);

  useEffect(() => {
    if (!creatableProjects.length) {
      return;
    }

    const hasSelectedProject = creatableProjects.some(
      (project) => project.id === newTaskDraft.projectId
    );

    if (!hasSelectedProject) {
      resetNewTaskDraft(creatableProjects[0].id);
    }
  }, [creatableProjects, newTaskDraft.projectId]);

  function resetNewTaskDraft(projectId: string) {
    setNewTaskDraft({
      projectId,
      title: '',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: '',
      assignedUserId: null
    });
  }

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

  function handleDeleteTask(taskId: string, title: string) {
    if (!window.confirm(`Delete task "${title}"?`)) {
      return;
    }

    deleteTask(taskId);

    if (editingTaskId === taskId) {
      cancelEdit();
    }
  }

  function handleCreateTask() {
    if (!newTaskDraft.projectId || !newTaskDraft.title.trim() || !newTaskDraft.dueDate) {
      return;
    }

    createTask(newTaskDraft);
    resetNewTaskDraft(newTaskDraft.projectId);
    setIsCreatingTask(false);
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
                    disabled={
                      !canAssignTasksInProject(
                        currentUserId,
                        task.projectId,
                        users,
                        designations,
                        projectMembers
                      )
                    }
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
                  onClick={() => handleDeleteTask(task.id, task.title)}
                  className="rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-500/15 dark:text-red-300"
                >
                  Delete
                </button>
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
                  {canEditTaskInProject(
                    currentUserId,
                    task.projectId,
                    users,
                    designations,
                    projectMembers
                  ) && (
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="rounded-full border border-border-soft bg-surface-panel px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-app-text"
                    >
                      Edit
                    </button>
                  )}
                  {canEditTaskInProject(
                    currentUserId,
                    task.projectId,
                    users,
                    designations,
                    projectMembers
                  ) && (
                    <button
                      type="button"
                      onClick={() => handleDeleteTask(task.id, task.title)}
                      className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition-colors hover:bg-red-500/15 dark:text-red-300"
                    >
                      Delete
                    </button>
                  )}
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
      {isCreatingTask && creatableProjects.length > 0 && (
        <Panel
          eyebrow="New Task"
          title="Create a project task"
          action={
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingTask(false)}
                className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateTask}
                className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow"
              >
                Create Task
              </button>
            </div>
          }
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Project</span>
              <select
                value={newTaskDraft.projectId}
                onChange={(event) => {
                  const nextProjectId = event.target.value;
                  setNewTaskDraft((current) => ({
                    ...current,
                    projectId: nextProjectId,
                    assignedUserId: null
                  }));
                }}
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
              >
                {creatableProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Title</span>
              <input
                value={newTaskDraft.title}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Status</span>
              <select
                value={newTaskDraft.status}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    status: event.target.value as NewTaskDraft['status']
                  }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
              >
                <option value="todo">Todo</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Priority</span>
              <select
                value={newTaskDraft.priority}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    priority: event.target.value as NewTaskDraft['priority']
                  }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
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
                value={newTaskDraft.dueDate}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({ ...current, dueDate: event.target.value }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-text-muted">Description</span>
              <textarea
                rows={4}
                value={newTaskDraft.description}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    description: event.target.value
                  }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="block space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-text-muted">Assignee</span>
              <select
                value={newTaskDraft.assignedUserId || ''}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    assignedUserId: event.target.value || null
                  }))
                }
                disabled={
                  !canAssignTasksInProject(
                    currentUserId,
                    newTaskDraft.projectId,
                    users,
                    designations,
                    projectMembers
                  )
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Unassigned</option>
                {newTaskAssignableUsers.map((member) => (
                  <option key={member?.id} value={member?.id}>
                    {member?.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </Panel>
      )}

      <Panel
        eyebrow="Project Delivery"
        title="Tasks under projects"
        action={
          creatableProjects.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                if (!newTaskDraft.projectId && creatableProjects[0]) {
                  resetNewTaskDraft(creatableProjects[0].id);
                }
                setIsCreatingTask((current) => !current);
              }}
              className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
            >
              {isCreatingTask ? 'Close New Task' : 'New Task'}
            </button>
          ) : null
        }
      >
        <p className="mb-4 text-sm leading-7 text-text-muted">
          Every task now belongs to a project, which keeps planning, permissions, and delivery history tied to a single workspace.
        </p>
        {creatableProjects.length === 0 && (
          <p className="mb-4 rounded-2xl border border-border-soft bg-surface-card px-4 py-3 text-sm text-text-muted">
            You can add tasks only in projects where you are a contributor or admin with task permissions.
          </p>
        )}
        {renderTaskList(tasks)}
      </Panel>
    </div>
  );
}
