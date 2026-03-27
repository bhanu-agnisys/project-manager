# Project Manager

Desktop-first project management foundation for software teams, built with Electron + React on the frontend and Node.js + Express + MongoDB on the backend.

## What This Repo Contains

This is now a real product scaffold rather than a starter window. The current foundation focuses on the hardest product rules first:

- Dynamic designations with permission-based RBAC
- Team grouping separated from access control
- Project membership as the source of truth for project access
- Tasks that work both inside and outside projects
- Activity timeline as an audit trail
- Desktop UI with dashboard, projects, tasks, teams, and role management views

## Product Model

### Access control

- `Designation` defines global permissions
- `ProjectMember` defines project-scoped access
- Teams do **not** grant access
- Removing a team from a project does **not** automatically remove project members

### Core backend entities

- `Designation`
- `User`
- `Team`
- `Project`
- `ProjectMember`
- `Task`
- `ActivityLog`

### Current frontend surfaces

- Dashboard
- Project workspace
  - timeline
  - kanban board
  - canvas JSON preview
  - member grouping by `team` vs `manual`
- Task management
  - project tasks
  - standalone tasks
- Team management
- Role management

## Repo Structure

```text
server/
  index.js
  src/
    app.js
    config/
    data/
    models/
    routes/
    utils/

electron-app/
  main.js
  preload/
  ipc/
  renderer/
    src/
      components/
      data/
      lib/
      pages/
      store/
      types/
```

## Run

Install everything:

```bash
npm run install:all
```

Run the backend:

```bash
npm run dev:server
```

Run the desktop app:

```bash
npm run dev:desktop
```

Backend defaults to:

```text
http://127.0.0.1:3000
```

Electron can read the backend API URL from:

```text
BACKEND_URL
```

If unset, it falls back to:

```text
http://127.0.0.1:3000/api
```

## Current State

### Backend

The backend now has:

- production-safe app bootstrap
- Mongo connection handling
- modular domain models
- permission catalog
- project membership role model
- demo API endpoints:
  - `GET /health`
  - `GET /api/meta/permissions`
  - `GET /api/workspace/demo`

### Frontend

The Electron renderer now has:

- TypeScript setup
- Tailwind v4 semantic theme tokens
- Zustand workspace store
- desktop workspace navigation
- kanban drag-and-drop
- audit timeline UI
- canvas JSON preview

## Important Note

The renderer currently uses a typed mock workspace store so the product flow is visible immediately. The backend already exposes the matching domain foundation and demo endpoints. The next practical step is wiring the renderer store to the backend API and then replacing the demo data with persistence-backed CRUD flows.

## Recommended Next Steps

1. Add authentication and session handling.
2. Replace mock renderer data with backend fetch + mutation flows.
3. Add CRUD endpoints for projects, tasks, teams, designations, and project members.
4. Enforce project-member checks in backend middleware.
5. Add Excalidraw or a compatible canvas editor for live visual planning.
6. Add tests for RBAC, project membership rules, and task assignment constraints.
