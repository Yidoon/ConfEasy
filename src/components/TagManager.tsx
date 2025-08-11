import React, { useState } from "react"
import { X, Plus, Check, Trash2 } from "lucide-react"
import { TaggedFile, FileTag } from "../App"
import { useI18n } from "../hooks/useI18n"

interface TagManagerProps {
  file: TaggedFile
  tags: FileTag[]
  onTagUpdate: (filePath: string, tags: string[]) => void
  onTagCreate: (tag: FileTag) => void
  onTagDelete: (tagId: string) => void
  onClose: () => void
}

const TAG_COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
]

export const TagManager: React.FC<TagManagerProps> = ({
  file,
  tags,
  onTagUpdate,
  onTagCreate,
  onTagDelete,
  onClose,
}) => {
  const { t } = useI18n()
  const [showCreateTag, setShowCreateTag] = useState(false)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState(TAG_COLORS[0])

  const handleTagToggle = (tagId: string) => {
    const currentTags = file.tags || []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((id) => id !== tagId)
      : [...currentTags, tagId]

    onTagUpdate(file.path, newTags)
  }

  const handleCreateTag = () => {
    if (!newTagName.trim()) return

    const newTag: FileTag = {
      id: Date.now().toString(),
      name: newTagName.trim(),
      color: newTagColor,
    }

    onTagCreate(newTag)
    onTagUpdate(file.path, [...(file.tags || []), newTag.id])

    setNewTagName("")
    setNewTagColor(TAG_COLORS[0])
    setShowCreateTag(false)
  }

  return (
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-4 max-w-xs">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium">{t('tagManager.title')}</h3>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className="flex items-center space-x-2 hover:bg-gray-50 dark:hover:bg-gray-600 p-1 rounded group"
          >
            <label className="flex items-center space-x-2 cursor-pointer flex-1">
              <input
                type="checkbox"
                checked={file.tags?.includes(tag.id) || false}
                onChange={() => handleTagToggle(tag.id)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  file.tags?.includes(tag.id)
                    ? "border-transparent"
                    : "border-gray-300 dark:border-gray-500"
                }`}
                style={{
                  backgroundColor: file.tags?.includes(tag.id)
                    ? tag.color
                    : "transparent",
                }}
              >
                {file.tags?.includes(tag.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
              <span className="text-sm flex-1">{tag.name}</span>
            </label>
            <button
              onClick={() => {
                if (
                  confirm(
                    `确定要删除标签 "${tag.name}" 吗？这将从所有文件中移除此标签。`
                  )
                ) {
                  onTagDelete(tag.id)
                }
              }}
              className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-200 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-opacity"
              title={t('tagManager.delete')}
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
        {!showCreateTag ? (
          <button
            onClick={() => setShowCreateTag(true)}
            className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <Plus className="w-4 h-4" />
            <span>{t('tagManager.createNew')}</span>
          </button>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder={t('tagManager.tagName')}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded bg-white dark:bg-gray-600"
              onKeyPress={(e) => e.key === "Enter" && handleCreateTag()}
            />
            <div className="flex items-center space-x-1">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTagColor(color)}
                  className={`w-6 h-6 rounded-full border-2 ${
                    newTagColor === color
                      ? "border-gray-400"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateTag}
                className="flex-1 px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
{t('tagManager.create')}
              </button>
              <button
                onClick={() => {
                  setShowCreateTag(false)
                  setNewTagName("")
                  setNewTagColor(TAG_COLORS[0])
                }}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-500 rounded hover:bg-gray-50 dark:hover:bg-gray-600"
              >
{t('tagManager.cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
