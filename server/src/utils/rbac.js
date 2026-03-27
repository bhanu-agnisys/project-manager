const {
  PROJECT_MEMBER_ROLES,
  PROJECT_ROLE_HIERARCHY,
} = require("../config/projectMembershipRoles");

function hasDesignationPermission(user, permission) {
  const permissions = user?.designation?.permissions || [];
  return permissions.includes(permission);
}

function hasProjectRole(projectMember, requiredRole = PROJECT_MEMBER_ROLES.VIEWER) {
  const currentRole = projectMember?.role;

  if (!currentRole) {
    return false;
  }

  return (
    PROJECT_ROLE_HIERARCHY[currentRole] >=
    PROJECT_ROLE_HIERARCHY[requiredRole]
  );
}

function canAccessProject(user, projectMember, permission, requiredRole) {
  return (
    hasDesignationPermission(user, permission) &&
    hasProjectRole(projectMember, requiredRole)
  );
}

module.exports = {
  hasDesignationPermission,
  hasProjectRole,
  canAccessProject,
};
