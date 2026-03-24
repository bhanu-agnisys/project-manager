import { useEffect, useState } from 'react';

const defaultVersions = {
  electron: '-',
  node: '-'
};

export function App() {
  const [platform, setPlatform] = useState('-');
  const [versions, setVersions] = useState(defaultVersions);

  useEffect(() => {
    if (!window.electronAPI) {
      return;
    }

    setPlatform(window.electronAPI.platform);
    setVersions(window.electronAPI.versions);
  }, []);

  return (
    <main className="app-shell">
      <section className="hero-card">
        <p className="eyebrow">React Renderer</p>
        <h1>Electron is now using a React renderer.</h1>
        <p className="summary">
          The desktop shell stays in Electron main/preload, and the UI now lives
          under <code>electron-app/renderer/src</code>. This gives you a clean base
          for components, routing, state, and API integration.
        </p>

        <div className="meta-grid">
          <article className="meta-card">
            <span className="label">Platform</span>
            <strong>{platform}</strong>
          </article>
          <article className="meta-card">
            <span className="label">Electron</span>
            <strong>{versions.electron}</strong>
          </article>
          <article className="meta-card">
            <span className="label">Node.js</span>
            <strong>{versions.node}</strong>
          </article>
        </div>
      </section>
    </main>
  );
}

