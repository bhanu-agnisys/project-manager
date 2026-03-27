const path = require('node:path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { registerSystemIpc } = require('./ipc/system.js');

const PRELOAD_ENTRY = path.join(__dirname, 'preload', 'main.preload.js');

async function createWindow(windowOptions = {}) {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 980,
    minHeight: 640,
    ...windowOptions,
    webPreferences: {
      preload: PRELOAD_ENTRY,
      contextIsolation: true,
      nodeIntegration: false,
      ...(windowOptions.webPreferences || {})
    }
  });

  mainWindow.webContents.openDevTools();

  if (process.env.ELECTRON_RENDERER_URL) {
    await mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
    return;
  }

  await mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
}

app.whenReady().then(() => {
  registerSystemIpc(ipcMain);
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
