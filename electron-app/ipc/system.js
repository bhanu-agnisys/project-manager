const { app } = require('electron');

const CHANNELS = {
  getRuntimeInfo: 'system:get-runtime-info',
  getBackendUrl: 'system:get-backend-url'
};

function getBackendUrl() {
  return process.env.BACKEND_URL || 'http://127.0.0.1:3000/api';
}

function registerSystemIpc(ipcMain) {
  ipcMain.removeHandler(CHANNELS.getRuntimeInfo);
  ipcMain.removeHandler(CHANNELS.getBackendUrl);

  ipcMain.handle(CHANNELS.getRuntimeInfo, () => ({
    appName: app.getName(),
    platform: process.platform,
    versions: {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    }
  }));


  ipcMain.handle(CHANNELS.getBackendUrl, () => getBackendUrl());
}

module.exports = {
  CHANNELS,
  registerSystemIpc
};
