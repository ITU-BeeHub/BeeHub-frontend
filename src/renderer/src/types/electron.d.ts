export interface UpdateInfo {
    version: string;
    releaseNotes?: string;
}

export interface ProgressInfo {
    percent: number;
    bytesPerSecond: number;
    total: number;
    transferred: number;
}

export interface ElectronAPI {
    checkForUpdates: () => Promise<any>;
    startUpdate: () => Promise<void>;
    installUpdate: () => void;
    onUpdateAvailable: (callback: (event: Electron.IpcRendererEvent, info: UpdateInfo) => void) => void;
    onUpdateDownloaded: (callback: (event: Electron.IpcRendererEvent, info: UpdateInfo) => void) => void;
    onUpdateError: (callback: (event: Electron.IpcRendererEvent, error: string) => void) => void;
    onDownloadProgress: (callback: (event: Electron.IpcRendererEvent, progressObj: ProgressInfo) => void) => void;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI;
    }
}
