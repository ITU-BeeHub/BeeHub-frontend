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
const logFile = join(app.getPath("userData"), "backend_log.txt");
const logStream = fs.createWriteStream(logFile, { flags: "a" });
function createWindow() {
  const iconPath = process.platform === "win32" ? join(__dirname, "../../src/renderer/src/assets/icons/icon.png") : process.platform === "darwin" ? join(__dirname, "../../src/renderer/src/assets/icons/icon.icns") : join(__dirname, "../../src/renderer/src/assets/icons/icon.png");
  const mainWindow = new BrowserWindow({
    width: 900,
    // Default width
    height: 670,
    // Default height
    minWidth: 300,
    // Minimum width
    minHeight: 200,
    // Minimum height
    icon: iconPath,
    show: false,
    // Start hidden and show when ready
    autoHideMenuBar: true,
    webPreferences: {
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false
    }
  });
  mainWindow.on("ready-to-show", () => {
    mainWindow.maximize();
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
  logStream.write(`Resources path: ${resourcesPath}
`);
  const backendPath = join(
    resourcesPath,
    "backend",
    process.platform === "win32" ? "beehub.exe" : "beehub-mac-arm"
  );
  console.log(`Backend path: ${backendPath}`);
  logStream.write(`Backend path: ${backendPath}
`);
  if (!fs.existsSync(backendPath)) {
    const errorMsg = `Backend executable not found at ${backendPath}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}
`);
    logStream.write(`${errorMsg}
`);
    return;
  }
  backendProcess = spawn(backendPath, [], { detached: false });
  backendProcess.on("error", (error) => {
    const errorMsg = `Failed to start backend: ${error.message}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}
`);
    logStream.write(`${errorMsg}
`);
  });
  backendProcess.stdout.on("data", (data) => {
    const msg = `Backend stdout: ${data.toString()}`;
    console.log(msg);
    process.stdout.write(`${msg}
`);
    logStream.write(`${msg}
`);
  });
  backendProcess.stderr.on("data", (data) => {
    const errorMsg = `Backend stderr: ${data.toString()}`;
    console.error(errorMsg);
    process.stderr.write(`${errorMsg}
`);
    logStream.write(`${errorMsg}
`);
  });
  backendProcess.on("close", (code) => {
    const closeMsg = `Backend process exited with code ${code}`;
    console.log(closeMsg);
    process.stdout.write(`${closeMsg}
`);
    logStream.write(`${closeMsg}
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
      logStream.write(`Backend process killed on window close.
`);
    }
  }
});
