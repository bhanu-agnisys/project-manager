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
            <span className="text-sm font-medium text-text-muted">Comment target</span>
            <select
              value={selectedTaskId}
              onChange={(event) => setSelectedTaskId(event.target.value)}
              disabled={!canComment}
              className="w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 outline-none transition-colors focus:border-accent disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Project discussion</option>
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
            Comments can stay at the project level or be attached to a task inside this project.
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
        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-2xl border border-border-soft bg-surface-card px-4 py-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-semibold">
                  {userMap.get(comment.createdBy)?.fullName || 'Unknown user'}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {comment.taskId
                    ? `Task: ${taskMap.get(comment.taskId)?.title || 'Unknown task'}`
                    : 'Project discussion'}
                </p>
              </div>
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">
                {formatDateTime(comment.createdAt)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-app-text">{comment.body}</p>
          </article>
        ))}

        {comments.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border-soft bg-surface-card px-4 py-6 text-sm text-text-muted">
            No comments yet for this project.
          </div>
        )}
      </div>
    </div>
  );
}
