import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { SideNav } from './components/SideNav';
import { AuthPage } from './pages/auth/AuthPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { ProjectsPage } from './pages/projects/ProjectsPage';
import { RolesPage } from './pages/roles/RolesPage';
import { TasksPage } from './pages/tasks/TasksPage';
import { TeamsPage } from './pages/teams/TeamsPage';
import { useAuthStore } from './store/useAuthStore';
import { useWorkspaceStore } from './store/useWorkspaceStore';
import type { ThemeMode } from './types/workspace';

const THEME_STORAGE_KEY = 'project-manager-theme';
const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') {
    return 'light';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }

  return window.matchMedia(DARK_THEME_QUERY).matches ? 'dark' : 'light';
}

export function App() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const authStatus = useAuthStore((state) => state.status);
  const authUser = useAuthStore((state) => state.user);
  const authError = useAuthStore((state) => state.error);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const login = useAuthStore((state) => state.login);
  const signup = useAuthStore((state) => state.signup);
  const logout = useAuthStore((state) => state.logout);
  const syncAuthenticatedUser = useWorkspaceStore((state) => state.syncAuthenticatedUser);
  const clearAuthenticatedUser = useWorkspaceStore((state) => state.clearAuthenticatedUser);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    if (authUser) {
      syncAuthenticatedUser(authUser);
      return;
    }

    clearAuthenticatedUser();
  }, [authUser, clearAuthenticatedUser, syncAuthenticatedUser]);

  if (authStatus !== 'authenticated' || !authUser) {
    return (
      <AuthPage
        theme={theme}
        status={authStatus}
        error={authError}
        onLogin={login}
        onSignup={signup}
        onToggleTheme={() =>
          setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
        }
      />
    );
  }

  return (
    <HashRouter>
      <div className="h-screen overflow-hidden bg-app-bg text-app-text transition-colors duration-300">
        <div
          className={[
            'grid h-full transition-all duration-300',
            isSidebarCollapsed ? 'lg:grid-cols-[92px_1fr]' : 'lg:grid-cols-[320px_1fr]'
          ].join(' ')}
        >
          <SideNav
            isCollapsed={isSidebarCollapsed}
            onToggle={() => setIsSidebarCollapsed((current) => !current)}
            theme={theme}
            onLogout={logout}
            onToggleTheme={() =>
              setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'))
            }
          />

          <main className="h-full overflow-y-auto px-6 py-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/teams" element={<TeamsPage />} />
              <Route path="/roles" element={<RolesPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
}
