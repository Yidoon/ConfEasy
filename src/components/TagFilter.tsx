import React from 'react'
import { X } from 'lucide-react'
import { FileTag } from '../App'
import { useI18n } from '../hooks/useI18n'

interface TagFilterProps {
  tags: FileTag[]
  selectedTags: string[]
  onTagSelect: (tags: string[]) => void
}

export const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagSelect
}) => {
  const { t } = useI18n()
  const handleTagClick = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onTagSelect(selectedTags.filter(id => id !== tagId))
    } else {
      onTagSelect([...selectedTags, tagId])
    }
  }

  const clearAllTags = () => {
    onTagSelect([])
  }

  if (tags.length === 0) return null

  return (
    <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
      <div className="flex items-center space-x-2 flex-wrap">
        <span className="text-sm text-gray-600 dark:text-gray-400">{t('tagFilter.label')}</span>
        
        {tags.map(tag => (
          <button
            key={tag.id}
            onClick={() => handleTagClick(tag.id)}
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-colors ${
              selectedTags.includes(tag.id)
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
            style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color + '20', color: tag.color } : {}}
          >
            {tag.name}
          </button>
        ))}
        
        {selectedTags.length > 0 && (
          <button
            onClick={clearAllTags}
            className="inline-flex items-center px-2 py-1 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-3 h-3 mr-1" />
            {t('tagFilter.clear')}
          </button>
        )}
      </div>
    </div>
  )
}