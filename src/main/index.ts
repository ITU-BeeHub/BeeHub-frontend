import { app, shell, BrowserWindow, ipcMain } from 'electron';
import { join } from 'path';
import { electronApp, optimizer, is } from '@electron-toolkit/utils';
import { spawn } from 'child_process';
import fs from 'fs';

let backendProcess: any;

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false
    }
  });

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
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

  const backendPath = join(
    resourcesPath,
    'backend',
    process.platform === 'win32' ? 'beehub.exe' : 'beehub-mac-arm'
  );
  process.stdout.write(`Backend path: ${backendPath}\n`);

  if (!fs.existsSync(backendPath)) {
    process.stderr.write(`Backend executable not found at ${backendPath}\n`);
    return;
  }

  backendProcess = spawn(backendPath, [], { detached: true });

  backendProcess.stdout.on('data', (data: Buffer) => {
    process.stdout.write(`Backend: ${data.toString()}\n`);
  });

  backendProcess.stderr.on('data', (data: Buffer) => {
    process.stderr.write(`Backend error: ${data.toString()}\n`);
  });

  backendProcess.on('close', (code: number) => {
    process.stdout.write(`Backend process exited with code ${code}\n`);
  });
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron');

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  ipcMain.on('ping', () => console.log('pong'));

  startBackend();
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    if (backendProcess) {
      backendProcess.kill(); // Backend'in kapanmasını sağla
    }
  }
});
