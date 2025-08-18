<div align="center">
  <img src="public/logo.png" alt="ConfEasy Logo" width="128" height="128">
  
# ConfEasy - Configuration File Manager

An Electron desktop application that helps you quickly modify local configuration files, making config management simple and efficient.

English | [中文](./README.md)

<img width="1215" height="744" alt="easy-conf-demo-en" src="https://github.com/user-attachments/assets/304fb289-5d40-4854-a1e6-0f0f0a2598c7" />


</div>

## ✨ Key Features

### 📁 File Management

- Custom add common config files (.npmrc, .zshrc, .gitconfig, hosts, etc.)
- Support folder management
- One-click open file location in system

### ✏️ Editing

- Monaco Editor (same as VS Code) provides syntax highlighting
- Support JSON, YAML, Shell, Markdown and other formats
- Unsaved changes reminder, real-time file status display

### 🏷️ Tag Classification

- Tag management for quick filtering and location
- Support file and folder tag organization
- Custom tag names and colors

## 📥 Download & Installation

### Official Downloads

Visit [GitHub Releases](https://github.com/Yidoon/ConfEasy/releases) to download the latest version:

#### macOS

- **Intel Chips**: Download `confeasy-darwin-x64-*.zip`
- **Apple Silicon (M1/M2)**: Download `confeasy-darwin-arm64-*.zip`
- Extract and drag `ConfEasy.app` to Applications folder

**First Run Security Notice**: Right-click the app icon, select "Open", then click "Open" in the dialog

**Important: Handling First-Run Security Alert**

1. If you see "ConfEasy is damaged and can't be opened" warning, **DO NOT** move to trash
2. **Method 1 (Recommended)**: Right-click the app icon, select "Open", then click "Open" in the dialog
3. **Method 2**: Open Terminal and run the following command to remove quarantine attribute:
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/ConfEasy.app
   ```
4. **Method 3**: System Preferences → Security & Privacy → General → Find the blocked app and click "Open Anyway"

> Note: This warning appears because the app is not signed by Apple, but the software itself is safe and open source.

#### Windows

- Download `confeasy-*-Setup.exe` installer
- Run the installer and follow the prompts

#### Linux

- **Ubuntu/Debian**: Download `.deb` file, run `sudo dpkg -i *.deb`
- **CentOS/RHEL**: Download `.rpm` file, run `sudo rpm -i *.rpm`

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

## 🚀 Tech Stack

- **[Electron](https://www.electronjs.org/)** - Cross-platform desktop application framework
- **[React](https://react.dev/)** - User interface library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Vite](https://vitejs.dev/)** - Next generation frontend tooling
- **[TailwindCSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code editor core

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
