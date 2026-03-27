import type { WorkspaceSnapshot } from '../types/workspace';

export const mockWorkspace: WorkspaceSnapshot = {
  designations: [
    {
      id: 'designation_engineering_manager',
      name: 'Engineering Manager',
      key: 'engineering_manager',
      description: 'Owns staffing, project setup, and delivery oversight.',
      permissions: [
        'create_project',
        'create_task',
        'update_any_task',
        'view_all_projects',
        'manage_project_members',
        'manage_project_settings',
        'assign_tasks',
        'manage_team',
        'view_activity'
      ]
    },
    {
      id: 'designation_team_lead',
      name: 'Team Lead',
      key: 'team_lead',
      description: 'Coordinates execution, assignment, and day-to-day flow.',
      permissions: [
        'create_project',
        'create_task',
        'update_any_task',
        'assign_tasks',
        'manage_canvas',
        'view_activity'
      ]
    },
    {
      id: 'designation_software_engineer',
      name: 'Software Engineer',
      key: 'software_engineer',
      description: 'Ships tasks, contributes to planning, and collaborates on canvas.',
      permissions: [
        'create_project',
        'create_task',
        'update_any_task',
        'assign_tasks',
        'manage_canvas'
      ]
    },
    {
      id: 'designation_admin',
      name: 'Admin',
      key: 'admin',
      description: 'Oversees workspace setup, role definitions, and broad operational access.',
      permissions: [
        'create_project',
        'create_task',
        'update_any_task',
        'assign_tasks',
        'manage_designations',
        'manage_team',
        'view_all_projects',
        'manage_project_members',
        'manage_project_settings',
        'view_activity'
      ]
    }
  ],
  users: [
    {
      id: 'usr_1',
      fullName: 'Asha Menon',
      email: 'asha@project-manager.local',
      designationId: 'designation_engineering_manager',
      title: 'Engineering Manager'
    },
    {
      id: 'usr_2',
      fullName: 'Rahul Jain',
      email: 'rahul@project-manager.local',
      designationId: 'designation_team_lead',
      title: 'Platform Team Lead'
    },
    {
      id: 'usr_3',
      fullName: 'Bhanu',
      email: 'bhanu@project-manager.local',
      designationId: 'designation_software_engineer',
      title: 'Frontend Engineer'
    },
    {
      id: 'usr_4',
      fullName: 'Daniel George',
      email: 'daniel@project-manager.local',
      designationId: 'designation_software_engineer',
      title: 'Backend Engineer'
    },
    {
      id: 'usr_5',
      fullName: 'Priya Nair',
      email: 'priya@project-manager.local',
      designationId: 'designation_admin',
      title: 'Admin'
    }
  ],
  teams: [
    {
      id: 'team_1',
      name: 'Platform Team',
      managerId: 'usr_1',
      leadId: 'usr_2',
      memberIds: ['usr_2', 'usr_4'],
      description: 'Owns APIs, deployment, observability, and architecture.'
    },
    {
      id: 'team_2',
      name: 'Product Experience',
      managerId: 'usr_1',
      leadId: null,
      memberIds: ['usr_3'],
      description: 'Owns desktop UX, task workflows, and onboarding polish.'
    }
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'Project Manager App',
      key: 'PMA',
      status: 'in_progress',
      description:
        'Desktop-first project management workspace for software teams with planning, delivery, and collaboration surfaces.',
      teamIds: ['team_1', 'team_2'],
      canvas: {
        version: 1,
        type: 'excalidraw-like',
        elements: [
          { id: 'c1', type: 'rectangle', x: 140, y: 80, text: 'Roadmap' },
          { id: 'c2', type: 'arrow', from: 'c1', to: 'c3' },
          { id: 'c3', type: 'ellipse', x: 410, y: 190, text: 'Sprint 8' }
        ]
      }
    },
    {
      id: 'proj_2',
      name: 'Release Workflow Setup',
      key: 'RWS',
      status: 'completed',
      description:
        'Release controls, audit visibility, and rollout workflow improvements.',
      teamIds: ['team_1'],
      canvas: {
        version: 1,
        type: 'excalidraw-like',
        elements: [
          { id: 'b1', type: 'rectangle', x: 160, y: 70, text: 'Audit Hooks' },
          { id: 'b2', type: 'diamond', x: 460, y: 180, text: 'Go / No-Go' }
        ]
      }
    },
    {
      id: 'proj_3',
      name: 'Legacy Cleanup',
      key: 'LGC',
      status: 'scrapped',
      description:
        'An older cleanup initiative that was intentionally stopped after reprioritization.',
      teamIds: ['team_2'],
      canvas: {
        version: 1,
        type: 'excalidraw-like',
        elements: [{ id: 'l1', type: 'rectangle', x: 180, y: 110, text: 'Stopped' }]
      }
    }
  ],
  projectMembers: [
    {
      id: 'pm_1',
      projectId: 'proj_1',
      userId: 'usr_1',
      role: 'admin',
      addedVia: 'manual'
    },
    {
      id: 'pm_2',
      projectId: 'proj_1',
      userId: 'usr_2',
      role: 'admin',
      addedVia: 'team',
      sourceTeamId: 'team_1'
    },
    {
      id: 'pm_3',
      projectId: 'proj_1',
      userId: 'usr_3',
      role: 'contributor',
      addedVia: 'team',
      sourceTeamId: 'team_2'
    },
    {
      id: 'pm_4',
      projectId: 'proj_1',
      userId: 'usr_4',
      role: 'contributor',
      addedVia: 'team',
      sourceTeamId: 'team_1'
    },
    {
      id: 'pm_5',
      projectId: 'proj_1',
      userId: 'usr_5',
      role: 'viewer',
      addedVia: 'manual'
    },
    {
      id: 'pm_6',
      projectId: 'proj_2',
      userId: 'usr_1',
      role: 'admin',
      addedVia: 'manual'
    },
    {
      id: 'pm_7',
      projectId: 'proj_2',
      userId: 'usr_4',
      role: 'contributor',
      addedVia: 'team',
      sourceTeamId: 'team_1'
    },
    {
      id: 'pm_8',
      projectId: 'proj_3',
      userId: 'usr_1',
      role: 'admin',
      addedVia: 'manual'
    },
    {
      id: 'pm_9',
      projectId: 'proj_3',
      userId: 'usr_3',
      role: 'contributor',
      addedVia: 'team',
      sourceTeamId: 'team_2'
    }
  ],
  tasks: [
    {
      id: 'task_1',
      title: 'Model dynamic designations and permission matrix',
      description:
        'Replace hardcoded role checks with designation-based permissions.',
      status: 'todo',
      priority: 'high',
      dueDate: '2026-04-04T00:00:00.000Z',
      projectId: 'proj_1',
      assignedUserId: 'usr_4',
      createdBy: 'usr_1',
      labels: ['backend', 'rbac']
    },
    {
      id: 'task_2',
      title: 'Design dashboard shell for desktop workflows',
      description:
        'Create the desktop overview with project health, personal tasks, and activity.',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2026-04-01T00:00:00.000Z',
      projectId: 'proj_1',
      assignedUserId: 'usr_3',
      createdBy: 'usr_2',
      labels: ['frontend', 'desktop']
    },
    {
      id: 'task_3',
      title: 'Review timeline event naming',
      description: 'Align audit log actions with product language.',
      status: 'done',
      priority: 'medium',
      dueDate: '2026-03-28T00:00:00.000Z',
      projectId: 'proj_1',
      assignedUserId: 'usr_2',
      createdBy: 'usr_1',
      labels: ['product']
    },
    {
      id: 'task_4',
      title: 'Prepare release rollout checkpoints',
      description:
        'Document go-live criteria, rollback expectations, and deployment ownership.',
      status: 'todo',
      priority: 'medium',
      dueDate: '2026-04-06T00:00:00.000Z',
      projectId: 'proj_1',
      assignedUserId: 'usr_5',
      createdBy: 'usr_1',
      labels: ['release', 'ops']
    },
    {
      id: 'task_5',
      title: 'Archive rollout learnings',
      description: 'Collect the final release notes and retrospective outcomes.',
      status: 'done',
      priority: 'medium',
      dueDate: '2026-04-08T00:00:00.000Z',
      projectId: 'proj_2',
      assignedUserId: 'usr_4',
      createdBy: 'usr_1',
      labels: ['release', 'ops']
    }
  ],
  comments: [
    {
      id: 'comment_1',
      projectId: 'proj_1',
      taskId: null,
      body: 'Let us keep the first desktop release focused on project editing, task editing, and collaboration.',
      createdBy: 'usr_1',
      createdAt: '2026-03-26T09:40:00.000Z'
    },
    {
      id: 'comment_2',
      projectId: 'proj_1',
      taskId: 'task_2',
      body: 'The dashboard shell is close. Please leave enough room for project comments and the activity feed.',
      createdBy: 'usr_2',
      createdAt: '2026-03-27T10:15:00.000Z'
    },
    {
      id: 'comment_3',
      projectId: 'proj_2',
      taskId: 'task_5',
      body: 'Add the final retrospective notes before we mark this release workflow fully archived.',
      createdBy: 'usr_4',
      createdAt: '2026-03-27T11:05:00.000Z'
    }
  ],
  activityLogs: [
    {
      id: 'act_1',
      entityType: 'project',
      entityId: 'proj_1',
      action: 'project_created',
      performedBy: 'usr_1',
      timestamp: '2026-03-23T09:10:00.000Z',
      metadata: { projectKey: 'PMA' }
    },
    {
      id: 'act_2',
      entityType: 'project_member',
      entityId: 'pm_3',
      action: 'project_member_added_from_team',
      performedBy: 'usr_2',
      timestamp: '2026-03-23T10:30:00.000Z',
      metadata: { userId: 'usr_3', sourceTeamId: 'team_2' }
    },
    {
      id: 'act_3',
      entityType: 'task',
      entityId: 'task_2',
      action: 'task_status_changed',
      performedBy: 'usr_3',
      timestamp: '2026-03-26T14:20:00.000Z',
      metadata: { from: 'todo', to: 'in_progress' }
    },
    {
      id: 'act_4',
      entityType: 'task',
      entityId: 'task_3',
      action: 'task_completed',
      performedBy: 'usr_2',
      timestamp: '2026-03-27T08:45:00.000Z',
      metadata: { status: 'done' }
    },
    {
      id: 'act_5',
      entityType: 'project',
      entityId: 'proj_1',
      action: 'comment_added',
      performedBy: 'usr_1',
      timestamp: '2026-03-26T09:40:00.000Z',
      metadata: { commentId: 'comment_1', commentTarget: 'project' }
    },
    {
      id: 'act_6',
      entityType: 'task',
      entityId: 'task_2',
      action: 'comment_added',
      performedBy: 'usr_2',
      timestamp: '2026-03-27T10:15:00.000Z',
      metadata: { commentId: 'comment_2', commentTarget: 'task' }
    }
  ]
};
