const PROJECT_MEMBER_ROLES = Object.freeze({
  VIEWER: "viewer",
  CONTRIBUTOR: "contributor",
  ADMIN: "admin",
});

const PROJECT_ROLE_HIERARCHY = Object.freeze({
  [PROJECT_MEMBER_ROLES.VIEWER]: 1,
  [PROJECT_MEMBER_ROLES.CONTRIBUTOR]: 2,
  [PROJECT_MEMBER_ROLES.ADMIN]: 3,
});

module.exports = {
  PROJECT_MEMBER_ROLES,
  PROJECT_MEMBER_ROLE_VALUES: Object.freeze(
    Object.values(PROJECT_MEMBER_ROLES)
  ),
  PROJECT_ROLE_HIERARCHY,
};
