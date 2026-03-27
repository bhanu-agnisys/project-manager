import { useMemo, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { formatDate, titleCase } from '../lib/formatters';
import type { Task, TaskStatus, User } from '../types/workspace';

type TaskDraft = Pick<
  Task,
  'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'assignedUserId'
>;

type KanbanBoardProps = {
  projectId: string;
  tasks: Task[];
  users: User[];
  assignableUsers: User[];
  canMoveTasks?: boolean;
  canAssignTasks?: boolean;
};

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

function toDateInputValue(value: string) {
  return value.slice(0, 10);
}

function createEmptyDraft(): TaskDraft {
  return {
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedUserId: null
  };
}

export function KanbanBoard({
  projectId,
  tasks,
  users,
  assignableUsers,
  canMoveTasks = true,
  canAssignTasks = true
}: KanbanBoardProps) {
  const { moveTask, createTask, updateTask, deleteTask } = useWorkspaceStore(
    useShallow((state) => ({
      moveTask: state.moveTask,
      createTask: state.createTask,
      updateTask: state.updateTask,
      deleteTask: state.deleteTask
    }))
  );
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskDraft, setTaskDraft] = useState<TaskDraft | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [newTaskDraft, setNewTaskDraft] = useState<TaskDraft>(createEmptyDraft);
  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

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
    if (!newTaskDraft.title.trim() || !newTaskDraft.dueDate) {
      return;
    }

    createTask({
      projectId,
      ...newTaskDraft
    });
    setNewTaskDraft(createEmptyDraft());
    setIsCreatingTask(false);
  }

  return (
    <div className="space-y-4">
      {canMoveTasks && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsCreatingTask((current) => !current)}
            className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
          >
            {isCreatingTask ? 'Close New Task' : 'New Task'}
          </button>
        </div>
      )}

      {isCreatingTask && canMoveTasks && (
        <div className="rounded-[1.5rem] border border-border-soft bg-surface-card p-4">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">
                Board Task
              </p>
              <h3 className="mt-1 text-lg font-bold">Create task in this project</h3>
            </div>
            <button
              type="button"
              onClick={handleCreateTask}
              className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow"
            >
              Add Task
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Title</span>
              <input
                value={newTaskDraft.title}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({ ...current, title: event.target.value }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-text-muted">Status</span>
              <select
                value={newTaskDraft.status}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    status: event.target.value as TaskDraft['status']
                  }))
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
                value={newTaskDraft.priority}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({
                    ...current,
                    priority: event.target.value as TaskDraft['priority']
                  }))
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
                value={newTaskDraft.dueDate}
                onChange={(event) =>
                  setNewTaskDraft((current) => ({ ...current, dueDate: event.target.value }))
                }
                className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
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
                className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent"
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
                disabled={!canAssignTasks}
                className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Unassigned</option>
                {assignableUsers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.fullName}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-3">
        {columns.map((column) => (
          <div
            key={column.key}
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();
              if (!canMoveTasks) {
                return;
              }
              const taskId = event.dataTransfer.getData('text/task-id');
              if (taskId) {
                moveTask(taskId, column.key);
              }
            }}
            className="rounded-[1.5rem] border border-border-soft bg-surface-card p-4"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-text-muted">
                {column.label}
              </h3>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                {tasks.filter((task) => task.status === column.key).length}
              </span>
            </div>

            <div className="space-y-3">
              {tasks
                .filter((task) => task.status === column.key)
                .map((task) => (
                  <article
                    key={task.id}
                    draggable={canMoveTasks}
                    onDragStart={(event) => {
                      if (!canMoveTasks) {
                        return;
                      }
                      event.dataTransfer.setData('text/task-id', task.id);
                    }}
                    className={[
                      'rounded-2xl border border-border-soft bg-surface-panel p-4 transition-transform hover:-translate-y-0.5',
                      canMoveTasks ? 'cursor-grab' : 'cursor-default'
                    ].join(' ')}
                  >
                    {editingTaskId === task.id && taskDraft ? (
                      <div className="space-y-4">
                        <div className="grid gap-4">
                          <label className="block space-y-2">
                            <span className="text-sm font-medium text-text-muted">Title</span>
                            <input
                              value={taskDraft.title}
                              onChange={(event) =>
                                setTaskDraft((current) =>
                                  current ? { ...current, title: event.target.value } : current
                                )
                              }
                              className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                            />
                          </label>

                          <label className="block space-y-2">
                            <span className="text-sm font-medium text-text-muted">Description</span>
                            <textarea
                              rows={3}
                              value={taskDraft.description}
                              onChange={(event) =>
                                setTaskDraft((current) =>
                                  current
                                    ? { ...current, description: event.target.value }
                                    : current
                                )
                              }
                              className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                            />
                          </label>

                          <label className="block space-y-2">
                            <span className="text-sm font-medium text-text-muted">Priority</span>
                            <select
                              value={taskDraft.priority}
                              onChange={(event) =>
                                setTaskDraft((current) =>
                                  current
                                    ? {
                                        ...current,
                                        priority: event.target.value as TaskDraft['priority']
                                      }
                                    : current
                                )
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
                              value={taskDraft.dueDate}
                              onChange={(event) =>
                                setTaskDraft((current) =>
                                  current ? { ...current, dueDate: event.target.value } : current
                                )
                              }
                              className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent"
                            />
                          </label>

                          <label className="block space-y-2">
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
                              disabled={!canAssignTasks}
                              className="w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <option value="">Unassigned</option>
                              {assignableUsers.map((member) => (
                                <option key={member.id} value={member.id}>
                                  {member.fullName}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-full border border-border-soft bg-surface-card px-4 py-2 text-sm font-semibold text-text-muted transition-colors hover:text-app-text"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveTask(task.id)}
                            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-text-muted">
                            {titleCase(task.priority)}
                          </span>
                          <span className="text-xs text-text-muted">{formatDate(task.dueDate)}</span>
                        </div>
                        <h4 className="mt-3 text-base font-semibold">{task.title}</h4>
                        <p className="mt-2 text-sm leading-6 text-text-muted">{task.description}</p>
                        <p className="mt-3 text-xs font-medium text-text-muted">
                          Assigned to {task.assignedUserId ? userMap.get(task.assignedUserId)?.fullName : 'Unassigned'}
                        </p>
                        {canMoveTasks && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => startEdit(task)}
                              className="rounded-full border border-border-soft bg-surface-card px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-app-text"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteTask(task.id, task.title)}
                              className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-red-600 transition-colors hover:bg-red-500/15 dark:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </article>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
