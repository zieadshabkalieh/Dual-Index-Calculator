const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  saveFile: (options) => ipcRenderer.invoke('save-file', options),
  openFile: (options) => ipcRenderer.invoke('open-file', options),
  
  // Add event listeners
  onMenuSaveCalculation: (callback) => {
    ipcRenderer.on('menu-save-calculation', () => callback());
    return () => ipcRenderer.removeAllListeners('menu-save-calculation');
  },
  onMenuLoadCalculation: (callback) => {
    ipcRenderer.on('menu-load-calculation', () => callback());
    return () => ipcRenderer.removeAllListeners('menu-load-calculation');
  },
  onMenuExportPDF: (callback) => {
    ipcRenderer.on('menu-export-pdf', () => callback());
    return () => ipcRenderer.removeAllListeners('menu-export-pdf');
  },
  onMenuAbout: (callback) => {
    ipcRenderer.on('menu-about', () => callback());
    return () => ipcRenderer.removeAllListeners('menu-about');
  }
});
