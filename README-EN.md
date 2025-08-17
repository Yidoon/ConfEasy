<div align="center">
  <img src="public/logo.png" alt="ConfEasy Logo" width="128" height="128">
  
# ConfEasy - Configuration File Manager

An Electron desktop application that helps you quickly modify local configuration files, making config management simple and efficient.

English | [中文](./README.md)

</div>

## ✨ Key Features

### 📁 Smart File Recognition & Management

- **Auto-detect common config files**:
  - `.npmrc` - npm configuration
  - `.zshrc` / `.bashrc` / `.bash_profile` - Shell configuration
  - `.gitconfig` - Git configuration
  - `hosts` - System hosts file
  - `.ssh/config` - SSH configuration
  - `.vimrc` - Vim configuration
  - `.editorconfig` - EditorConfig settings
  - VS Code user settings
- **Folder Management**:

  - Add entire folders for management
  - Recursively scan folders for config files
  - Expand/collapse folder browsing
  - Tag folders for categorization
  - Open folders in system file manager

- **Flexible File Operations**:
  - Manually add custom config files
  - Real-time file existence detection
  - Remove files/folders from list (doesn't delete actual files)
  - Show file location in Finder/Explorer

### ✏️ Powerful Editing Features

- **Monaco Editor** provides professional code editing experience (same as VS Code)
- **Smart syntax highlighting** for multiple file formats:
  - Config formats: JSON, YAML, TOML, INI
  - Script languages: Shell, Python, JavaScript
  - Markup languages: Markdown, HTML, XML
- **Real-time file status**:
  - Display file modification status
  - Unsaved changes reminder
  - Support creating non-existent files
- **Keyboard shortcuts**: Ctrl+S / Cmd+S for quick save

### 🏷️ Tag Management System

- Add colored tags to files and folders
- Multi-tag filtering for quick file location
- Custom tag names and colors
- Bulk tag management and deletion

### 🎨 Modern Interface

- Clean and beautiful UI design
- Light/Dark theme switching
- Chinese/English language switching
- Responsive layout for different screen sizes
- Custom brand logo display

## 📥 Download & Installation

### Official Downloads

Visit [GitHub Releases](https://github.com/Yidoon/ConfEasy/releases) to download the latest version:

#### macOS

- **Intel Chips**: Download `confeasy-darwin-x64-*.zip`
- **Apple Silicon (M1/M2)**: Download `confeasy-darwin-arm64-*.zip`
- Extract and drag `confeasy.app` to Applications folder

**Important: First Run Security Notice**

1. If you see "confeasy is damaged and can't be opened" warning, **DO NOT** move to trash
2. **Method 1 (Recommended)**: Right-click the app icon, select "Open", then click "Open" in the dialog
3. **Method 2**: Open Terminal and run:
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/confeasy.app
   ```
4. **Method 3**: System Preferences → Security & Privacy → General → Find the blocked app and click "Open Anyway"

> Note: This warning appears because the app isn't signed by Apple, but the software is safe and open source.

#### Windows

- Download `confeasy-*-Setup.exe` installer
- Run the installer and follow the prompts
- Windows may show a security warning, select "Run anyway"

#### Linux

- **Ubuntu/Debian**: Download `.deb` file, run `sudo dpkg -i *.deb`
- **CentOS/RHEL**: Download `.rpm` file, run `sudo rpm -i *.rpm`
- **Other distributions**: Download `.AppImage` file, add execute permission and run

### Build from Source

```bash
# Clone repository
git clone https://github.com/Yidoon/ConfEasy.git
cd ConfEasy

# Install dependencies
npm install

# Development mode
npm run dev    # Start Vite dev server
npm start      # Start Electron in another terminal

# Build application
npm run build  # Build frontend assets
npm run make   # Package distributable app
```

## 💡 Usage Tips

### File Management

- **Check file status**: Blue icon indicates file exists, gray indicates non-existent
- **Quick location**: Use tag filtering to quickly find config files
- **Batch management**: Add entire folders to manage multiple config files at once

### Editing Tips

- **Syntax highlighting**: Editor automatically enables syntax highlighting based on file type
- **Quick save**: Use Ctrl+S (Windows/Linux) or Cmd+S (macOS) for quick save
- **Create new files**: Select non-existent file, edit content and save to create

### Interface Customization

- **Theme switching**: Click settings button to switch dark/light theme
- **Language switching**: Switch Chinese/English interface in settings
- **Tag colors**: Customize colors when creating tags for intuitive categorization

## 🚀 Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop application framework
- **[React](https://react.dev/)** - User interface library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code editor core

## 🔧 Supported File Types

### Configuration Files

- Shell configs: `.zshrc`, `.bashrc`, `.bash_profile`, `.profile`
- Dev tools: `.gitconfig`, `.npmrc`, `.yarnrc`, `.editorconfig`
- Editors: `.vimrc`, `settings.json` (VS Code)
- System files: `hosts`, `ssh/config`

### Syntax Highlighting Support

- Data formats: JSON, YAML, TOML, INI, XML
- Script languages: Shell, Python, JavaScript, TypeScript
- Markup languages: Markdown, HTML
- Style files: CSS, SCSS, Less

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 🙏 Acknowledgments

- Thanks to all contributors and users for their support
- Monaco Editor from Microsoft
- Icons from Lucide Icons

---

<div align="center">
  
**If you find this project helpful, please give it a ⭐ Star!**

[Report Issues](https://github.com/Yidoon/ConfEasy/issues) | [Feature Requests](https://github.com/Yidoon/ConfEasy/issues/new)

</div>
