import { useState, useEffect, useRef } from "react"
import { FileList } from "./components/FileList"
import { Editor } from "./components/Editor"
import { Header } from "./components/Header"
import { TagFilter } from "./components/TagFilter"
import { AddFileDialog } from "./components/AddFileDialog"
import { SettingsDialog } from "./components/SettingsDialog"
import OnboardingDialog from "./components/OnboardingDialog"
import { useLocalStorage } from "./hooks/useLocalStorage"
import { useTheme } from "./hooks/useTheme"
import type { FileSystemItem } from './preload'

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

// Re-export for other components
export type { FileSystemItem }

function App() {
  const { theme, setTheme } = useTheme()
  const [files, setFiles] = useLocalStorage<TaggedFile[]>("customFiles", [])
  const [fileSystemItems, setFileSystemItems] = useLocalStorage<FileSystemItem[]>("fileSystemItems", [])
  const [expandedFoldersArray, setExpandedFoldersArray] = useLocalStorage<string[]>("expandedFolders", [])
  const expandedFolders = new Set(expandedFoldersArray)
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
  
  // Onboarding state
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage<boolean>("hasCompletedOnboarding", false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const hasInitialized = useRef(false)

  // Check for first launch and show onboarding
  useEffect(() => {
    if (!hasInitialized.current && window.electronAPI) {
      hasInitialized.current = true
      
      if (!hasCompletedOnboarding) {
        setShowOnboarding(true)
        // For first-time users, clear any existing files and start with empty list
        setFiles([])
      }
      // For returning users, files are automatically loaded from localStorage by useLocalStorage hook
    }
  }, [hasCompletedOnboarding, setFiles])
  
  // Handle onboarding confirmation
  const handleOnboardingConfirm = async (selectedPaths: string[]) => {
    if (!window.electronAPI) return
    
    // Load the selected files
    const selectedFiles: TaggedFile[] = []
    for (const path of selectedPaths) {
      // Get file name from path
      const name = path.split('/').pop() || path.split('\\').pop() || path
      selectedFiles.push({
        name,
        path,
        exists: true,
        tags: fileTags[path] || [],
      })
    }
    
    setFiles(selectedFiles)
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
  }
  
  // Handle onboarding skip
  const handleOnboardingSkip = () => {
    setFiles([])
    setHasCompletedOnboarding(true)
    setShowOnboarding(false)
  }

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
        // File was saved successfully - no need to refresh file list
        // since we're not auto-loading predefined configs anymore
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
        // Get folder name from path
        const folderName = folderPath.split('/').pop() || folderPath.split('\\').pop() || 'folder'
        
        // Add folder as a tree item
        const folderItem: FileSystemItem = {
          name: folderName,
          path: folderPath,
          type: 'folder',
          exists: true,
          tags: [],
          children: undefined,
          expanded: false,
        }
        
        // Check if folder already exists
        const folderExists = fileSystemItems.some((item) => item.path === folderPath)
        if (!folderExists) {
          setFileSystemItems((prev) => [...prev, folderItem])
        }
        
        setShowAddDialog(false)
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
      // Get folder name from path
      const folderName = folderPath.split('/').pop() || folderPath.split('\\').pop() || 'folder'
      
      // Add folder as a tree item
      const folderItem: FileSystemItem = {
        name: folderName,
        path: folderPath,
        type: 'folder',
        exists: true,
        tags: [],
        children: undefined,
        expanded: false,
      }
      
      // Check if folder already exists
      const folderExists = fileSystemItems.some((item) => item.path === folderPath)
      if (!folderExists) {
        setFileSystemItems((prev) => [...prev, folderItem])
      }
      
      setShowAddDialog(false)
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

  const handleFileSystemItemRemove = (itemToRemove: FileSystemItem) => {
    // Remove from fileSystemItems tree
    const removeFromTree = (items: FileSystemItem[]): FileSystemItem[] => {
      return items.filter((item) => {
        if (item.path === itemToRemove.path) {
          return false
        }
        if (item.children) {
          item.children = removeFromTree(item.children)
        }
        return true
      })
    }
    
    setFileSystemItems((prev) => removeFromTree(prev))

    // Clear selection if removing the currently selected item
    if (selectedFile?.path === itemToRemove.path) {
      setSelectedFile(null)
      setFileContent("")
    }

    // Remove item tags and all descendant tags
    const removeTagsRecursively = (item: FileSystemItem) => {
      const updatedFileTags = { ...fileTags }
      delete updatedFileTags[item.path]
      
      if (item.children) {
        item.children.forEach(child => {
          delete updatedFileTags[child.path]
          if (child.children) {
            removeTagsRecursively(child)
          }
        })
      }
      
      return updatedFileTags
    }
    
    setFileTags(removeTagsRecursively(itemToRemove))
  }

  // Handle folder toggle (expand/collapse)
  const handleToggleFolder = async (folderPath: string) => {
    console.log('Toggle folder:', folderPath)
    const isExpanded = expandedFolders.has(folderPath)
    
    if (isExpanded) {
      // Collapse folder
      setExpandedFoldersArray((prev) => prev.filter(p => p !== folderPath))
    } else {
      // Expand folder
      setExpandedFoldersArray((prev) => [...prev, folderPath])
      
      // Check if folder needs loading
      const needsLoading = checkIfNeedsLoading(fileSystemItems, folderPath)
      console.log('Needs loading:', needsLoading, 'for path:', folderPath)
      
      if (needsLoading) {
        // Set loading state
        setFileSystemItems((prev) => 
          updateItemInTree(prev, folderPath, (item) => ({ ...item, isLoading: true }))
        )
        
        try {
          // Load folder contents
          const result = await window.electronAPI?.getFolderContents(folderPath)
          console.log('API result for', folderPath, ':', result)
          
          if (result?.success) {
            // Update folder with loaded contents
            setFileSystemItems((prev) => 
              updateItemInTree(prev, folderPath, (item) => ({
                ...item,
                children: result.items,
                isLoading: false
              }))
            )
          } else {
            console.error('Failed to load folder:', result?.error)
            // Reset loading state on failure
            setFileSystemItems((prev) => 
              updateItemInTree(prev, folderPath, (item) => ({ ...item, isLoading: false }))
            )
          }
        } catch (error) {
          console.error('Error loading folder contents:', error)
          // Reset loading state on error
          setFileSystemItems((prev) => 
            updateItemInTree(prev, folderPath, (item) => ({ ...item, isLoading: false }))
          )
        }
      }
    }
  }
  
  // Helper function to check if folder needs loading
  const checkIfNeedsLoading = (items: FileSystemItem[], targetPath: string): boolean => {
    for (const item of items) {
      if (item.path === targetPath && item.type === 'folder') {
        console.log('Found folder:', targetPath, 'children:', item.children)
        return item.children === undefined
      }
      if (item.children) {
        const found = checkIfNeedsLoading(item.children, targetPath)
        if (found !== false) return found  // Fix: return the result even if false
      }
    }
    return false
  }
  
  // Helper function to update a specific item in the tree
  const updateItemInTree = (
    items: FileSystemItem[], 
    targetPath: string, 
    updater: (item: FileSystemItem) => FileSystemItem
  ): FileSystemItem[] => {
    return items.map((item) => {
      if (item.path === targetPath) {
        return updater(item)
      }
      if (item.children) {
        return {
          ...item,
          children: updateItemInTree(item.children, targetPath, updater)
        }
      }
      return item
    })
  }

  // Handle item selection from tree
  const handleItemSelect = (item: FileSystemItem) => {
    if (item.type === 'file') {
      const taggedFile: TaggedFile = {
        name: item.name,
        path: item.path,
        exists: item.exists,
        tags: item.tags || [],
      }
      handleFileSelect(taggedFile)
    }
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
      
      <OnboardingDialog
        open={showOnboarding}
        onConfirm={handleOnboardingConfirm}
        onSkip={handleOnboardingSkip}
      />

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
        onResetOnboarding={() => {
          setHasCompletedOnboarding(false)
          setShowOnboarding(true)
          setShowSettingsDialog(false)
        }}
      />

      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onTagSelect={setSelectedTags}
      />

      <div className="flex flex-1 overflow-hidden">
        <FileList
          files={filteredFiles}
          fileSystemItems={fileSystemItems}
          expandedFolders={expandedFolders}
          selectedFile={selectedFile}
          onFileSelect={handleFileSelect}
          onItemSelect={handleItemSelect}
          onToggleFolder={handleToggleFolder}
          tags={tags}
          onTagUpdate={handleTagUpdate}
          onTagCreate={handleTagCreate}
          onTagDelete={handleTagDelete}
          onFileRemove={handleFileRemove}
          onFileSystemItemRemove={handleFileSystemItemRemove}
          onAddFile={handleAddCustomFile}
          fileTags={fileTags}
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
