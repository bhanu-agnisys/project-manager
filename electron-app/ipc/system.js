const { app } = require('electron');

const CHANNELS = {
  getRuntimeInfo: 'system:get-runtime-info',
  getBackendUrl: 'system:get-backend-url'
};

function registerSystemIpc(ipcMain) {
  ipcMain.removeHandler(CHANNELS.getRuntimeInfo);

  ipcMain.handle(CHANNELS.getRuntimeInfo, () => ({
    appName: app.getName(),
    platform: process.platform,
    versions: {
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    }
  }));


  ipcMain.handle(CHANNELS.getBackendUrl, () => {
    return "this is bacend url from electron"
  });
}

module.exports = {
  CHANNELS,
  registerSystemIpc
};

