"use strict";
const electron = require("electron");
const node_path = require("node:path");
const promises = require("node:fs/promises");
const node_os = require("node:os");
if (require("electron-squirrel-startup")) {
  electron.app.quit();
}
const createWindow = () => {
  const mainWindow = new electron.BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: node_path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: "default",
    show: false
  });
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(node_path.join(__dirname, "../dist/index.html"));
  }
};
const getConfigPaths = () => {
  const home = node_os.homedir();
  return {
    npmrc: node_path.join(home, ".npmrc"),
    zshrc: node_path.join(home, ".zshrc"),
    bashrc: node_path.join(home, ".bashrc"),
    bash_profile: node_path.join(home, ".bash_profile"),
    gitconfig: node_path.join(home, ".gitconfig"),
    hosts: process.platform === "win32" ? "C:\\Windows\\System32\\drivers\\etc\\hosts" : "/etc/hosts",
    ssh_config: node_path.join(home, ".ssh", "config"),
    vscode_settings: process.platform === "darwin" ? node_path.join(
      home,
      "Library",
      "Application Support",
      "Code",
      "User",
      "settings.json"
    ) : process.platform === "win32" ? node_path.join(home, "AppData", "Roaming", "Code", "User", "settings.json") : node_path.join(home, ".config", "Code", "User", "settings.json")
  };
};
electron.ipcMain.handle("get-config-files", async () => {
  const paths = getConfigPaths();
  const files = [];
  for (const [name, path] of Object.entries(paths)) {
    try {
      await promises.access(path, promises.constants.F_OK);
      files.push({ name, path, exists: true });
    } catch {
      files.push({ name, path, exists: false });
    }
  }
  return files;
});
electron.ipcMain.handle("read-file", async (_, filePath) => {
  try {
    const content = await promises.readFile(filePath, "utf-8");
    return { success: true, content };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
electron.ipcMain.handle("write-file", async (_, filePath, content) => {
  try {
    await promises.writeFile(filePath, content, "utf-8");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});
electron.ipcMain.handle("select-file", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "Config Files",
        extensions: ["json", "yml", "yaml", "toml", "ini", "conf", "config"]
      },
      { name: "All Files", extensions: ["*"] }
    ]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
electron.ipcMain.handle("select-folder", async () => {
  const result = await electron.dialog.showOpenDialog({
    properties: ["openDirectory"]
  });
  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0];
  }
  return null;
});
const configPatterns = [
  /\.(json|yml|yaml|toml|ini|conf|config)$/i,
  /^\..*rc$/,
  /^\..*profile$/,
  /^\.gitconfig$/,
  /^\.gitignore$/,
  /^\.npmrc$/,
  /^\.editorconfig$/,
  /^Dockerfile$/i,
  /^Makefile$/i,
  /^hosts$/,
  /^config$/
];
async function scanDirectory(dirPath, files, maxDepth = 2, currentDepth = 0) {
  if (currentDepth >= maxDepth) return;
  try {
    const entries = await promises.readdir(dirPath);
    for (const entry of entries) {
      const fullPath = node_path.join(dirPath, entry);
      try {
        const stats = await promises.stat(fullPath);
        if (stats.isFile()) {
          const isConfigFile = configPatterns.some(
            (pattern) => pattern.test(entry)
          );
          if (isConfigFile) {
            files.push({
              name: entry,
              path: fullPath,
              exists: true
            });
          }
        } else if (stats.isDirectory() && !entry.startsWith(".") && entry !== "node_modules") {
          await scanDirectory(fullPath, files, maxDepth, currentDepth + 1);
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    return;
  }
}
electron.ipcMain.handle("scan-folder", async (_, folderPath) => {
  try {
    const files = [];
    await scanDirectory(folderPath, files);
    return { success: true, files };
  } catch (error) {
    return { success: false, error: error.message, files: [] };
  }
});
electron.ipcMain.handle("show-item-in-folder", async (_, filePath) => {
  electron.shell.showItemInFolder(filePath);
});
electron.ipcMain.handle("add-file-by-path", async (_, filePath) => {
  try {
    let actualPath = filePath;
    if (actualPath.startsWith("~/")) {
      const home = node_os.homedir();
      actualPath = actualPath.replace("~", home);
    }
    await promises.access(actualPath, promises.constants.F_OK);
    return { success: true, exists: true, actualPath };
  } catch {
    let actualPath = filePath;
    if (actualPath.startsWith("~/")) {
      const home = node_os.homedir();
      actualPath = actualPath.replace("~", home);
    }
    return { success: true, exists: false, actualPath };
  }
});
electron.ipcMain.handle("get-platform", () => {
  return process.platform;
});
electron.ipcMain.handle("check-path", async (_, inputPath) => {
  try {
    let actualPath = inputPath;
    if (actualPath.startsWith("~/")) {
      const home = node_os.homedir();
      actualPath = actualPath.replace("~", home);
    }
    await promises.access(actualPath, promises.constants.F_OK);
    const stats = await promises.stat(actualPath);
    return {
      success: true,
      exists: true,
      actualPath,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch {
    let actualPath = inputPath;
    if (actualPath.startsWith("~/")) {
      const home = node_os.homedir();
      actualPath = actualPath.replace("~", home);
    }
    return {
      success: true,
      exists: false,
      actualPath,
      isFile: false,
      isDirectory: false
    };
  }
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (electron.BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
//# sourceMappingURL=main.js.map
