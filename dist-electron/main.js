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
const getConfigTemplates = () => {
  const home = node_os.homedir();
  const templates = [
    {
      name: ".npmrc",
      path: node_path.join(home, ".npmrc"),
      description: "NPM configuration file"
    },
    {
      name: ".zshrc",
      path: node_path.join(home, ".zshrc"),
      description: "Zsh shell configuration"
    },
    {
      name: ".bashrc",
      path: node_path.join(home, ".bashrc"),
      description: "Bash shell configuration"
    },
    {
      name: ".bash_profile",
      path: node_path.join(home, ".bash_profile"),
      description: "Bash profile settings"
    },
    {
      name: ".gitconfig",
      path: node_path.join(home, ".gitconfig"),
      description: "Git global configuration"
    },
    {
      name: "hosts",
      path: process.platform === "win32" ? "C:\\Windows\\System32\\drivers\\etc\\hosts" : "/etc/hosts",
      description: "System hosts file"
    },
    {
      name: ".ssh/config",
      path: node_path.join(home, ".ssh", "config"),
      description: "SSH client configuration"
    },
    {
      name: "VS Code Settings",
      path: process.platform === "darwin" ? node_path.join(home, "Library", "Application Support", "Code", "User", "settings.json") : process.platform === "win32" ? node_path.join(home, "AppData", "Roaming", "Code", "User", "settings.json") : node_path.join(home, ".config", "Code", "User", "settings.json"),
      description: "Visual Studio Code settings"
    },
    {
      name: ".vimrc",
      path: node_path.join(home, ".vimrc"),
      description: "Vim editor configuration"
    },
    {
      name: ".tmux.conf",
      path: node_path.join(home, ".tmux.conf"),
      description: "Tmux terminal multiplexer configuration"
    }
  ];
  return templates;
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
const binaryPatterns = [
  /\.(exe|dll|so|dylib|dmg|pkg|deb|rpm)$/i,
  // Executable files
  /\.(zip|tar|gz|bz2|7z|rar|xz)$/i,
  // Compressed files
  /\.(jpg|jpeg|png|gif|bmp|ico|svg|webp)$/i,
  // Image files
  /\.(mp3|mp4|avi|mov|wmv|flv|wav|flac)$/i,
  // Audio/video files
  /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,
  // Office documents
  /\.(ttf|otf|woff|woff2|eot)$/i,
  // Font files
  /\.(bin|dat|db|sqlite)$/i,
  // Data files
  /\.DS_Store$/,
  // macOS system files
  /^Thumbs\.db$/
  // Windows system files
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
          const isBinary = binaryPatterns.some(
            (pattern) => pattern.test(entry)
          );
          if (!isBinary) {
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
async function buildDirectChildren(dirPath) {
  const items = [];
  console.log("[Backend] Scanning directory:", dirPath);
  try {
    const entries = await promises.readdir(dirPath);
    console.log("[Backend] Found", entries.length, "entries in", dirPath);
    for (const entry of entries) {
      const fullPath = node_path.join(dirPath, entry);
      try {
        const stats = await promises.stat(fullPath);
        if (stats.isDirectory()) {
          if (entry !== "node_modules" && entry !== ".git") {
            items.push({
              name: entry,
              path: fullPath,
              type: "folder",
              exists: true,
              tags: [],
              children: void 0,
              // undefined indicates not loaded yet
              expanded: false
            });
          }
        } else if (stats.isFile()) {
          const isBinary = binaryPatterns.some((pattern) => pattern.test(entry));
          if (!isBinary) {
            items.push({
              name: entry,
              path: fullPath,
              type: "file",
              exists: true,
              tags: []
            });
          } else {
            console.log("[Backend] Excluded binary file:", entry);
          }
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
    console.log("[Backend] Error reading directory:", dirPath, error);
  }
  console.log("[Backend] Returning", items.length, "items for", dirPath);
  return items;
}
async function buildFileSystemTree(dirPath, maxDepth = 2, currentDepth = 0) {
  const items = [];
  if (currentDepth >= maxDepth) return items;
  try {
    const entries = await promises.readdir(dirPath);
    for (const entry of entries) {
      const fullPath = node_path.join(dirPath, entry);
      try {
        const stats = await promises.stat(fullPath);
        if (stats.isDirectory()) {
          const folder = {
            name: entry,
            path: fullPath,
            type: "folder",
            exists: true,
            children: void 0
          };
          if (entry !== "node_modules" && entry !== ".git") {
            folder.children = void 0;
          }
          items.push(folder);
        } else if (stats.isFile()) {
          const isBinary = binaryPatterns.some(
            (pattern) => pattern.test(entry)
          );
          if (!isBinary) {
            items.push({
              name: entry,
              path: fullPath,
              type: "file",
              exists: true
            });
          }
        }
      } catch (error) {
        continue;
      }
    }
  } catch (error) {
  }
  return items;
}
electron.ipcMain.handle("scan-folder-tree", async (_, folderPath, maxDepth = 3) => {
  try {
    const items = await buildFileSystemTree(folderPath, maxDepth);
    return { success: true, items };
  } catch (error) {
    return { success: false, error: error.message, items: [] };
  }
});
electron.ipcMain.handle("get-folder-contents", async (_, folderPath) => {
  try {
    const items = await buildDirectChildren(folderPath);
    return { success: true, items };
  } catch (error) {
    return { success: false, error: error.message, items: [] };
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
electron.ipcMain.handle("get-config-templates", async () => {
  return getConfigTemplates();
});
electron.ipcMain.handle("check-files-existence", async (_, filePaths) => {
  const existence = {};
  for (const filePath of filePaths) {
    try {
      await promises.access(filePath, promises.constants.F_OK);
      existence[filePath] = true;
    } catch {
      existence[filePath] = false;
    }
  }
  return existence;
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
