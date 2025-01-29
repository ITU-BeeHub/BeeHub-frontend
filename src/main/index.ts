import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';
import fs from 'fs';
import { AutoUpdater } from './services/AutoUpdater';

const autoUpdater = new AutoUpdater();

let backendProcess: any;
let mainWindow: BrowserWindow | null = null;

// Backend loglarını dosyaya yazmak için bir yol ekliyoruz
const logFile = join(app.getPath('userData'), 'backend_log.txt');
const logStream = fs.createWriteStream(logFile, { flags: 'a' });

function createWindow(): void {

  const iconPath = process.platform === 'win32'
    ? join(__dirname, '../../src/renderer/src/assets/icons/icon.png')
    : process.platform === 'darwin'
      ? join(__dirname, '../../src/renderer/src/assets/icons/icon.icns')
      : join(__dirname, '../../src/renderer/src/assets/icons/icon.png');

  mainWindow = new BrowserWindow({
    width: 900, // Default width
    height: 670, // Default height
    minWidth: 300, // Minimum width
    minHeight: 200, // Minimum height
    icon: iconPath,
    show: false, // Start hidden and show when ready
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false
    },
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow?.maximize(); // Maximize the window when created
    mainWindow?.show(); // Show the window when it's ready
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'));
  }
}

// Backend'i başlatan fonksiyon
function startBackend() {
  const resourcesPath = process.resourcesPath;
  process.stdout.write(`Resources path: ${resourcesPath}\n`);
  logStream.write(`Resources path: ${resourcesPath}\n`);

  const backendPath = join(
    resourcesPath,
    'backend',
    process.platform === 'win32' ? 'beehub.exe' : 'beehub-mac-arm'
  );
  console.log(`Backend path: ${backendPath}`);
  logStream.write(`Backend path: ${backendPath}\n`);

  if (!fs.existsSync(backendPath)) {
    const errorMsg = `Backend executable not found at ${backendPath}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}\n`);
    logStream.write(`${errorMsg}\n`);
    return;
  }

  // Backend sürecini başlatma
  backendProcess = spawn(backendPath, [], { detached: false });

  // Başlangıç hatalarını yakala
  backendProcess.on('error', (error: Error) => {
    const errorMsg = `Failed to start backend: ${error.message}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}\n`);
    logStream.write(`${errorMsg}\n`);
  });

  // Backend'den gelen çıktı logları
  backendProcess.stdout.on('data', (data: Buffer) => {
    const msg = `Backend stdout: ${data.toString()}`;
    console.log(msg);
    process.stdout.write(`${msg}\n`);
    logStream.write(`${msg}\n`);
  });

  // Backend'den gelen hata logları
  backendProcess.stderr.on('data', (data: Buffer) => {
    const errorMsg = `Backend stderr: ${data.toString()}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}\n`);
    logStream.write(`${errorMsg}\n`);
  });

  // Backend kapanma logları
  backendProcess.on('close', (code: number) => {
    const closeMsg = `Backend process exited with code ${code}`;
    console.log(closeMsg);
    process.stdout.write(`${closeMsg}\n`);
    logStream.write(`${closeMsg}\n`);
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('ping', () => console.log('pong'));

  startBackend(); // Backend'i başlatıyoruz
  createWindow(); // Ana pencereyi oluşturuyoruz

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Update IPC handlers
ipcMain.handle('check-for-updates', async () => {
  if (!is.dev) {
    try {
      const response = await fetch('http://localhost:8080/api/version');
      const versionInfo = await response.json();
      return versionInfo;
    } catch (error) {
      console.error('Error checking for updates:', error);
      throw error;
    }
  }
});

ipcMain.handle('start-update', async () => {
  try {
    mainWindow?.webContents.send('download-progress', { percent: 0 });

    console.log('Starting download...');
    const installerPath = await autoUpdater.downloadUpdate();
    console.log('Download completed:', installerPath);

    mainWindow?.webContents.send('download-progress', { percent: 100 });
    mainWindow?.webContents.send('update-downloaded');

    console.log('Installing update...');
    await autoUpdater.installUpdate(installerPath);
    console.log('Installation initiated');

    autoUpdater.cleanupTempFiles();
  } catch (error: unknown) {
    console.error('Error during update:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    mainWindow?.webContents.send('update-error', errorMessage);
    throw error;
  }
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall(false, true)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    if (backendProcess) {
      backendProcess.kill(); // Backend'in kapanmasını sağla
      logStream.write(`Backend process killed on window close.\n`);
    }
  }
});
