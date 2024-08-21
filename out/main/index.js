import { app, ipcMain, BrowserWindow, shell } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import { execFile } from "child_process";
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
    ...process.platform === "linux" ? {} : {},
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
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
  const backendPath = "C:/Users/Dervis/Desktop/github.com/ITU-BeeHub/BeeHub-backend/main.exe";
  backendProcess = execFile(backendPath, (err, stdout, stderr) => {
    if (err) {
      console.error(`Backend başlatma hatası: ${err.message}`);
      return;
    }
    console.log(`Backend çıktı:
${stdout}`);
    if (stderr) {
      console.error(`Backend hata çıktı:
${stderr}`);
    }
  });
  backendProcess.on("close", (code) => {
    console.log(`Backend süreci ${code} koduyla kapandı`);
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
