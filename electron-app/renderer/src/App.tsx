import { useEffect, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';

const THEME_STORAGE_KEY = 'project-manager-theme';
const DARK_THEME_QUERY = '(prefers-color-scheme: dark)';

type ThemeMode = 'light' | 'dark';

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

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-app-bg text-app-text transition-colors duration-300">
      <HashRouter>
        <Routes>
          <Route
            path="/"
            element={
              <Welcome
                theme={theme}
                onToggleTheme={() =>
                  setTheme((currentTheme) =>
                    currentTheme === 'dark' ? 'light' : 'dark'
                  )
                }
              />
            }
          />
        </Routes>
      </HashRouter>
    </div>
  );
}
