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

// Get config templates with descriptions
const getConfigTemplates = () => {
  const home = homedir()
  const templates = [
    {
      name: ".npmrc",
      path: join(home, ".npmrc"),
      description: "NPM configuration file"
    },
    {
      name: ".zshrc",
      path: join(home, ".zshrc"),
      description: "Zsh shell configuration"
    },
    {
      name: ".bashrc",
      path: join(home, ".bashrc"),
      description: "Bash shell configuration"
    },
    {
      name: ".bash_profile",
      path: join(home, ".bash_profile"),
      description: "Bash profile settings"
    },
    {
      name: ".gitconfig",
      path: join(home, ".gitconfig"),
      description: "Git global configuration"
    },
    {
      name: "hosts",
      path: process.platform === "win32"
        ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
        : "/etc/hosts",
      description: "System hosts file"
    },
    {
      name: ".ssh/config",
      path: join(home, ".ssh", "config"),
      description: "SSH client configuration"
    },
    {
      name: "VS Code Settings",
      path: process.platform === "darwin"
        ? join(home, "Library", "Application Support", "Code", "User", "settings.json")
        : process.platform === "win32"
        ? join(home, "AppData", "Roaming", "Code", "User", "settings.json")
        : join(home, ".config", "Code", "User", "settings.json"),
      description: "Visual Studio Code settings"
    },
    {
      name: ".vimrc",
      path: join(home, ".vimrc"),
      description: "Vim editor configuration"
    },
    {
      name: ".tmux.conf",
      path: join(home, ".tmux.conf"),
      description: "Tmux terminal multiplexer configuration"
    }
  ]
  
  return templates
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

// Binary file patterns to exclude
const binaryPatterns = [
  /\.(exe|dll|so|dylib|dmg|pkg|deb|rpm)$/i,  // Executable files
  /\.(zip|tar|gz|bz2|7z|rar|xz)$/i,          // Compressed files
  /\.(jpg|jpeg|png|gif|bmp|ico|svg|webp)$/i, // Image files
  /\.(mp3|mp4|avi|mov|wmv|flv|wav|flac)$/i,  // Audio/video files
  /\.(pdf|doc|docx|xls|xlsx|ppt|pptx)$/i,    // Office documents
  /\.(ttf|otf|woff|woff2|eot)$/i,            // Font files
  /\.(bin|dat|db|sqlite)$/i,                 // Data files
  /\.DS_Store$/,                             // macOS system files
  /^Thumbs\.db$/,                            // Windows system files
]

async function scanDirectory(
  dirPath: string,
  files: Array<{ name: string; path: string; exists: boolean }>,
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
          // Exclude binary files, show all others
          const isBinary = binaryPatterns.some((pattern) =>
            pattern.test(entry)
          )

          if (!isBinary) {
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
          await scanDirectory(fullPath, files, maxDepth, currentDepth + 1)
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

// Scan folder for config files (flat list)
ipcMain.handle("scan-folder", async (_, folderPath: string) => {
  try {
    const files: Array<{ name: string; path: string; exists: boolean }> = []
    await scanDirectory(folderPath, files)
    return { success: true, files }
  } catch (error) {
    return { success: false, error: (error as Error).message, files: [] }
  }
})

// Type definition for file system item
interface FileSystemItem {
  name: string
  path: string
  type: 'file' | 'folder'
  exists: boolean
  tags?: string[]
  children?: FileSystemItem[]
  expanded?: boolean
  isLoading?: boolean
}

// Helper function to build only direct children (no recursion)
async function buildDirectChildren(dirPath: string): Promise<FileSystemItem[]> {
  const items: FileSystemItem[] = []
  console.log('[Backend] Scanning directory:', dirPath)
  
  try {
    const entries = await readdir(dirPath)
    console.log('[Backend] Found', entries.length, 'entries in', dirPath)
    
    for (const entry of entries) {
      const fullPath = join(dirPath, entry)
      
      try {
        const stats = await stat(fullPath)
        
        if (stats.isDirectory()) {
          if (entry !== "node_modules" && entry !== ".git") {
            items.push({
              name: entry,
              path: fullPath,
              type: 'folder',
              exists: true,
              tags: [],
              children: undefined, // undefined indicates not loaded yet
              expanded: false,
            })
          }
        } else if (stats.isFile()) {
          // Exclude binary files, show all others
          const isBinary = binaryPatterns.some((pattern) => pattern.test(entry))
          if (!isBinary) {
            items.push({
              name: entry,
              path: fullPath,
              type: 'file',
              exists: true,
              tags: [],
            })
          } else {
            console.log('[Backend] Excluded binary file:', entry)
          }
        }
      } catch (error) {
        continue
      }
    }
  } catch (error) {
    console.log('[Backend] Error reading directory:', dirPath, error)
  }
  
  console.log('[Backend] Returning', items.length, 'items for', dirPath)
  return items
}

// Helper function to build tree structure (keep for initial folder scan)
async function buildFileSystemTree(
  dirPath: string,
  maxDepth = 2,
  currentDepth = 0
): Promise<FileSystemItem[]> {
  const items: FileSystemItem[] = []

  if (currentDepth >= maxDepth) return items

  try {
    const entries = await readdir(dirPath)

    for (const entry of entries) {
      const fullPath = join(dirPath, entry)

      try {
        const stats = await stat(fullPath)

        if (stats.isDirectory()) {
          // Add folder
          const folder = {
            name: entry,
            path: fullPath,
            type: 'folder' as const,
            exists: true,
            children: undefined as FileSystemItem[] | undefined
          }

          // Skip certain directories
          if (entry !== "node_modules" && entry !== ".git") {
            // We'll load children lazily when folder is expanded
            folder.children = undefined
          }

          items.push(folder)
        } else if (stats.isFile()) {
          // Exclude binary files, show all others
          const isBinary = binaryPatterns.some((pattern) =>
            pattern.test(entry)
          )

          if (!isBinary) {
            items.push({
              name: entry,
              path: fullPath,
              type: 'file' as const,
              exists: true
            })
          }
        }
      } catch (error) {
        // Skip files/directories that can't be accessed
        continue
      }
    }
  } catch (error) {
    // Skip directories that can't be read
  }

  return items
}

// Scan folder and return tree structure
ipcMain.handle("scan-folder-tree", async (_, folderPath: string, maxDepth = 3) => {
  try {
    const items = await buildFileSystemTree(folderPath, maxDepth)
    return { success: true, items }
  } catch (error) {
    return { success: false, error: (error as Error).message, items: [] }
  }
})

// Get immediate children of a folder (only direct children)
ipcMain.handle("get-folder-contents", async (_, folderPath: string) => {
  try {
    const items = await buildDirectChildren(folderPath)
    return { success: true, items }
  } catch (error) {
    return { success: false, error: (error as Error).message, items: [] }
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

// Get config templates for onboarding
ipcMain.handle("get-config-templates", async () => {
  return getConfigTemplates()
})

// Check existence of multiple files at once
ipcMain.handle("check-files-existence", async (_, filePaths: string[]) => {
  const existence: Record<string, boolean> = {}
  
  for (const filePath of filePaths) {
    try {
      await access(filePath, constants.F_OK)
      existence[filePath] = true
    } catch {
      existence[filePath] = false
    }
  }
  
  return existence
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
