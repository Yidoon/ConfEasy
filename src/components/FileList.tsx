import React, { useState } from "react"
import { File, FileX, FolderOpen, Tag, Trash2, X, Plus } from "lucide-react"
import { TaggedFile, FileTag, FileSystemItem } from "../App"
import { TagManager } from "./TagManager"
import { FileTreeItem } from "./FileTreeItem"
import { useI18n } from "../hooks/useI18n"

interface FileListProps {
  files: TaggedFile[]
  fileSystemItems: FileSystemItem[]
  expandedFolders: Set<string>
  selectedFile: TaggedFile | null
  onFileSelect: (file: TaggedFile) => void
  onItemSelect: (item: FileSystemItem) => void
  onToggleFolder: (path: string) => void
  tags: FileTag[]
  onTagUpdate: (filePath: string, tags: string[]) => void
  onTagCreate: (tag: FileTag) => void
  onTagDelete: (tagId: string) => void
  onFileRemove: (file: TaggedFile) => void
  onFileSystemItemRemove: (item: FileSystemItem) => void
  onAddFile: () => void
  fileTags: Record<string, string[]>
}

// Helper functions to count items in tree
const countTotalItems = (items: FileSystemItem[]): number => {
  let count = 0
  for (const item of items) {
    if (item.type === 'file') {
      count++
    }
    if (item.children) {
      count += countTotalItems(item.children)
    }
  }
  return count
}

const countExistingItems = (items: FileSystemItem[]): number => {
  let count = 0
  for (const item of items) {
    if (item.type === 'file' && item.exists) {
      count++
    }
    if (item.children) {
      count += countExistingItems(item.children)
    }
  }
  return count
}

export const FileList: React.FC<FileListProps> = ({
  files,
  fileSystemItems,
  expandedFolders,
  selectedFile,
  onFileSelect,
  onItemSelect,
  onToggleFolder,
  tags,
  onTagUpdate,
  onTagCreate,
  onTagDelete,
  onFileRemove,
  onFileSystemItemRemove,
  onAddFile,
  fileTags,
}) => {
  const { t } = useI18n()
  const [showTagManager, setShowTagManager] = useState<string | null>(null)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(
    null
  )

  const handleShowInFolder = async (filePath: string) => {
    if (!window.electronAPI) return

    try {
      await window.electronAPI.showItemInFolder(filePath)
    } catch (error) {
      console.error("Error showing file in folder:", error)
    }
  }

  const handleRemoveFile = (file: TaggedFile) => {
    onFileRemove(file)
    setShowRemoveConfirm(null)
  }

  const getFileIcon = (file: TaggedFile) => {
    if (!file.exists) {
      return <FileX className="w-4 h-4 text-gray-400" />
    }
    return <File className="w-4 h-4 text-blue-600 dark:text-blue-400" />
  }

  return (
    <div className="w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {t('fileList.title')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('fileList.stats', { 
            total: countTotalItems(fileSystemItems) + files.length, 
            existing: countExistingItems(fileSystemItems) + files.filter((f) => f.exists).length
          })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="py-1">
          {/* Render all folders first */}
          {fileSystemItems.map((item) => (
            <FileTreeItem
              key={item.path}
              item={item}
              level={0}
              selectedPath={selectedFile?.path || null}
              expandedFolders={expandedFolders}
              onSelect={onItemSelect}
              onToggleFolder={onToggleFolder}
              onAddTag={(path, tagId) => {
                const currentTags = fileTags[path] || []
                if (!currentTags.includes(tagId)) {
                  onTagUpdate(path, [...currentTags, tagId])
                }
              }}
              onRemoveTag={(path, tagId) => {
                const currentTags = fileTags[path] || []
                onTagUpdate(path, currentTags.filter(id => id !== tagId))
              }}
              onTagUpdate={onTagUpdate}
              onTagCreate={onTagCreate}
              onTagDelete={onTagDelete}
              onItemRemove={onFileSystemItemRemove}
              tags={tags}
              itemTags={fileTags[item.path] || []}
              fileTags={fileTags}
            />
          ))}
          
          {/* Then render all standalone files */}
          {files.map((file) => (
            <div
              key={file.path}
              className={`group relative rounded-lg p-2 mx-2 my-1 cursor-pointer transition-colors ${
                selectedFile?.path === file.path
                  ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              onClick={() => onFileSelect(file)}
            >
              <div className="flex items-start space-x-3">
                {getFileIcon(file)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {file.name}
                    </p>
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowTagManager(
                            showTagManager === file.path ? null : file.path
                          )
                        }}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        title={t('fileList.tag.manage')}
                      >
                        <Tag className="w-3 h-3" />
                      </button>
                      {file.exists && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleShowInFolder(file.path)
                          }}
                          className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title={t('fileList.showInFolder')}
                        >
                          <FolderOpen className="w-3 h-3" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setShowRemoveConfirm(
                            showRemoveConfirm === file.path ? null : file.path
                          )
                        }}
                        className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                        title={t('fileList.remove')}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                    {file.path}
                  </p>

                  {!file.exists && (
                    <p className="text-xs text-red-500 mt-1">{t('fileList.notExists')}</p>
                  )}

                  {file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {file.tags.map((tagId) => {
                        const tag = tags.find((t) => t.id === tagId)
                        if (!tag) return null
                        return (
                          <div
                            key={tagId}
                            className="group inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium relative"
                            style={{
                              backgroundColor: tag.color + "20",
                              color: tag.color,
                            }}
                          >
                            <span>{tag.name}</span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                const updatedTags = file.tags.filter(
                                  (id) => id !== tagId
                                )
                                onTagUpdate(file.path, updatedTags)
                              }}
                              className="ml-1 p-0.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-black/10 transition-opacity"
                              title={t('fileList.tag.remove')}
                            >
                              <X className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {showTagManager === file.path && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1">
                  <TagManager
                    file={file}
                    tags={tags}
                    onTagUpdate={onTagUpdate}
                    onTagCreate={onTagCreate}
                    onTagDelete={onTagDelete}
                    onClose={() => setShowTagManager(null)}
                  />
                </div>
              )}

              {showRemoveConfirm === file.path && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1">
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <Trash2 className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {t('fileList.remove.title')}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {t('fileList.remove.message', { fileName: file.name })}
                        </p>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                          {t('fileList.remove.note')}
                        </p>
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => handleRemoveFile(file)}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            {t('fileList.remove.confirm')}
                          </button>
                          <button
                            onClick={() => setShowRemoveConfirm(null)}
                            className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                          >
                            {t('fileList.remove.cancel')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Fixed Add Button at Bottom */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onAddFile}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          title={t('header.add.tooltip')}
        >
          <Plus className="w-4 h-4" />
          <span>{t('header.add')}</span>
        </button>
      </div>
    </div>
  )
}
