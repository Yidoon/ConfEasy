# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (Vite)
npm run dev

# Start Electron app (run in separate terminal after npm run dev)
npm start

# Build for production
npm run build

# Package Electron app for distribution
npm run make

# Lint code
npm run lint

# Preview built app
npm run preview
```

## Architecture Overview

ConfEasy is an Electron-based desktop application for managing configuration files. The architecture follows a standard Electron pattern with three main processes:

### Main Process (`src/main.ts`)
- Handles file system operations via IPC handlers
- Manages predefined config file paths for different platforms
- Provides file/folder selection dialogs
- Implements recursive config file scanning with pattern matching
- Handles both existing and non-existing files (allows creating new configs)

### Preload Script (`src/preload.ts`)
- Exposes secure Electron APIs to renderer via `contextBridge`
- Defines TypeScript interfaces for all IPC communication
- Available via `window.electronAPI` in renderer

### Renderer Process (React App)
- **App.tsx**: Main application state management, handles file operations, tag system, and localStorage persistence
- **FileList**: Displays config files with existence indicators and tag management
- **Editor**: Monaco-based code editor with syntax highlighting
- **TagManager**: Color-coded labeling system for organizing files
- **DefaultConfigFiles**: Platform-aware predefined config file suggestions

### Key Data Flow
1. App loads predefined config files via `getConfigFiles()` IPC
2. Users can add custom files via file picker or manual path entry
3. File content is read/written through IPC to main process
4. Tags and file associations persist in localStorage
5. Monaco editor provides syntax highlighting based on file extensions

### Build System
- Vite handles both renderer and Electron processes
- Monaco Editor is code-split as separate chunk
- Electron Forge manages packaging for multiple platforms
- Development uses hot reloading for renderer, restart for main process

### State Management
- React hooks for UI state
- `useLocalStorage` custom hook for persistence
- File operations are async with loading states
- Tag system allows filtering and organization

## Key File Patterns
- Config files detected by regex patterns in `main.ts:148-160`
- Platform-specific paths handled in `getConfigPaths()` and `DefaultConfigFiles`
- File existence tracking enables creating new configs in non-existing files
- Tilde (`~`) expansion handled by main process for user home directory