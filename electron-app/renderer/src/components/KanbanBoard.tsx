import { useMemo } from 'react';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import { formatDate, titleCase } from '../lib/formatters';
import type { Task, TaskStatus, User } from '../types/workspace';

type KanbanBoardProps = {
  tasks: Task[];
  users: User[];
};

const columns: Array<{ key: TaskStatus; label: string }> = [
  { key: 'todo', label: 'Todo' },
  { key: 'in_progress', label: 'In Progress' },
  { key: 'done', label: 'Done' }
];

export function KanbanBoard({ tasks, users }: KanbanBoardProps) {
  const moveTask = useWorkspaceStore((state) => state.moveTask);
  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {columns.map((column) => (
        <div
          key={column.key}
          onDragOver={(event) => {
            event.preventDefault();
          }}
          onDrop={(event) => {
            event.preventDefault();
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
                  draggable
                  onDragStart={(event) => {
                    event.dataTransfer.setData('text/task-id', task.id);
                  }}
                  className="cursor-grab rounded-2xl border border-border-soft bg-surface-panel p-4 transition-transform hover:-translate-y-0.5"
                >
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
                </article>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
