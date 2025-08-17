import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'zh' | 'en'

interface I18nMessages {
  zh: Record<string, string>
  en: Record<string, string>
}

const messages: I18nMessages = {
  zh: {
    'app.title': 'ConfEasy',
    'app.subtitle': '配置文件管理工具',
    'header.add': '添加',
    'header.add.tooltip': '添加配置文件或文件夹',
    'header.darkMode.light': '切换到浅色模式',
    'header.darkMode.dark': '切换到深色模式',
    'header.settings': '设置',
    'settings.title': '设置',
    'settings.close': '关闭',
    'settings.theme': '主题',
    'settings.theme.light': '浅色',
    'settings.theme.dark': '深色',
    'settings.theme.system': '跟随系统',
    'settings.language': '语言',
    'settings.language.zh': '中文',
    'settings.language.en': 'English',
    'fileList.title': '配置文件',
    'fileList.stats': '共 {total} 个文件，{existing} 个存在',
    'fileList.notExists': '文件不存在',
    'fileList.tag.manage': '管理标签',
    'fileList.showInFolder': '在文件夹中显示',
    'fileList.remove': '移除文件',
    'fileList.remove.title': '移除文件',
    'fileList.remove.message': '确定要从管理列表中移除 "{fileName}" 吗？',
    'fileList.remove.note': '注意：这只会从应用中移除文件，不会删除实际文件。',
    'fileList.remove.confirm': '确认移除',
    'fileList.remove.cancel': '取消',
    'fileList.tag.remove': '移除标签',
    'addFile.title': '添加配置文件',
    'addFile.close': '关闭',
    'tagFilter.label': '过滤标签:',
    'tagFilter.clear': '清除',
    'tagManager.title': '管理标签',
    'tagManager.available': '可用标签:',
    'tagManager.createNew': '创建新标签',
    'tagManager.tagName': '标签名称',
    'tagManager.tagColor': '标签颜色',
    'tagManager.create': '创建',
    'tagManager.cancel': '取消',
    'tagManager.delete': '删除标签',
    'editor.noFile': '选择一个配置文件开始编辑',
    'editor.selectFile': '从左侧列表中选择一个文件来开始编辑',
    'editor.fileNotExists': '文件不存在，将在保存时创建',
    'editor.save': '保存',
    'editor.saving': '保存中...',
    'editor.unsaved': '未保存的更改',
    'addFileDialog.manual': '手动添加',
    'addFileDialog.defaults': '常用配置',
    'addFileDialog.inputPath': '输入文件或文件夹路径',
    'addFileDialog.placeholder': '例如: ~/.zshrc 或 /path/to/config',
    'addFileDialog.addPath': '添加路径',
    'addFileDialog.selectFile': '选择文件',
    'addFileDialog.selectFolder': '选择文件夹',
    'addFileDialog.enterPath': '请输入文件或文件夹路径',
    'addFileDialog.manualInput': '手动输入文件或文件夹路径',
    'defaultConfigs.title': '常用配置文件',
    'defaultConfigs.description': '点击下方配置文件快速添加到管理列表中',
    'defaultConfigs.category.shell': 'Shell',
    'defaultConfigs.category.dev': '开发工具',
    'defaultConfigs.category.system': '系统',
    'defaultConfigs.category.editor': '编辑器',
    'defaultConfigs.note': '提示：如果配置文件不存在，将显示为灰色状态。你可以直接在编辑器中创建内容并保存来创建文件。',
    'folder.noConfigFiles': '在选择的文件夹中未找到配置文件',
    'folder.scanFailed': '扫描文件夹失败: {error}',
    'addFileDialog.error.emptyPath': '请输入完整的路径',
    'addFileDialog.error.appError': '应用环境错误',
    'addFileDialog.error.pathNotExists': '输入的路径不存在，请检查路径是否正确',
    'addFileDialog.error.invalidPath': '输入的路径既不是文件也不是文件夹',
    'addFileDialog.error.checkFailed': '检查路径时发生错误',
    'config.zshrc.desc': 'Zsh shell 配置文件',
    'config.bashrc.desc': 'Bash shell 配置文件',
    'config.bash_profile.desc': 'Bash 登录配置文件',
    'config.gitconfig.desc': 'Git 全局配置文件',
    'config.npmrc.desc': 'npm 配置文件',
    'config.vscode.desc': 'Visual Studio Code 用户设置',
    'config.hosts.desc': '系统 hosts 文件',
    'config.ssh.desc': 'SSH 客户端配置文件',
    'config.vimrc.desc': 'Vim 编辑器配置文件',
    'config.editorconfig.desc': 'EditorConfig 全局配置',
    'folder.expand': '展开文件夹',
    'folder.collapse': '折叠文件夹',
    'folder.loading': '加载中...',
    'folder.empty': '文件夹为空',
    'folder.remove.title': '移除文件夹',
    'folder.remove.message': '确定要从管理列表中移除文件夹 "{folderName}" 吗？',
    'folder.remove.note': '注意：这只会从应用中移除文件夹，不会删除实际文件夹及其内容。',
    'folder.tag.manage': '管理文件夹标签',
    'folder.showInFolder': '在文件管理器中显示',
    'settings.advanced': '高级设置',
    'settings.resetOnboarding': '重置为初始状态',
    'settings.resetOnboarding.description': '清除所有配置，重新开始初始化设置',
    'onboarding.title': '欢迎使用 ConfEasy',
    'onboarding.subtitle': '选择您要管理的配置文件',
    'onboarding.loading': '加载中...',
    'onboarding.fileNotExists': '文件不存在',
    'onboarding.skip': '暂时跳过',
    'onboarding.confirm': '确认 ({count} 个文件)',
  },
  en: {
    'app.title': 'ConfEasy',
    'app.subtitle': 'Configuration File Manager',
    'header.add': 'Add',
    'header.add.tooltip': 'Add configuration file or folder',
    'header.darkMode.light': 'Switch to light mode',
    'header.darkMode.dark': 'Switch to dark mode',
    'header.settings': 'Settings',
    'settings.title': 'Settings',
    'settings.close': 'Close',
    'settings.theme': 'Theme',
    'settings.theme.light': 'Light',
    'settings.theme.dark': 'Dark',
    'settings.theme.system': 'Follow System',
    'settings.language': 'Language',
    'settings.language.zh': '中文',
    'settings.language.en': 'English',
    'fileList.title': 'Config Files',
    'fileList.stats': 'Total {total} files, {existing} exist',
    'fileList.notExists': 'File does not exist',
    'fileList.tag.manage': 'Manage tags',
    'fileList.showInFolder': 'Show in folder',
    'fileList.remove': 'Remove file',
    'fileList.remove.title': 'Remove File',
    'fileList.remove.message': 'Are you sure you want to remove "{fileName}" from the list?',
    'fileList.remove.note': 'Note: This will only remove the file from the app, not delete the actual file.',
    'fileList.remove.confirm': 'Confirm Remove',
    'fileList.remove.cancel': 'Cancel',
    'fileList.tag.remove': 'Remove tag',
    'addFile.title': 'Add Configuration File',
    'addFile.close': 'Close',
    'tagFilter.label': 'Filter by tags:',
    'tagFilter.clear': 'Clear',
    'tagManager.title': 'Manage Tags',
    'tagManager.available': 'Available tags:',
    'tagManager.createNew': 'Create New Tag',
    'tagManager.tagName': 'Tag Name',
    'tagManager.tagColor': 'Tag Color',
    'tagManager.create': 'Create',
    'tagManager.cancel': 'Cancel',
    'tagManager.delete': 'Delete Tag',
    'editor.noFile': 'Select a configuration file to start editing',
    'editor.selectFile': 'Choose a file from the left panel to start editing',
    'editor.fileNotExists': 'File does not exist, will be created when saved',
    'editor.save': 'Save',
    'editor.saving': 'Saving...',
    'editor.unsaved': 'Unsaved changes',
    'addFileDialog.manual': 'Manual Add',
    'addFileDialog.defaults': 'Common Configs',
    'addFileDialog.inputPath': 'Enter file or folder path',
    'addFileDialog.placeholder': 'e.g., ~/.zshrc or /path/to/config',
    'addFileDialog.addPath': 'Add Path',
    'addFileDialog.selectFile': 'Select File',
    'addFileDialog.selectFolder': 'Select Folder',
    'addFileDialog.enterPath': 'Please enter file or folder path',
    'addFileDialog.manualInput': 'Manually enter file or folder path',
    'defaultConfigs.title': 'Common Configuration Files',
    'defaultConfigs.description': 'Click on the configuration files below to quickly add them to your management list',
    'defaultConfigs.category.shell': 'Shell',
    'defaultConfigs.category.dev': 'Development Tools',
    'defaultConfigs.category.system': 'System',
    'defaultConfigs.category.editor': 'Editors',
    'defaultConfigs.note': 'Tip: If a configuration file does not exist, it will be shown in gray. You can create the file by adding content in the editor and saving.',
    'folder.noConfigFiles': 'No configuration files found in the selected folder',
    'folder.scanFailed': 'Failed to scan folder: {error}',
    'addFileDialog.error.emptyPath': 'Please enter a complete path',
    'addFileDialog.error.appError': 'Application environment error',
    'addFileDialog.error.pathNotExists': 'The entered path does not exist, please check the path',
    'addFileDialog.error.invalidPath': 'The entered path is neither a file nor a folder',
    'addFileDialog.error.checkFailed': 'Error occurred while checking path',
    'config.zshrc.desc': 'Zsh shell configuration file',
    'config.bashrc.desc': 'Bash shell configuration file', 
    'config.bash_profile.desc': 'Bash login configuration file',
    'config.gitconfig.desc': 'Git global configuration file',
    'config.npmrc.desc': 'npm configuration file',
    'config.vscode.desc': 'Visual Studio Code user settings',
    'config.hosts.desc': 'System hosts file',
    'config.ssh.desc': 'SSH client configuration file',
    'config.vimrc.desc': 'Vim editor configuration file',
    'config.editorconfig.desc': 'EditorConfig global configuration',
    'folder.expand': 'Expand folder',
    'folder.collapse': 'Collapse folder',
    'folder.loading': 'Loading...',
    'folder.empty': 'Folder is empty',
    'folder.remove.title': 'Remove Folder',
    'folder.remove.message': 'Are you sure you want to remove the folder "{folderName}" from the list?',
    'folder.remove.note': 'Note: This will only remove the folder from the app, not delete the actual folder and its contents.',
    'folder.tag.manage': 'Manage folder tags',
    'folder.showInFolder': 'Show in file manager',
    'settings.advanced': 'Advanced',
    'settings.resetOnboarding': 'Reset to Initial State',
    'settings.resetOnboarding.description': 'Clear all configurations and restart initialization',
    'onboarding.title': 'Welcome to ConfEasy',
    'onboarding.subtitle': 'Select configuration files you\'d like to manage',
    'onboarding.loading': 'Loading...',
    'onboarding.fileNotExists': 'File does not exist',
    'onboarding.skip': 'Skip for now',
    'onboarding.confirm': 'Confirm ({count} files)',
  }
}

interface I18nContextType {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

interface I18nProviderProps {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language')
    return (saved as Language) || 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', language)
  }, [language])

  const t = (key: string, params?: Record<string, string | number>): string => {
    let translation = messages[language][key] || messages.en[key] || key
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, String(value))
      })
    }
    
    return translation
  }

  const value: I18nContextType = {
    language,
    setLanguage,
    t
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext)
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}