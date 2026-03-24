const platformElement = document.getElementById('platform');
const electronVersionElement = document.getElementById('electron-version');
const nodeVersionElement = document.getElementById('node-version');

platformElement.textContent = window.electronAPI.platform;
electronVersionElement.textContent = window.electronAPI.versions.electron;
nodeVersionElement.textContent = window.electronAPI.versions.node;

