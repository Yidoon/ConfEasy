import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import { join } from "node:path"
import {
  readFile,
  writeFile,
  access,
  constants,
  readdir,
  stat,
} from "node:fs/promises"
import { homedir } from "node:os"

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit()
}

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: "default",
    show: false,
  })

  // Show window when ready to prevent visual flash
  mainWindow.once("ready-to-show", () => {
    mainWindow.show()
  })

  // Load the app
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:5173")
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(join(__dirname, "../dist/index.html"))
  }
}

// Common config file paths
const getConfigPaths = () => {
  const home = homedir()
  return {
    npmrc: join(home, ".npmrc"),
    zshrc: join(home, ".zshrc"),
    bashrc: join(home, ".bashrc"),
    bash_profile: join(home, ".bash_profile"),
    gitconfig: join(home, ".gitconfig"),
    hosts:
      process.platform === "win32"
        ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
        : "/etc/hosts",
    ssh_config: join(home, ".ssh", "config"),
    vscode_settings:
      process.platform === "darwin"
        ? join(
            home,
            "Library",
            "Application Support",
            "Code",
            "User",
            "settings.json"
          )
        : process.platform === "win32"
        ? join(home, "AppData", "Roaming", "Code", "User", "settings.json")
        : join(home, ".config", "Code", "User", "settings.json"),
  }
}

// IPC handlers
ipcMain.handle("get-config-files", async () => {
  const paths = getConfigPaths()
  const files = []

  for (const [name, path] of Object.entries(paths)) {
    try {
      await access(path, constants.F_OK)
      files.push({ name, path, exists: true })
    } catch {
      files.push({ name, path, exists: false })
    }
  }

  return files
})

ipcMain.handle("read-file", async (_, filePath: string) => {
  try {
    const content = await readFile(filePath, "utf-8")
    return { success: true, content }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("write-file", async (_, filePath: string, content: string) => {
  try {
    await writeFile(filePath, content, "utf-8")
    return { success: true }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
})

ipcMain.handle("select-file", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [
      {
        name: "Config Files",
        extensions: ["json", "yml", "yaml", "toml", "ini", "conf", "config"],
      },
      { name: "All Files", extensions: ["*"] },
    ],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

ipcMain.handle("select-folder", async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openDirectory"],
  })

  if (!result.canceled && result.filePaths.length > 0) {
    return result.filePaths[0]
  }
  return null
})

// Scan folder for config files
ipcMain.handle("scan-folder", async (_, folderPath: string) => {
  try {
    const files: Array<{ name: string; path: string; exists: boolean }> = []

    // Common config file patterns
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
      /^config$/,
    ]

    async function scanDirectory(
      dirPath: string,
      maxDepth = 2,
      currentDepth = 0
    ) {
      if (currentDepth >= maxDepth) return

      try {
        const entries = await readdir(dirPath)

        for (const entry of entries) {
          const fullPath = join(dirPath, entry)

          try {
            const stats = await stat(fullPath)

            if (stats.isFile()) {
              // Check if file matches config patterns
              const isConfigFile = configPatterns.some((pattern) =>
                pattern.test(entry)
              )

              if (isConfigFile) {
                files.push({
                  name: entry,
                  path: fullPath,
                  exists: true,
                })
              }
            } else if (
              stats.isDirectory() &&
              !entry.startsWith(".") &&
              entry !== "node_modules"
            ) {
              // Recursively scan subdirectories (but skip hidden dirs and node_modules)
              await scanDirectory(fullPath, maxDepth, currentDepth + 1)
            }
          } catch (error) {
            // Skip files/directories that can't be accessed
            continue
          }
        }
      } catch (error) {
        // Skip directories that can't be read
        return
      }
    }

    await scanDirectory(folderPath)

    return { success: true, files }
  } catch (error) {
    return { success: false, error: (error as Error).message, files: [] }
  }
})

ipcMain.handle("show-item-in-folder", async (_, filePath: string) => {
  shell.showItemInFolder(filePath)
})

ipcMain.handle("add-file-by-path", async (_, filePath: string) => {
  try {
    // Convert ~ to actual home directory path
    let actualPath = filePath
    if (actualPath.startsWith("~/")) {
      const home = homedir()
      actualPath = actualPath.replace("~", home)
    }

    await access(actualPath, constants.F_OK)
    return { success: true, exists: true, actualPath }
  } catch {
    // Convert ~ to actual home directory path for non-existing files too
    let actualPath = filePath
    if (actualPath.startsWith("~/")) {
      const home = homedir()
      actualPath = actualPath.replace("~", home)
    }
    return { success: true, exists: false, actualPath }
  }
})

ipcMain.handle("get-platform", () => {
  return process.platform
})

ipcMain.handle("check-path", async (_, inputPath: string) => {
  try {
    // Convert ~ to actual home directory path
    let actualPath = inputPath
    if (actualPath.startsWith("~/")) {
      const home = homedir()
      actualPath = actualPath.replace("~", home)
    }

    await access(actualPath, constants.F_OK)
    const stats = await stat(actualPath)

    return {
      success: true,
      exists: true,
      actualPath,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory(),
    }
  } catch {
    // Convert ~ to actual home directory path for non-existing paths too
    let actualPath = inputPath
    if (actualPath.startsWith("~/")) {
      const home = homedir()
      actualPath = actualPath.replace("~", home)
    }
    return {
      success: true,
      exists: false,
      actualPath,
      isFile: false,
      isDirectory: false,
    }
  }
})

// App event handlers
app.whenReady().then(() => {
  createWindow()

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})
