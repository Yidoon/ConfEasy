import { contextBridge, ipcRenderer } from "electron"

export interface ConfigFile {
  name: string
  path: string
  exists: boolean
}

export interface FileResult {
  success: boolean
  content?: string
  error?: string
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  getConfigFiles: (): Promise<ConfigFile[]> =>
    ipcRenderer.invoke("get-config-files"),
  readFile: (filePath: string): Promise<FileResult> =>
    ipcRenderer.invoke("read-file", filePath),
  writeFile: (filePath: string, content: string): Promise<FileResult> =>
    ipcRenderer.invoke("write-file", filePath, content),
  selectFile: (): Promise<string | null> => ipcRenderer.invoke("select-file"),
  selectFolder: (): Promise<string | null> =>
    ipcRenderer.invoke("select-folder"),
  scanFolder: (
    folderPath: string
  ): Promise<{
    success: boolean
    files: Array<{ name: string; path: string; exists: boolean }>
    error?: string
  }> => ipcRenderer.invoke("scan-folder", folderPath),
  showItemInFolder: (filePath: string): Promise<void> =>
    ipcRenderer.invoke("show-item-in-folder", filePath),
  addFileByPath: (
    filePath: string
  ): Promise<{ success: boolean; exists: boolean; actualPath?: string }> =>
    ipcRenderer.invoke("add-file-by-path", filePath),
  getPlatform: (): Promise<string> => ipcRenderer.invoke("get-platform"),
  checkPath: (
    inputPath: string
  ): Promise<{
    success: boolean
    exists: boolean
    actualPath: string
    isFile: boolean
    isDirectory: boolean
  }> => ipcRenderer.invoke("check-path", inputPath),
})

declare global {
  interface Window {
    electronAPI: {
      getConfigFiles: () => Promise<ConfigFile[]>
      readFile: (filePath: string) => Promise<FileResult>
      writeFile: (filePath: string, content: string) => Promise<FileResult>
      selectFile: () => Promise<string | null>
      selectFolder: () => Promise<string | null>
      scanFolder: (folderPath: string) => Promise<{
        success: boolean
        files: Array<{ name: string; path: string; exists: boolean }>
        error?: string
      }>
      showItemInFolder: (filePath: string) => Promise<void>
      addFileByPath: (
        filePath: string
      ) => Promise<{ success: boolean; exists: boolean; actualPath?: string }>
      getPlatform: () => Promise<string>
      checkPath: (inputPath: string) => Promise<{
        success: boolean
        exists: boolean
        actualPath: string
        isFile: boolean
        isDirectory: boolean
      }>
    }
  }
}
