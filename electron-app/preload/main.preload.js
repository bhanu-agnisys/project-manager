const { contextBridge, ipcRenderer } = require('electron');

// Sandboxed preload scripts should avoid requiring local project modules.
const SYSTEM_CHANNELS = {
  getRuntimeInfo: 'system:get-runtime-info',
  getBackendUrl: 'system:get-backend-url'
};

contextBridge.exposeInMainWorld('electronAPI', {
  system: {
    getRuntimeInfo() {
      return ipcRenderer.invoke(SYSTEM_CHANNELS.getRuntimeInfo);
    },
    getBackendUrl() {
      return ipcRenderer.invoke(SYSTEM_CHANNELS.getBackendUrl);
    }
  }
});
