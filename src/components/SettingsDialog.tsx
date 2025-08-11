import React from 'react'
import { X, Moon, Sun, Globe, Monitor } from 'lucide-react'
import { useI18n } from '../hooks/useI18n'
import { ThemeMode } from '../hooks/useTheme'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  theme: ThemeMode
  onThemeChange: (theme: ThemeMode) => void
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  theme,
  onThemeChange,
}) => {
  const { t, language, setLanguage } = useI18n()

  if (!isOpen) return null

  const handleLanguageChange = (newLanguage: any) => {
    setLanguage(newLanguage)
  }

  const handleThemeChange = (newTheme: ThemeMode) => {
    onThemeChange(newTheme)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-96 max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t('settings.title')}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title={t('settings.close')}
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Moon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.theme')}
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleThemeChange('light')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  theme === 'light'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Sun className="w-4 h-4" />
                  <span className="text-xs">{t('settings.theme.light')}</span>
                </div>
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  theme === 'dark'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Moon className="w-4 h-4" />
                  <span className="text-xs">{t('settings.theme.dark')}</span>
                </div>
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  theme === 'system'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex flex-col items-center space-y-1">
                  <Monitor className="w-4 h-4" />
                  <span className="text-xs">{t('settings.theme.system')}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Language Settings */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {t('settings.language')}
              </h3>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleLanguageChange('zh')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  language === 'zh'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm">{t('settings.language.zh')}</span>
                </div>
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`flex-1 p-3 rounded-lg border-2 transition-colors ${
                  language === 'en'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-center">
                  <span className="text-sm">{t('settings.language.en')}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            {t('settings.close')}
          </button>
        </div>
      </div>
    </div>
  )
}