const DEFAULT_BACKEND_API_URL = 'http://127.0.0.1:3000/api';

export async function getBackendApiUrl() {
  if (typeof window !== 'undefined' && window.electronAPI?.system?.getBackendUrl) {
    try {
      return await window.electronAPI.system.getBackendUrl();
    } catch (error) {
      console.warn('Falling back to default backend URL', error);
    }
  }

  return DEFAULT_BACKEND_API_URL;
}
