import React, { useState, useEffect } from "react"
import { Plus, FileText } from "lucide-react"
import { useI18n } from "../hooks/useI18n"

interface DefaultConfig {
  name: string
  path: string
  description: string
  category: string
}

interface DefaultConfigFilesProps {
  onAddFile: (filePath: string) => void
}

// Function to get platform-specific configs
const getPlatformConfigs = (platform: string, t: (key: string) => string): DefaultConfig[] => [
  // Shell 配置
  {
    name: ".zshrc",
    path: "~/.zshrc",
    description: t('config.zshrc.desc') || "Zsh shell configuration file",
    category: "Shell",
  },
  {
    name: ".bashrc",
    path: "~/.bashrc",
    description: t('config.bashrc.desc') || "Bash shell configuration file",
    category: "Shell",
  },
  {
    name: ".bash_profile",
    path: "~/.bash_profile",
    description: t('config.bash_profile.desc') || "Bash login configuration file",
    category: "Shell",
  },

  // 开发工具
  {
    name: ".gitconfig",
    path: "~/.gitconfig",
    description: t('config.gitconfig.desc') || "Git global configuration file",
    category: "dev",
  },
  {
    name: ".npmrc",
    path: "~/.npmrc",
    description: t('config.npmrc.desc') || "npm configuration file",
    category: "dev",
  },
  {
    name: "VS Code Settings",
    path:
      platform === "darwin"
        ? "~/Library/Application Support/Code/User/settings.json"
        : platform === "win32"
        ? "~/AppData/Roaming/Code/User/settings.json"
        : "~/.config/Code/User/settings.json",
    description: t('config.vscode.desc') || "Visual Studio Code user settings",
    category: "dev",
  },

  // 系统配置
  {
    name: "hosts",
    path:
      platform === "win32"
        ? "C:\\Windows\\System32\\drivers\\etc\\hosts"
        : "/etc/hosts",
    description: t('config.hosts.desc') || "System hosts file",
    category: "system",
  },
  {
    name: "SSH Config",
    path: "~/.ssh/config",
    description: t('config.ssh.desc') || "SSH client configuration file",
    category: "system",
  },

  // 编辑器配置
  {
    name: ".vimrc",
    path: "~/.vimrc",
    description: t('config.vimrc.desc') || "Vim editor configuration file",
    category: "editor",
  },
  {
    name: ".editorconfig",
    path: "~/.editorconfig",
    description: t('config.editorconfig.desc') || "EditorConfig global configuration",
    category: "editor",
  },
]

export const DefaultConfigFiles: React.FC<DefaultConfigFilesProps> = ({
  onAddFile,
}) => {
  const { t } = useI18n()
  const [configs, setConfigs] = useState<DefaultConfig[]>([])

  useEffect(() => {
    const loadPlatform = async () => {
      try {
        if (window.electronAPI) {
          const platformInfo = await window.electronAPI.getPlatform()
          setConfigs(getPlatformConfigs(platformInfo, t))
        } else {
          // Fallback for web environment - assume unix-like system
          setConfigs(getPlatformConfigs("linux", t))
        }
      } catch (error) {
        console.error("Failed to get platform:", error)
        // Fallback
        setConfigs(getPlatformConfigs("linux", t))
      }
    }
    loadPlatform()
  }, [t])

  const categories = [...new Set(configs.map((config) => config.category))]

  const getCategoryName = (category: string) => {
    const categoryMap: Record<string, string> = {
      'Shell': t('defaultConfigs.category.shell'),
      'dev': t('defaultConfigs.category.dev'),
      'system': t('defaultConfigs.category.system'),
      'editor': t('defaultConfigs.category.editor')
    }
    return categoryMap[category] || category
  }

  const handleAddConfig = (config: DefaultConfig) => {
    // Just pass the path as-is, the main process will handle the conversion
    onAddFile(config.path)
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold">{t('defaultConfigs.title')}</h3>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
{t('defaultConfigs.description')}
      </p>

      {categories.map((category) => (
        <div key={category} className="space-y-2">
          <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-1">
            {getCategoryName(category)}
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {configs
              .filter((config) => config.category === category)
              .map((config) => (
                <button
                  key={config.path}
                  onClick={() => handleAddConfig(config)}
                  className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors text-left"
                >
                  <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {config.name}
                    </h5>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {config.description}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-mono">
                      {config.path}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      ))}

      <div className="mt-6 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
        <p className="text-xs text-amber-700 dark:text-amber-300">
          {t('defaultConfigs.note')}
        </p>
      </div>
    </div>
  )
}
