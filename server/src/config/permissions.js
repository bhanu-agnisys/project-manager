const PERMISSIONS = Object.freeze({
  CREATE_PROJECT: "create_project",
  VIEW_ALL_PROJECTS: "view_all_projects",
  MANAGE_PROJECT_MEMBERS: "manage_project_members",
  MANAGE_PROJECT_SETTINGS: "manage_project_settings",
  CREATE_TASK: "create_task",
  UPDATE_ANY_TASK: "update_any_task",
  ASSIGN_TASKS: "assign_tasks",
  MANAGE_TEAM: "manage_team",
  MANAGE_DESIGNATIONS: "manage_designations",
  VIEW_ACTIVITY: "view_activity",
  MANAGE_CANVAS: "manage_canvas",
});

const PERMISSION_GROUPS = Object.freeze([
  {
    key: "projects",
    label: "Project Administration",
    permissions: [
      PERMISSIONS.CREATE_PROJECT,
      PERMISSIONS.VIEW_ALL_PROJECTS,
      PERMISSIONS.MANAGE_PROJECT_MEMBERS,
      PERMISSIONS.MANAGE_PROJECT_SETTINGS,
      PERMISSIONS.VIEW_ACTIVITY,
      PERMISSIONS.MANAGE_CANVAS,
    ],
  },
  {
    key: "tasks",
    label: "Task Delivery",
    permissions: [
      PERMISSIONS.CREATE_TASK,
      PERMISSIONS.UPDATE_ANY_TASK,
      PERMISSIONS.ASSIGN_TASKS,
    ],
  },
  {
    key: "people",
    label: "Teams and Access",
    permissions: [
      PERMISSIONS.MANAGE_TEAM,
      PERMISSIONS.MANAGE_DESIGNATIONS,
    ],
  },
]);

module.exports = {
  PERMISSIONS,
  PERMISSION_VALUES: Object.freeze(Object.values(PERMISSIONS)),
  PERMISSION_GROUPS,
};
