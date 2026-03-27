/// <reference types="vite/client" />

interface Window {
  electronAPI?: {
    system: {
      getRuntimeInfo: () => Promise<{
        appName: string;
        platform: string;
        versions: {
          node: string;
          chrome: string;
          electron: string;
        };
      }>;
      getBackendUrl: () => Promise<string>;
    };
  };
}
