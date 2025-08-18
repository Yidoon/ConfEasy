import React from "react";
import { Settings } from "lucide-react";
import { useI18n } from "../hooks/useI18n";

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { t } = useI18n();

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <img src="./icons/32x32.png" alt="ConfEasy Logo" className="w-8 h-8" />
        <h1 className="text-lg font-semibold">{t("app.title")}</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {t("app.subtitle")}
        </span>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={t("header.settings")}
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
