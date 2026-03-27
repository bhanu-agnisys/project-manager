import { useMemo, useState } from 'react';
import { formatDateTime } from '../lib/formatters';
import type { Comment, Task, User } from '../types/workspace';

type ProjectCommentsProps = {
  comments: Comment[];
  tasks: Task[];
  users: User[];
  canComment: boolean;
  onAddComment: (input: { projectId: string; taskId?: string | null; body: string }) => void;
  projectId: string;
};

export function ProjectComments({
  comments,
  tasks,
  users,
  canComment,
  onAddComment,
  projectId
}: ProjectCommentsProps) {
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [body, setBody] = useState('');
  const userMap = useMemo(() => new Map(users.map((user) => [user.id, user])), [users]);
  const taskMap = useMemo(() => new Map(tasks.map((task) => [task.id, task])), [tasks]);
  const visibleComments = useMemo(
    () =>
      selectedTaskId
        ? comments.filter((comment) => comment.taskId === selectedTaskId)
        : comments,
    [comments, selectedTaskId]
  );

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!canComment || !body.trim()) {
      return;
    }

    onAddComment({
      projectId,
      taskId: selectedTaskId || null,
      body
    });
    setBody('');
    setSelectedTaskId('');
  }

  return (
    <div className="space-y-5">
      <form className="space-y-4 rounded-[1.5rem] bg-surface-card p-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-[220px_1fr]">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-muted">Selected discussion</span>
            <select
              value={selectedTaskId}
              onChange={(event) => setSelectedTaskId(event.target.value)}
              disabled={!canComment}
              className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Project timeline</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-text-muted">Comment</span>
            <textarea
              value={body}
              onChange={(event) => setBody(event.target.value)}
              disabled={!canComment}
              rows={4}
              className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
              placeholder={
                canComment
                  ? 'Share an update, question, or decision here.'
                  : 'You need project membership to comment.'
              }
            />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            Choose a task to focus its discussion, or leave it on the project to see the full comment timeline.
          </p>
          <button
            type="submit"
            disabled={!canComment || !body.trim()}
            className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-contrast shadow-accent-glow transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Add Comment
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {visibleComments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-2xl border border-border-soft bg-surface-card px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">
                    {userMap.get(comment.createdBy)?.fullName || 'Unknown user'}
                  </p>
                  {comment.taskId ? (
                    <span className="rounded-full bg-accent/12 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent">
                      {taskMap.get(comment.taskId)?.title || 'Unknown task'}
                    </span>
                  ) : (
                    <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                      Project
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-text-muted">
                  {comment.taskId ? 'Task discussion' : 'Project discussion'}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                {formatDateTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-app-text">{comment.body}</p>
          </article>
        ))}

        {visibleComments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-card px-4 py-6 text-sm text-text-muted">
            {selectedTaskId ? 'No comments yet for the selected task.' : 'No comments yet for this project.'}
          </div>
        )}
      </div>
    </div>
  );
}
