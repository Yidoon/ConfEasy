import React, { useEffect, useRef, useState } from "react"
import * as monaco from "monaco-editor"
import { Save, FileText, Loader2 } from "lucide-react"
import { TaggedFile } from "../App"
import { useI18n } from "../hooks/useI18n"

interface EditorProps {
  file: TaggedFile | null
  content: string
  onSave: (content: string) => void
  loading: boolean
}

// Function to determine language based on file path
const getLanguageFromPath = (filePath: string): string => {
  const fileName = filePath.split(/[\\/]/).pop()?.toLowerCase() || ""
  const extension = fileName.split(".").pop()

  // Configuration files mapping
  const languageMap: Record<string, string> = {
    // Shell configs
    zshrc: "shell",
    bashrc: "shell",
    bash_profile: "shell",
    profile: "shell",

    // Package managers
    npmrc: "ini",
    yarnrc: "yaml",

    // Git config
    gitconfig: "ini",
    gitignore: "plaintext",

    // SSH config
    config: fileName.includes("ssh") ? "plaintext" : "plaintext",

    // Editor configs
    editorconfig: "ini",

    // Common extensions
    json: "json",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    toml: "toml",
    ini: "ini",
    conf: "ini",
    cfg: "ini",
    sh: "shell",
    bash: "shell",
    zsh: "shell",
    js: "javascript",
    ts: "typescript",
    py: "python",
    rb: "ruby",
    go: "go",
    rs: "rust",
    java: "java",
    cpp: "cpp",
    c: "c",
    h: "cpp",
    hpp: "cpp",
    css: "css",
    scss: "scss",
    less: "less",
    html: "html",
    htm: "html",
    md: "markdown",
    txt: "plaintext",
    jsonl: "plaintext",  // JSON Lines - each line is a separate JSON object
    ndjson: "plaintext", // Newline Delimited JSON (same as jsonl)
  }

  // Special file name mappings
  if (fileName === "hosts") return "plaintext"
  if (fileName.startsWith(".zshrc")) return "shell"
  if (fileName.startsWith(".bashrc")) return "shell"
  if (fileName.startsWith(".bash_profile")) return "shell"
  if (fileName.startsWith(".gitconfig")) return "ini"
  if (fileName.startsWith(".npmrc")) return "ini"
  if (fileName === "dockerfile" || fileName.startsWith("dockerfile."))
    return "dockerfile"
  if (fileName === "makefile" || fileName.startsWith("makefile."))
    return "makefile"
  
  // Special handling for JSONL files
  if (extension === "jsonl" || extension === "ndjson") {
    return "plaintext" // Use plaintext to avoid JSON formatting errors
  }

  return languageMap[extension || ""] || "plaintext"
}

export const Editor: React.FC<EditorProps> = ({
  file,
  content,
  onSave,
  loading,
}) => {
  const { t } = useI18n()
  const editorRef = useRef<HTMLDivElement>(null)
  const monacoEditor = useRef<monaco.editor.IStandaloneCodeEditor | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [editorContent, setEditorContent] = useState("")

  useEffect(() => {
    if (editorRef.current && file) {
      // Dispose existing editor if any
      if (monacoEditor.current) {
        monacoEditor.current.dispose()
        monacoEditor.current = null
      }

      // Configure Monaco Editor for Electron
      try {
        // Set Monaco environment for Electron - use local fallback
        if (!self.MonacoEnvironment) {
          self.MonacoEnvironment = {
            getWorkerUrl: function () {
              return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                // Simple worker fallback for Electron
                self.onmessage = function() {};
              `)}`
            },
          }
        }

        // Configure Monaco Editor theme if not already defined
        try {
          monaco.editor.defineTheme("custom-dark", {
            base: "vs-dark",
            inherit: true,
            rules: [],
            colors: {
              "editor.background": "#1f2937",
              "editor.foreground": "#f9fafb",
            },
          })
        } catch (e) {
          // Theme might already be defined
        }

        // Check if it's a JSONL file
        const isJsonlFile = file.path.endsWith('.jsonl') || file.path.endsWith('.ndjson')
        
        monacoEditor.current = monaco.editor.create(editorRef.current, {
          value: content || "",
          language: getLanguageFromPath(file.path),
          theme: document.documentElement.classList.contains("dark")
            ? "custom-dark"
            : "vs",
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          lineNumbers: "on",
          wordWrap: "on",
          automaticLayout: true,
          readOnly: false,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          // Disable formatting for JSONL files
          formatOnPaste: !isJsonlFile,
          formatOnType: !isJsonlFile,
        })

        monacoEditor.current.onDidChangeModelContent(() => {
          const currentContent = monacoEditor.current?.getValue() || ""
          setEditorContent(currentContent)
          setHasChanges(currentContent !== content)
        })

        // Set initial content
        setEditorContent(content || "")
        setHasChanges(false)
      } catch (error) {
        console.error("Failed to initialize Monaco Editor:", error)
      }
    }

    return () => {
      if (monacoEditor.current) {
        monacoEditor.current.dispose()
        monacoEditor.current = null
      }
    }
  }, [file, content])

  // Content updates are now handled in the main useEffect above

  // Language is now set when creating the editor

  // Update theme based on dark mode
  useEffect(() => {
    const updateTheme = () => {
      if (monacoEditor.current) {
        const isDark = document.documentElement.classList.contains("dark")
        monaco.editor.setTheme(isDark ? "custom-dark" : "vs")
      }
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const handleSave = () => {
    if (hasChanges && editorContent !== undefined) {
      onSave(editorContent)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault()
      handleSave()
    }
  }

  if (!file) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
{t('editor.noFile')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
{t('editor.selectFile')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {file.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {file.path}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!file.exists && (
            <span className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded">
{t('editor.fileNotExists')}
            </span>
          )}

          {hasChanges && (
            <span className="text-xs text-blue-600 dark:text-blue-400">
{t('editor.unsaved')}
            </span>
          )}

          <button
            onClick={handleSave}
            disabled={!hasChanges || loading}
            className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
<span>{loading ? t('editor.saving') : t('editor.save')} {hasChanges && "(Ctrl+S)"}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={editorRef} className="absolute inset-0" />
      </div>
    </div>
  )
}
