import React, { useState } from "react"
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, AlertCircle, Tag, Trash2, X } from "lucide-react"
import { FileSystemItem, FileTag } from "../App"
import { TagManager } from "./TagManager"
import { useI18n } from "../hooks/useI18n"

interface FileTreeItemProps {
  item: FileSystemItem
  level: number
  selectedPath: string | null
  expandedFolders: Set<string>
  onSelect: (item: FileSystemItem) => void
  onToggleFolder: (path: string) => void
  onAddTag: (path: string, tagId: string) => void
  onRemoveTag: (path: string, tagId: string) => void
  onTagUpdate?: (path: string, tags: string[]) => void
  onTagCreate?: (tag: FileTag) => void
  onTagDelete?: (tagId: string) => void
  onItemRemove?: (item: FileSystemItem) => void
  tags: Array<{ id: string; name: string; color: string }>
  itemTags: string[]
  fileTags?: Record<string, string[]>
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level,
  selectedPath,
  expandedFolders,
  onSelect,
  onToggleFolder,
  onAddTag,
  onRemoveTag,
  onTagUpdate,
  onTagCreate,
  onTagDelete,
  onItemRemove,
  tags,
  itemTags,
  fileTags = {},
}) => {
  const { t } = useI18n()
  const [showTagManager, setShowTagManager] = useState(false)
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false)
  const isExpanded = expandedFolders.has(item.path)
  const isSelected = selectedPath === item.path
  const hasChildren = item.type === 'folder' && item.children !== undefined && item.children.length > 0
  const canExpand = item.type === 'folder'
  const currentItemTags = fileTags[item.path] || itemTags || []
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.type === 'folder') {
      onToggleFolder(item.path)
    } else {
      onSelect(item)
    }
  }

  const handleChevronClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (canExpand) {
      onToggleFolder(item.path)
    }
  }

  const getIcon = () => {
    if (item.type === 'folder') {
      if (item.isLoading) {
        return <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      }
      return isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />
    }
    return <File className="w-4 h-4" />
  }

  const handleShowInFolder = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window.electronAPI) return
    
    try {
      await window.electronAPI.showItemInFolder(item.path)
    } catch (error) {
      console.error("Error showing item in folder:", error)
    }
  }

  const handleRemoveItem = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onItemRemove) {
      onItemRemove(item)
    }
    setShowRemoveConfirm(false)
  }

  return (
    <>
      <div
        className={`flex items-center px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer group ${
          isSelected ? "bg-blue-50 dark:bg-blue-900/30" : ""
        }`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
      >
        {canExpand && (
          <div
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            onClick={handleChevronClick}
          >
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </div>
        )}
        {!canExpand && <div className="w-5" />}
        
        <div className="flex items-center flex-1 ml-1">
          <span className={`mr-2 ${!item.exists ? "text-gray-400" : ""}`}>
            {getIcon()}
          </span>
          <span
            className={`flex-1 text-sm truncate ${
              !item.exists ? "text-gray-400 italic" : ""
            }`}
            title={item.path}
          >
            {item.name}
          </span>
          {!item.exists && (
            <span title="File does not exist">
              <AlertCircle className="w-3 h-3 text-yellow-500 ml-1" />
            </span>
          )}
        </div>

        {/* Show tags for both files and folders */}
        <div className="flex items-center space-x-1 ml-2">
          {currentItemTags.map((tagId) => {
            const tag = tags.find((t) => t.id === tagId)
            if (!tag) return null
            return (
              <span
                key={tag.id}
                className="group/tag inline-flex items-center px-2 py-0.5 text-xs rounded-full"
                style={{
                  backgroundColor: `${tag.color}20`,
                  color: tag.color,
                  border: `1px solid ${tag.color}40`,
                }}
              >
                <span>{tag.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    if (onTagUpdate) {
                      const updatedTags = currentItemTags.filter(
                        (id) => id !== tagId
                      )
                      onTagUpdate(item.path, updatedTags)
                    }
                  }}
                  className="ml-1 p-0.5 rounded-full opacity-0 group-hover/tag:opacity-100 hover:bg-black/10 transition-opacity"
                  title={t('fileList.tag.remove')}
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )
          })}
        </div>

        {/* Action buttons for both files and folders */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowTagManager(!showTagManager)
            }}
            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
            title={t('fileList.tag.manage')}
          >
            <Tag className="w-3 h-3" />
          </button>
          {item.exists && (
            <button
              onClick={handleShowInFolder}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
              title={t('fileList.showInFolder')}
            >
              <FolderOpen className="w-3 h-3" />
            </button>
          )}
          {onItemRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowRemoveConfirm(!showRemoveConfirm)
              }}
              className="p-1 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
              title={t('fileList.remove')}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Tag Manager Popup */}
      {showTagManager && onTagUpdate && onTagCreate && onTagDelete && (
        <div className="relative">
          <div 
            className="absolute z-10 mt-1" 
            style={{ 
              left: `${level * 20 + 8}px`,
              right: '8px'
            }}
          >
            <TagManager
              file={{
                name: item.name,
                path: item.path,
                exists: item.exists,
                tags: currentItemTags
              }}
              tags={tags}
              onTagUpdate={onTagUpdate}
              onTagCreate={onTagCreate}
              onTagDelete={onTagDelete}
              onClose={() => setShowTagManager(false)}
            />
          </div>
        </div>
      )}

      {/* Remove Confirmation Popup */}
      {showRemoveConfirm && onItemRemove && (
        <div className="relative">
          <div 
            className="absolute z-10 mt-1" 
            style={{ 
              left: `${level * 20 + 8}px`,
              right: '8px'
            }}
          >
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
                    {t('fileList.remove.message', { fileName: item.name })}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                    {t('fileList.remove.note')}
                  </p>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={handleRemoveItem}
                      className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      {t('fileList.remove.confirm')}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowRemoveConfirm(false)
                      }}
                      className="px-3 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      {t('fileList.remove.cancel')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isExpanded && hasChildren && (
        <div>
          {item.children!.map((child) => (
            <FileTreeItem
              key={child.path}
              item={child}
              level={level + 1}
              selectedPath={selectedPath}
              expandedFolders={expandedFolders}
              onSelect={onSelect}
              onToggleFolder={onToggleFolder}
              onAddTag={onAddTag}
              onRemoveTag={onRemoveTag}
              onTagUpdate={onTagUpdate}
              onTagCreate={onTagCreate}
              onTagDelete={onTagDelete}
              onItemRemove={onItemRemove}
              tags={tags}
              itemTags={child.tags || []}
              fileTags={fileTags}
            />
          ))}
        </div>
      )}
    </>
  )
}