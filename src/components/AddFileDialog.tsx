import React, { useState } from "react"
import { X, Plus, FileText, Folder } from "lucide-react"
import { DefaultConfigFiles } from "./DefaultConfigFiles"
import { useI18n } from "../hooks/useI18n"

interface AddFileDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddFile: (filePath: string) => void
  onAddFolder: (folderPath: string) => void
  onSelectFile: () => void
  onSelectFolder: () => void
}

export const AddFileDialog: React.FC<AddFileDialogProps> = ({
  isOpen,
  onClose,
  onAddFile,
  onAddFolder,
  onSelectFile,
  onSelectFolder,
}) => {
  const { t } = useI18n()
  const [filePath, setFilePath] = useState("")
  const [error, setError] = useState("")
  const [activeTab, setActiveTab] = useState<"manual" | "defaults">("manual")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!filePath.trim()) {
      setError(t('addFileDialog.enterPath'))
      return
    }

    // Basic path validation
    if (
      !filePath.includes("/") &&
      !filePath.includes("\\") &&
      !filePath.startsWith("~")
    ) {
      setError(t('addFileDialog.error.emptyPath'))
      return
    }

    try {
      if (!window.electronAPI) {
        setError(t('addFileDialog.error.appError'))
        return
      }

      // Check if path exists and what type it is
      const pathInfo = await window.electronAPI.checkPath(filePath.trim())

      if (!pathInfo.exists) {
        setError(t('addFileDialog.error.pathNotExists'))
        return
      }

      if (pathInfo.isFile) {
        onAddFile(pathInfo.actualPath)
      } else if (pathInfo.isDirectory) {
        onAddFolder(pathInfo.actualPath)
      } else {
        setError(t('addFileDialog.error.invalidPath'))
        return
      }

      setFilePath("")
      setError("")
      onClose()
    } catch (error) {
      setError(t('addFileDialog.error.checkFailed'))
      console.error("Error checking path:", error)
    }
  }

  const handleClose = () => {
    setFilePath("")
    setError("")
    onClose()
  }

  const handleSelectFile = () => {
    onSelectFile()
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold">{t('addFile.title')}</h2>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            title={t('addFile.close')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab("defaults")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "defaults"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{t('addFileDialog.defaults')}</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("manual")}
            className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === "manual"
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>{t('addFileDialog.manual')}</span>
            </div>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "defaults" ? (
            <DefaultConfigFiles
              onAddFile={(filePath) => {
                onAddFile(filePath)
                onClose()
              }}
            />
          ) : (
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <button
                  onClick={handleSelectFile}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                >
                  <FileText className="w-5 h-5" />
                  <span>{t('addFileDialog.selectFile')}</span>
                </button>

                <button
                  onClick={onSelectFolder}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 transition-colors"
                >
                  <Folder className="w-5 h-5" />
                  <span>{t('addFileDialog.selectFolder')}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  或
                </span>
                <div className="flex-1 h-px bg-gray-300 dark:bg-gray-600"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="filePath"
                    className="block text-sm font-medium mb-2"
                  >
{t('addFileDialog.manualInput')}
                  </label>
                  <input
                    id="filePath"
                    type="text"
                    value={filePath}
                    onChange={(e) => {
                      setFilePath(e.target.value)
                      if (error) setError("")
                    }}
                    placeholder={t('addFileDialog.placeholder')}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                  )}
                </div>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t('addFileDialog.addPath')}</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <strong>提示:</strong> 支持添加任意配置文件，如 ~/.bashrc,
                  ~/.gitconfig, /etc/hosts 等
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
