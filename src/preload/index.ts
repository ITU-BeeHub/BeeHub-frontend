import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { electronAPI } from '@electron-toolkit/preload';
import type { UpdateInfo, ProgressInfo } from '../renderer/src/types/electron';

// Custom APIs for renderer
const api = {};

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI);
    contextBridge.exposeInMainWorld('api', api);
    contextBridge.exposeInMainWorld('electronAPI', {
      // Update related methods
      checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
      startUpdate: () => ipcRenderer.invoke('start-update'),
      installUpdate: () => ipcRenderer.invoke('install-update'),

      // Update event listeners with proper types
      onUpdateAvailable: (callback: (event: IpcRendererEvent, info: UpdateInfo) => void) =>
        ipcRenderer.on('update-available', callback),
      onUpdateDownloaded: (callback: (event: IpcRendererEvent, info: UpdateInfo) => void) =>
        ipcRenderer.on('update-downloaded', callback),
      onUpdateError: (callback: (event: IpcRendererEvent, error: string) => void) =>
        ipcRenderer.on('update-error', callback),
      onDownloadProgress: (callback: (event: IpcRendererEvent, progressObj: ProgressInfo) => void) =>
        ipcRenderer.on('download-progress', callback)
    });
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
