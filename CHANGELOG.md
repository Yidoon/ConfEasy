# Changelog / 更新日志

All notable changes to this project will be documented in this file.  
本项目的所有重要更改都将记录在此文件中。

## [0.0.5] - 2025-01-17

### Added / 新增
- 🗂️ **Folder Management / 文件夹管理**
  - Support for adding and managing entire folders / 支持添加和管理整个文件夹
  - Recursive scanning for configuration files in folders / 递归扫描文件夹中的配置文件
  - Folder expand/collapse functionality / 文件夹展开/折叠功能
  - Tag support for folders / 文件夹标签支持
  - Remove folders from management list / 从管理列表中移除文件夹
  - Show folders in system file manager / 在系统文件管理器中显示文件夹

- 🎨 **UI Improvements / 界面改进**
  - Custom logo display in header / 在标题栏显示自定义 Logo
  - Enhanced bilingual support (Chinese/English) / 增强的双语支持（中英文）
  - Improved documentation with English version / 改进文档并添加英文版本

### Changed / 变更
- Updated README with comprehensive feature list / 更新 README 包含完整功能列表
- Improved i18n implementation / 改进国际化实现

### Fixed / 修复
- ESLint warnings in useEffect dependencies / 修复 useEffect 依赖的 ESLint 警告

## [0.0.4] - 2025-01-16

### Added / 新增
- 🏷️ **Tag Management System / 标签管理系统**
  - Create custom tags with colors / 创建带颜色的自定义标签
  - Filter files by tags / 按标签过滤文件
  - Bulk tag operations / 批量标签操作

- 🌍 **Internationalization / 国际化**
  - Chinese/English language switching / 中英文语言切换
  - Complete UI translation / 完整的界面翻译

### Changed / 变更
- Improved file list UI / 改进文件列表界面
- Enhanced dark mode support / 增强深色模式支持

## [0.0.3] - 2025-01-15

### Added / 新增
- 🎨 **Theme Support / 主题支持**
  - Light/Dark theme switching / 浅色/深色主题切换
  - System theme following option / 跟随系统主题选项

- 📝 **Editor Enhancements / 编辑器增强**
  - Monaco Editor integration / 集成 Monaco 编辑器
  - Syntax highlighting for multiple languages / 多语言语法高亮
  - Unsaved changes indicator / 未保存更改指示器

### Fixed / 修复
- File path resolution on different platforms / 不同平台的文件路径解析
- Save functionality for non-existent files / 不存在文件的保存功能

## [0.0.2] - 2025-01-14

### Added / 新增
- 📁 **File Management / 文件管理**
  - Auto-detect common config files / 自动检测常见配置文件
  - Manual file/folder addition / 手动添加文件/文件夹
  - File existence detection / 文件存在性检测

- ⚡ **Core Features / 核心功能**
  - Quick save with Ctrl+S/Cmd+S / 使用 Ctrl+S/Cmd+S 快速保存
  - Show in Finder/Explorer / 在 Finder/资源管理器中显示

## [0.0.1] - 2025-01-13

### Initial Release / 初始版本
- 🚀 Basic Electron + React + TypeScript setup / 基础 Electron + React + TypeScript 架构
- 📝 Simple config file editing / 简单的配置文件编辑
- 💾 File read/write functionality / 文件读写功能
- 🖥️ Cross-platform support (macOS, Windows, Linux) / 跨平台支持

---

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

本文档格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循[语义化版本](https://semver.org/lang/zh-CN/)。