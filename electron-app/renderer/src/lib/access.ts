import type {
  Designation,
  Permission,
  Project,
  ProjectMember,
  ProjectMemberRole,
  User
} from '../types/workspace';

const roleHierarchy: Record<ProjectMemberRole, number> = {
  viewer: 0,
  contributor: 1,
  admin: 2
};

function getCurrentUser(currentUserId: string, users: User[]) {
  return users.find((user) => user.id === currentUserId);
}

function getCurrentDesignation(
  currentUserId: string,
  users: User[],
  designations: Designation[]
) {
  const currentUser = getCurrentUser(currentUserId, users);
  return designations.find((designation) => designation.id === currentUser?.designationId);
}

export function hasPermission(
  currentUserId: string,
  users: User[],
  designations: Designation[],
  permission: Permission
) {
  return (
    getCurrentDesignation(currentUserId, users, designations)?.permissions.includes(permission) ||
    false
  );
}

export function getProjectMembership(
  currentUserId: string,
  projectId: string,
  projectMembers: ProjectMember[]
) {
  return projectMembers.find(
    (member) => member.userId === currentUserId && member.projectId === projectId
  );
}

export function hasProjectRole(
  currentUserId: string,
  projectId: string,
  projectMembers: ProjectMember[],
  requiredRole: ProjectMemberRole
) {
  const membership = getProjectMembership(currentUserId, projectId, projectMembers);

  if (!membership) {
    return false;
  }

  return roleHierarchy[membership.role] >= roleHierarchy[requiredRole];
}

export function canCreateProject(
  currentUserId: string,
  users: User[],
  designations: Designation[]
) {
  return hasPermission(currentUserId, users, designations, 'create_project');
}

export function canEditProject(
  currentUserId: string,
  projectId: string,
  users: User[],
  designations: Designation[],
  projectMembers: ProjectMember[]
) {
  return (
    hasPermission(currentUserId, users, designations, 'manage_project_settings') &&
    hasProjectRole(currentUserId, projectId, projectMembers, 'admin')
  );
}

export function canCreateTaskInProject(
  currentUserId: string,
  projectId: string,
  users: User[],
  designations: Designation[],
  projectMembers: ProjectMember[]
) {
  return (
    hasPermission(currentUserId, users, designations, 'create_task') &&
    hasProjectRole(currentUserId, projectId, projectMembers, 'contributor')
  );
}

export function canEditTaskInProject(
  currentUserId: string,
  projectId: string,
  users: User[],
  designations: Designation[],
  projectMembers: ProjectMember[]
) {
  return (
    hasPermission(currentUserId, users, designations, 'update_any_task') &&
    hasProjectRole(currentUserId, projectId, projectMembers, 'contributor')
  );
}

export function canAssignTasksInProject(
  currentUserId: string,
  projectId: string,
  users: User[],
  designations: Designation[],
  projectMembers: ProjectMember[]
) {
  return (
    hasPermission(currentUserId, users, designations, 'assign_tasks') &&
    hasProjectRole(currentUserId, projectId, projectMembers, 'contributor')
  );
}

export function canCommentInProject(
  currentUserId: string,
  projectId: string,
  projectMembers: ProjectMember[]
) {
  return hasProjectRole(currentUserId, projectId, projectMembers, 'viewer');
}

export function getCreatableProjects(
  currentUserId: string,
  users: User[],
  designations: Designation[],
  projectMembers: ProjectMember[],
  projects: Project[]
) {
  return projects.filter((project) =>
    canCreateTaskInProject(currentUserId, project.id, users, designations, projectMembers)
  );
}
