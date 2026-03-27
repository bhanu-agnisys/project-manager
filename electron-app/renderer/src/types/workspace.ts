export type ThemeMode = 'light' | 'dark';

export type Permission =
  | 'create_project'
  | 'view_all_projects'
  | 'manage_project_members'
  | 'manage_project_settings'
  | 'create_task'
  | 'update_any_task'
  | 'assign_tasks'
  | 'manage_team'
  | 'manage_designations'
  | 'view_activity'
  | 'manage_canvas';

export type ProjectMemberRole = 'viewer' | 'contributor' | 'admin';
export type ProjectStatus = 'planning' | 'in_progress' | 'completed' | 'scrapped';
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type CommentTargetType = 'project' | 'task';

export type Designation = {
  id: string;
  name: string;
  key: string;
  description: string;
  permissions: Permission[];
};

export type User = {
  id: string;
  fullName: string;
  email: string;
  designationId: string;
  title: string;
};

export type Team = {
  id: string;
  name: string;
  managerId: string;
  leadId: string | null;
  memberIds: string[];
  description: string;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  status: ProjectStatus;
  description: string;
  teamIds: string[];
  canvas: {
    version: number;
    type: string;
    elements: Array<Record<string, string | number>>;
  };
};

export type ProjectMember = {
  id: string;
  projectId: string;
  userId: string;
  role: ProjectMemberRole;
  addedVia: 'team' | 'manual';
  sourceTeamId?: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  projectId: string;
  assignedUserId: string | null;
  createdBy: string;
  labels: string[];
};

export type ActivityLog = {
  id: string;
  entityType: 'project' | 'task' | 'team' | 'project_member';
  entityId: string;
  action: string;
  performedBy: string;
  timestamp: string;
  metadata: Record<string, string>;
};

export type Comment = {
  id: string;
  projectId: string;
  taskId: string | null;
  body: string;
  createdBy: string;
  createdAt: string;
};

export type WorkspaceSnapshot = {
  designations: Designation[];
  users: User[];
  teams: Team[];
  projects: Project[];
  projectMembers: ProjectMember[];
  tasks: Task[];
  comments: Comment[];
  activityLogs: ActivityLog[];
};
