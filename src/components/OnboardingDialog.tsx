import React, { useState, useEffect } from 'react';
import { FileText, Check } from 'lucide-react';
import { useI18n } from '../hooks/useI18n';

interface ConfigTemplate {
  name: string;
  path: string;
  description?: string;
}

interface OnboardingDialogProps {
  open: boolean;
  onConfirm: (selectedFiles: string[]) => void;
  onSkip: () => void;
}

const OnboardingDialog: React.FC<OnboardingDialogProps> = ({ open, onConfirm, onSkip }) => {
  const { t } = useI18n();
  const [configTemplates, setConfigTemplates] = useState<ConfigTemplate[]>([]);
  const [fileExistence, setFileExistence] = useState<Record<string, boolean>>({});
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadConfigTemplates();
    }
  }, [open]);

  const loadConfigTemplates = async () => {
    setLoading(true);
    
    // Get predefined config templates
    const templates = await window.electronAPI.getConfigTemplates();
    setConfigTemplates(templates);
    
    // Check file existence for all templates
    const paths = templates.map(t => t.path);
    const existence = await window.electronAPI.checkFilesExistence(paths);
    setFileExistence(existence);
    
    // Auto-select existing files
    const existingFiles = new Set<string>();
    templates.forEach(template => {
      if (existence[template.path]) {
        existingFiles.add(template.path);
      }
    });
    setSelectedFiles(existingFiles);
    
    setLoading(false);
  };

  const handleToggle = (path: string) => {
    if (!fileExistence[path]) return; // Don't allow selection of non-existent files
    
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(path)) {
      newSelected.delete(path);
    } else {
      newSelected.add(path);
    }
    setSelectedFiles(newSelected);
  };

  const handleConfirm = () => {
    onConfirm(Array.from(selectedFiles));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {t('onboarding.title')}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t('onboarding.subtitle')}
          </p>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600 dark:text-gray-400">{t('onboarding.loading')}</span>
            </div>
          ) : (
            <div className="space-y-2">
              {configTemplates.map((template) => {
                const exists = fileExistence[template.path];
                const isSelected = selectedFiles.has(template.path);
                
                return (
                  <div
                    key={template.path}
                    onClick={() => handleToggle(template.path)}
                    className={`
                      flex items-start p-3 rounded-lg border transition-all cursor-pointer
                      ${exists 
                        ? 'hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600' 
                        : 'opacity-50 cursor-not-allowed border-gray-100 dark:border-gray-700'
                      }
                      ${isSelected && exists
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600'
                        : ''
                      }
                    `}
                  >
                    {/* Checkbox */}
                    <div className="flex items-center h-5 mr-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!exists}
                        onChange={() => {}}
                        className={`
                          w-4 h-4 rounded border-gray-300 dark:border-gray-600
                          ${exists 
                            ? 'text-blue-600 focus:ring-blue-500' 
                            : 'text-gray-300 cursor-not-allowed'
                          }
                        `}
                      />
                    </div>
                    
                    {/* Icon */}
                    <FileText 
                      className={`
                        w-5 h-5 mr-3 flex-shrink-0 mt-0.5
                        ${exists 
                          ? 'text-blue-600 dark:text-blue-400' 
                          : 'text-gray-400 dark:text-gray-600'
                        }
                      `}
                    />
                    
                    {/* Text content */}
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className={`
                          font-medium
                          ${exists 
                            ? 'text-gray-900 dark:text-gray-100' 
                            : 'text-gray-500 dark:text-gray-500'
                          }
                        `}>
                          {template.name}
                        </span>
                        {!exists && (
                          <span className="ml-2 text-xs text-orange-600 dark:text-orange-400">
                            ({t('onboarding.fileNotExists')})
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {template.path}
                      </div>
                      {template.description && (
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {template.description}
                        </div>
                      )}
                    </div>
                    
                    {/* Status indicator */}
                    {exists && (
                      <div className="ml-2 flex-shrink-0">
                        {isSelected ? (
                          <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <div className="w-5 h-5" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between">
          <button
            onClick={onSkip}
            className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            {t('onboarding.skip')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedFiles.size === 0}
            className={`
              px-6 py-2 text-sm rounded-md transition-colors
              ${selectedFiles.size > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {t('onboarding.confirm', { count: selectedFiles.size })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingDialog;