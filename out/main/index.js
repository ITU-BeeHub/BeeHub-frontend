import { app, ipcMain, BrowserWindow, shell } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { spawn } from "child_process";
import fs from "fs";
import __cjs_mod__ from "node:module";
const __filename = import.meta.filename;
const __dirname = import.meta.dirname;
const require2 = __cjs_mod__.createRequire(import.meta.url);
let backendProcess;
function createWindow() {
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
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
  });
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }
}
function startBackend() {
  const resourcesPath = process.resourcesPath;
  process.stdout.write(`Resources path: ${resourcesPath}
`);
  const backendPath = join(
    resourcesPath,
    "backend",
    process.platform === "win32" ? "beehub.exe" : "beehub-mac-arm"
  );
  process.stdout.write(`Backend path: ${backendPath}
`);
  if (!fs.existsSync(backendPath)) {
    process.stderr.write(`Backend executable not found at ${backendPath}
`);
    return;
  }
  backendProcess = spawn(backendPath, [], { detached: true });
  backendProcess.stdout.on("data", (data) => {
    process.stdout.write(`Backend: ${data.toString()}
`);
  });
  backendProcess.stderr.on("data", (data) => {
    process.stderr.write(`Backend error: ${data.toString()}
`);
  });
  backendProcess.on("close", (code) => {
    process.stdout.write(`Backend process exited with code ${code}
`);
  });
}
app.whenReady().then(() => {
  electronApp.setAppUserModelId("com.electron");
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });
  ipcMain.on("ping", () => console.log("pong"));
  startBackend();
  createWindow();
  app.on("activate", function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    if (backendProcess) {
      backendProcess.kill();
    }
  }
});
