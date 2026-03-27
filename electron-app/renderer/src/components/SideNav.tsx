import { NavLink } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { titleCase } from '../lib/formatters';
import { useWorkspaceStore } from '../store/useWorkspaceStore';
import type { ThemeMode } from '../types/workspace';

const navigation = [
  { to: '/', label: 'Dashboard', shortLabel: 'D' },
  { to: '/projects', label: 'Projects', shortLabel: 'P' },
  { to: '/tasks', label: 'Tasks', shortLabel: 'T' },
  { to: '/teams', label: 'Teams', shortLabel: 'Tm' },
  { to: '/roles', label: 'Roles', shortLabel: 'R' }
];

const statusStyles: Record<string, string> = {
  planning: 'bg-surface-muted text-text-muted',
  in_progress: 'bg-accent text-accent-contrast',
  completed: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  scrapped: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
};

type SideNavProps = {
  isCollapsed: boolean;
  onToggle: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onLogout: () => void;
};

export function SideNav({
  isCollapsed,
  onToggle,
  theme,
  onToggleTheme,
  onLogout
}: SideNavProps) {
  const {
    projects,
    activeProjectId,
    setActiveProject,
    currentUserId,
    users,
    designations
  } = useWorkspaceStore(
    useShallow((state) => ({
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      setActiveProject: state.setActiveProject,
      currentUserId: state.currentUserId,
      users: state.users,
      designations: state.designations
    }))
  );
  const currentUser = users.find((user) => user.id === currentUserId);
  const designation = designations.find((item) => item.id === currentUser?.designationId);

  return (
    <aside
      className={[
        'sticky top-0 flex h-screen overflow-y-auto flex-col border-r border-border-soft bg-surface-card/80 py-6 backdrop-blur transition-all duration-300',
        isCollapsed ? 'px-3' : 'px-4'
      ].join(' ')}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        {!isCollapsed && (
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
            Menu
          </p>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="rounded-full border border-border-soft bg-surface-panel px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-muted transition-colors hover:text-app-text"
        >
          {isCollapsed ? 'Open' : 'Hide'}
        </button>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              [
                'flex items-center rounded-2xl px-4 py-3 text-sm font-semibold transition-colors duration-200',
                isActive
                  ? 'bg-accent text-accent-contrast shadow-accent-glow'
                  : 'text-text-muted hover:bg-surface-muted hover:text-app-text'
              ].join(' ')
            }
          >
            {isCollapsed ? item.shortLabel : item.label}
          </NavLink>
        ))}
      </nav>

      {!isCollapsed && (
        <div className="mt-6 space-y-3">
          <p className="px-2 text-xs font-semibold uppercase tracking-[0.24em] text-text-muted">
            Projects
          </p>

          <div className="space-y-2">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveProject(project.id)}
                className={[
                  'w-full rounded-2xl border px-4 py-3 text-left transition-colors duration-200',
                  project.id === activeProjectId
                    ? 'border-accent bg-surface-panel'
                    : 'border-border-soft bg-surface-card hover:bg-surface-muted'
                ].join(' ')}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-semibold">{project.name}</span>
                  <span
                    className={[
                      'rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]',
                      statusStyles[project.status] || 'bg-surface-muted text-text-muted'
                    ].join(' ')}
                  >
                    {titleCase(project.status)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto space-y-3 pt-6">
        {!isCollapsed && currentUser && (
          <div className="rounded-2xl border border-border-soft bg-surface-panel px-4 py-3">
            <p className="text-sm font-semibold">{currentUser.fullName}</p>
            <p className="mt-1 text-sm text-text-muted">
              {designation?.name || currentUser.title}
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleTheme}
          className={[
            'w-full rounded-2xl border border-border-soft bg-surface-panel px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:text-app-text',
            isCollapsed ? 'px-2 text-center' : 'text-left'
          ].join(' ')}
        >
          {isCollapsed ? (theme === 'dark' ? 'Dk' : 'Lt') : `Theme: ${theme === 'dark' ? 'Dark' : 'Light'}`}
        </button>

        <button
          type="button"
          onClick={onLogout}
          className={[
            'w-full rounded-2xl border border-border-soft bg-surface-card px-4 py-3 text-sm font-semibold text-text-muted transition-colors hover:text-app-text',
            isCollapsed ? 'px-2 text-center' : 'text-left'
          ].join(' ')}
        >
          {isCollapsed ? 'Out' : 'Log Out'}
        </button>
      </div>
    </aside>
  );
}
