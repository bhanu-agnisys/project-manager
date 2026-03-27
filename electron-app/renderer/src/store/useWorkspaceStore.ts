import { create } from 'zustand';
import { mockWorkspace } from '../data/mockWorkspace';
import type { AuthUser } from '../types/auth';
import type {
  ActivityLog,
  Project,
  Task,
  TaskStatus,
  WorkspaceSnapshot
} from '../types/workspace';

type ProjectUpdateInput = Pick<Project, 'name' | 'key' | 'status' | 'description'>;
type TaskUpdateInput = Pick<
  Task,
  'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'assignedUserId'
>;
type CommentInput = {
  projectId: string;
  taskId?: string | null;
  body: string;
};

type WorkspaceState = WorkspaceSnapshot & {
  currentUserId: string;
  activeProjectId: string;
  setActiveProject: (projectId: string) => void;
  moveTask: (taskId: string, status: TaskStatus) => void;
  updateProject: (projectId: string, updates: ProjectUpdateInput) => void;
  updateTask: (taskId: string, updates: TaskUpdateInput) => void;
  addComment: (input: CommentInput) => void;
  syncAuthenticatedUser: (user: AuthUser) => void;
  clearAuthenticatedUser: () => void;
};

function cloneWorkspace(): WorkspaceSnapshot {
  return {
    designations: [...mockWorkspace.designations],
    users: [...mockWorkspace.users],
    teams: [...mockWorkspace.teams],
    projects: [...mockWorkspace.projects],
    projectMembers: [...mockWorkspace.projectMembers],
    tasks: [...mockWorkspace.tasks],
    comments: [...mockWorkspace.comments],
    activityLogs: [...mockWorkspace.activityLogs]
  };
}

function makeId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normaliseDueDate(value: string) {
  if (value.includes('T')) {
    return value;
  }

  return new Date(`${value}T00:00:00.000Z`).toISOString();
}

function makeTimelineEvent(
  entityType: ActivityLog['entityType'],
  entityId: string,
  action: string,
  performedBy: string,
  metadata: Record<string, string> = {}
): ActivityLog {
  return {
    id: makeId('act'),
    entityType,
    entityId,
    action,
    performedBy,
    timestamp: new Date().toISOString(),
    metadata
  };
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  ...cloneWorkspace(),
  currentUserId: '',
  activeProjectId: 'proj_1',
  setActiveProject: (projectId) => {
    set({ activeProjectId: projectId });
  },
  moveTask: (taskId, status) => {
    set((state) => {
      const targetTask = state.tasks.find((task) => task.id === taskId);

      if (!targetTask || targetTask.status === status) {
        return state;
      }

      return {
        tasks: state.tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
        activityLogs: [
          makeTimelineEvent('task', taskId, 'task_status_changed', state.currentUserId, {
            from: targetTask.status,
            to: status
          }),
          ...state.activityLogs
        ]
      };
    });
  },
  updateProject: (projectId, updates) => {
    set((state) => {
      const currentProject = state.projects.find((project) => project.id === projectId);

      if (!currentProject) {
        return state;
      }

      return {
        projects: state.projects.map((project) =>
          project.id === projectId ? { ...project, ...updates } : project
        ),
        activityLogs: [
          makeTimelineEvent('project', projectId, 'project_updated', state.currentUserId, {
            name: updates.name,
            status: updates.status
          }),
          ...state.activityLogs
        ]
      };
    });
  },
  updateTask: (taskId, updates) => {
    set((state) => {
      const currentTask = state.tasks.find((task) => task.id === taskId);

      if (!currentTask) {
        return state;
      }

      const nextTask = {
        ...currentTask,
        ...updates,
        dueDate: normaliseDueDate(updates.dueDate)
      };

      return {
        tasks: state.tasks.map((task) => (task.id === taskId ? nextTask : task)),
        activityLogs: [
          makeTimelineEvent('task', taskId, 'task_updated', state.currentUserId, {
            title: nextTask.title,
            status: nextTask.status
          }),
          ...state.activityLogs
        ]
      };
    });
  },
  addComment: ({ projectId, taskId = null, body }) => {
    set((state) => {
      const trimmedBody = body.trim();

      if (!trimmedBody) {
        return state;
      }

      const targetProject = state.projects.find((project) => project.id === projectId);
      const targetTask = taskId ? state.tasks.find((task) => task.id === taskId) : null;

      if (!targetProject) {
        return state;
      }

      if (taskId && (!targetTask || targetTask.projectId !== projectId)) {
        return state;
      }

      const nextComment = {
        id: makeId('comment'),
        projectId,
        taskId,
        body: trimmedBody,
        createdBy: state.currentUserId,
        createdAt: new Date().toISOString()
      };

      return {
        comments: [nextComment, ...state.comments],
        activityLogs: [
          makeTimelineEvent(
            taskId ? 'task' : 'project',
            taskId || projectId,
            'comment_added',
            state.currentUserId,
            {
              commentId: nextComment.id,
              commentTarget: taskId ? 'task' : 'project'
            }
          ),
          ...state.activityLogs
        ]
      };
    });
  },
  syncAuthenticatedUser: (user) => {
    set((state) => {
      const existingUser = state.users.find((item) => item.id === user.id);

      return {
        currentUserId: user.id,
        users: existingUser
          ? state.users.map((item) =>
              item.id === user.id
                ? {
                    ...item,
                    fullName: user.fullName,
                    email: user.email,
                    designationId: user.designationId,
                    title: user.title
                  }
                : item
            )
          : [
              {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                designationId: user.designationId,
                title: user.title
              },
              ...state.users
            ]
      };
    });
  },
  clearAuthenticatedUser: () => {
    set({ currentUserId: '' });
  }
}));
