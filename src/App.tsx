import { useState, useEffect, useCallback } from "react"
import { FileList } from "./components/FileList"
import { Editor } from "./components/Editor"
import { Header } from "./components/Header"
import { TagFilter } from "./components/TagFilter"
import { AddFileDialog } from "./components/AddFileDialog"
import { SettingsDialog } from "./components/SettingsDialog"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useTheme } from "./hooks/useTheme"
import { useI18n } from "./hooks/useI18n"

export interface ConfigFile {
  name: string
  path: string
  exists: boolean
}

export interface FileTag {
  id: string
  name: string
  color: string
}

export interface TaggedFile extends ConfigFile {
  tags: string[]
}

function App() {
  const { theme, setTheme } = useTheme()
  const { t } = useI18n()
  const [files, setFiles] = useState<TaggedFile[]>([])
  const [selectedFile, setSelectedFile] = useState<TaggedFile | null>(null)
  const [fileContent, setFileContent] = useState("")
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useLocalStorage<FileTag[]>("tags", [])
  const [fileTags, setFileTags] = useLocalStorage<Record<string, string[]>>(
    "fileTags",
    {}
  )
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showSettingsDialog, setShowSettingsDialog] = useState(false)

  const loadConfigFiles = useCallback(async () => {
    try {
      if (!window.electronAPI) {
        console.warn("Electron API not available - running in web mode")
        return
      }
      const configFiles = await window.electronAPI.getConfigFiles()
      const taggedFiles = configFiles.map((file) => ({
        ...file,
        tags: fileTags[file.path] || [],
      }))
      setFiles(taggedFiles)
    } catch (error) {
      console.error("Failed to load config files:", error)
    }
  }, [fileTags])

  // Load config files on mount
  useEffect(() => {
    loadConfigFiles()
  }, [loadConfigFiles])

  const handleFileSelect = async (file: TaggedFile) => {
    if (!file.exists) {
      setSelectedFile(file)
      setFileContent("")
      return
    }

    if (!window.electronAPI) {
      console.warn("Electron API not available")
      return
    }

    setLoading(true)
    try {
      const result = await window.electronAPI.readFile(file.path)
      if (result.success && result.content !== undefined) {
        setFileContent(result.content)
        setSelectedFile(file)
      } else {
        console.error("Failed to read file:", result.error)
      }
    } catch (error) {
      console.error("Error reading file:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileSave = async (content: string) => {
    if (!selectedFile || !window.electronAPI) return

    setLoading(true)
    try {
      const result = await window.electronAPI.writeFile(
        selectedFile.path,
        content
      )
      if (result.success) {
        setFileContent(content)
        // Refresh file list to update exists status
        await loadConfigFiles()
      } else {
        console.error("Failed to save file:", result.error)
      }
    } catch (error) {
      console.error("Error saving file:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomFile = async () => {
    setShowAddDialog(true)
  }

  const handleSelectFile = async () => {
    if (!window.electronAPI) return

    try {
      const filePath = await window.electronAPI.selectFile()
      if (filePath) {
        await addFileToList(filePath)
      }
    } catch (error) {
      console.error("Error selecting file:", error)
    }
  }

  const handleSelectFolder = async () => {
    if (!window.electronAPI) return

    try {
      const folderPath = await window.electronAPI.selectFolder()
      if (folderPath) {
        // Scan folder for config files
        const result = await window.electronAPI.scanFolder(folderPath)
        if (result.success && result.files.length > 0) {
          // Add all found config files
          for (const file of result.files) {
            const fileName = file.name
            const customFile: TaggedFile = {
              name: fileName,
              path: file.path,
              exists: file.exists,
              tags: [],
            }

            // Check if file already exists in list
            const fileExists = files.some((f) => f.path === file.path)
            if (!fileExists) {
              setFiles((prev) => [...prev, customFile])
            }
          }
          setShowAddDialog(false)
        } else if (result.success && result.files.length === 0) {
          alert(t('folder.noConfigFiles'))
        } else {
          alert(t('folder.scanFailed', { error: result.error || 'Unknown error' }))
        }
      }
    } catch (error) {
      console.error("Error selecting folder:", error)
    }
  }

  const handleAddFileByPath = async (filePath: string) => {
    try {
      await addFileToList(filePath)
    } catch (error) {
      console.error("Error adding file by path:", error)
    }
  }

  const handleAddFolderByPath = async (folderPath: string) => {
    if (!window.electronAPI) return

    try {
      // Scan folder for config files
      const result = await window.electronAPI.scanFolder(folderPath)
      if (result.success && result.files.length > 0) {
        // Add all found config files
        for (const file of result.files) {
          const fileName = file.name
          const customFile: TaggedFile = {
            name: fileName,
            path: file.path,
            exists: file.exists,
            tags: [],
          }

          // Check if file already exists in list
          const fileExists = files.some((f) => f.path === file.path)
          if (!fileExists) {
            setFiles((prev) => [...prev, customFile])
          }
        }
      } else if (result.success && result.files.length === 0) {
        alert(t('folder.noConfigFiles'))
      } else {
        alert(t('folder.scanFailed', { error: result.error || 'Unknown error' }))
      }
    } catch (error) {
      console.error("Error adding folder by path:", error)
    }
  }

  const addFileToList = async (filePath: string) => {
    if (!window.electronAPI) return

    try {
      const result = await window.electronAPI.addFileByPath(filePath)
      if (result.success) {
        const actualPath = result.actualPath || filePath
        const fileName = actualPath.split(/[\\/]/).pop() || "unknown"
        const customFile: TaggedFile = {
          name: fileName,
          path: actualPath,
          exists: result.exists,
          tags: [],
        }

        // Check if file already exists in list
        const fileExists = files.some((f) => f.path === actualPath)
        if (!fileExists) {
          setFiles((prev) => [...prev, customFile])
        }
      }
    } catch (error) {
      console.error("Error adding file:", error)
    }
  }

  const handleTagUpdate = (filePath: string, newTags: string[]) => {
    const updatedFileTags = { ...fileTags, [filePath]: newTags }
    setFileTags(updatedFileTags)

    setFiles((prev) =>
      prev.map((file) =>
        file.path === filePath ? { ...file, tags: newTags } : file
      )
    )
  }

  const handleTagCreate = (tag: FileTag) => {
    setTags((prev: FileTag[]) => [...prev, tag])
  }

  const handleTagDelete = (tagId: string) => {
    // Remove tag from tags list
    setTags((prev) => prev.filter((tag) => tag.id !== tagId))

    // Remove tag from all files
    const updatedFileTags = { ...fileTags }
    Object.keys(updatedFileTags).forEach((filePath) => {
      updatedFileTags[filePath] = updatedFileTags[filePath].filter(
        (id) => id !== tagId
      )
    })
    setFileTags(updatedFileTags)

    // Update files state
    setFiles((prev) =>
      prev.map((file) => ({
        ...file,
        tags: file.tags.filter((id) => id !== tagId),
      }))
    )

    // Clear selected tags if deleted tag was selected
    setSelectedTags((prev) => prev.filter((id) => id !== tagId))
  }

  const handleFileRemove = (fileToRemove: TaggedFile) => {
    setFiles((prev) => prev.filter((file) => file.path !== fileToRemove.path))

    // Clear selection if removing the currently selected file
    if (selectedFile?.path === fileToRemove.path) {
      setSelectedFile(null)
      setFileContent("")
    }

    // Remove file tags
    const updatedFileTags = { ...fileTags }
    delete updatedFileTags[fileToRemove.path]
    setFileTags(updatedFileTags)
  }

  const filteredFiles =
    selectedTags.length > 0
      ? files.filter(
          (file) =>
            file.exists &&
            selectedTags.some((tagId) => file.tags.includes(tagId))
        )
      : files.filter((file) => file.exists)

  return (
    <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
      <Header onOpenSettings={() => setShowSettingsDialog(true)} />

      <AddFileDialog
        isOpen={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAddFile={handleAddFileByPath}
        onAddFolder={handleAddFolderByPath}
        onSelectFile={handleSelectFile}
        onSelectFolder={handleSelectFolder}
      />

      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={() => setShowSettingsDialog(false)}
        theme={theme}
        onThemeChange={setTheme}
      />

      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={setSelectedTags}
      />

      <div className="flex flex-1 overflow-hidden">
        <FileList
          files={filteredFiles}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          tags={tags}
          onTagUpdate={handleTagUpdate}
          onTagCreate={handleTagCreate}
          onTagDelete={handleTagDelete}
          onFileRemove={handleFileRemove}
          onAddFile={handleAddCustomFile}
        />

        <div className="flex-1 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <Editor
            file={selectedFile}
            content={fileContent}
            onSave={handleFileSave}
            loading={loading}
          />
        </div>
      </div>
    </div>
  )
}

export default App
