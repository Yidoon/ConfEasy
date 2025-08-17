<div align="center">
  <img src="public/logo.png" alt="ConfEasy Logo" width="128" height="128">
  
# ConfEasy - 配置文件管理工具

一个帮你快速修改本地配置文件的 Electron 桌面应用，让配置文件管理变得简单高效。

[English](./README-EN.md) | 中文

</div>

## ✨ 主要功能

### 📁 智能文件识别与管理

- **自动识别常见配置文件**：
  - `.npmrc` - npm 配置
  - `.zshrc` / `.bashrc` / `.bash_profile` - Shell 配置
  - `.gitconfig` - Git 配置
  - `hosts` - 系统 hosts 文件
  - `.ssh/config` - SSH 配置
  - `.vimrc` - Vim 配置
  - `.editorconfig` - EditorConfig 配置
  - VS Code 用户设置
- **文件夹管理功能**：

  - 支持添加整个文件夹进行管理
  - 递归扫描文件夹中的配置文件
  - 文件夹展开/折叠浏览
  - 为文件夹添加标签分类
  - 在系统文件管理器中打开文件夹

- **灵活的文件操作**：
  - 手动添加自定义配置文件
  - 文件存在性实时检测
  - 从管理列表移除文件/文件夹（不删除实际文件）
  - 在 Finder/资源管理器中显示文件位置

### ✏️ 强大的编辑功能

- **Monaco Editor** 提供专业的代码编辑体验（VS Code 同款编辑器）
- **智能语法高亮**支持多种文件格式：
  - 配置格式：JSON, YAML, TOML, INI
  - 脚本语言：Shell, Python, JavaScript
  - 标记语言：Markdown, HTML, XML
- **实时文件状态**：
  - 显示文件修改状态
  - 未保存更改提醒
  - 支持创建不存在的文件
- **快捷键支持**：Ctrl+S / Cmd+S 快速保存

### 🏷️ 标签管理系统

- 为配置文件和文件夹添加彩色标签
- 多标签筛选，快速定位文件
- 自定义标签名称和颜色
- 标签的批量管理和删除

## 📥 下载安装

### 官方下载

前往 [GitHub Releases](https://github.com/Yidoon/ConfEasy/releases) 下载最新版本：

#### macOS

- **Intel 芯片**：下载 `confeasy-darwin-x64-*.zip`
- **Apple Silicon (M1/M2)**：下载 `confeasy-darwin-arm64-*.zip`
- 解压后将 `confeasy.app` 拖拽到应用程序文件夹

**重要：首次运行安全提示处理**

1. 如果出现"confeasy 已损坏，无法打开"警告，**不要**移到废纸篓
2. **方法一（推荐）**：右键点击应用图标，选择"打开"，在弹出的对话框中点击"打开"
3. **方法二**：打开终端，运行以下命令移除隔离属性：
   ```bash
   sudo xattr -rd com.apple.quarantine /Applications/confeasy.app
   ```
4. **方法三**：系统偏好设置 → 安全性与隐私 → 通用 → 找到被阻止的应用，点击"仍要打开"

> 注意：此警告是因为应用未经 Apple 签名认证，但软件本身是安全开源的。

#### Windows

- 下载 `confeasy-*-Setup.exe` 安装文件
- 运行安装程序并按提示操作
- Windows 可能会显示安全警告，选择"仍要运行"

#### Linux

- **Ubuntu/Debian**：下载 `.deb` 文件，运行 `sudo dpkg -i *.deb`
- **CentOS/RHEL**：下载 `.rpm` 文件，运行 `sudo rpm -i *.rpm`
- **其他发行版**：下载 `.AppImage` 文件，添加执行权限后运行

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/Yidoon/ConfEasy.git
cd ConfEasy

# 安装依赖
npm install

# 开发模式运行
npm run dev    # 启动 Vite 开发服务器
npm start      # 在另一个终端启动 Electron

# 构建应用
npm run build  # 构建前端资源
npm run make   # 打包成可分发的应用
```

## 💡 使用技巧

### 文件管理

- **查看文件状态**：蓝色图标表示文件存在，灰色表示文件不存在
- **快速定位**：使用标签过滤快速找到需要的配置文件
- **批量管理**：可以添加整个文件夹，一次性管理多个配置文件

### 编辑技巧

- **语法高亮**：编辑器会根据文件类型自动启用语法高亮
- **快速保存**：使用 Ctrl+S (Windows/Linux) 或 Cmd+S (macOS) 快速保存
- **创建新文件**：选择不存在的文件，编辑内容后保存即可创建

### 界面定制

- **主题切换**：点击设置按钮切换深色/浅色主题
- **语言切换**：在设置中切换中文/英文界面
- **标签颜色**：创建标签时可以自定义颜色，让分类更直观

## 🚀 技术栈

- **[Electron](https://www.electronjs.org/)** - 跨平台桌面应用框架
- **[React](https://react.dev/)** - 用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Vite](https://vitejs.dev/)** - 下一代前端构建工具
- **[TailwindCSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code 编辑器核心

## 🔧 支持的文件类型

### 配置文件

- Shell 配置：`.zshrc`, `.bashrc`, `.bash_profile`, `.profile`
- 开发工具：`.gitconfig`, `.npmrc`, `.yarnrc`, `.editorconfig`
- 编辑器：`.vimrc`, `settings.json` (VS Code)
- 系统文件：`hosts`, `ssh/config`

### 支持的语法高亮

- 数据格式：JSON, YAML, TOML, INI, XML
- 脚本语言：Shell, Python, JavaScript, TypeScript
- 标记语言：Markdown, HTML
- 样式文件：CSS, SCSS, Less

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢所有贡献者和用户的支持
- Monaco Editor 来自 Microsoft
- 图标来自 Lucide Icons

---

<div align="center">
  
**如果觉得这个项目有帮助，请给个 ⭐ Star 支持一下！**

[报告问题](https://github.com/Yidoon/ConfEasy/issues) | [功能建议](https://github.com/Yidoon/ConfEasy/issues/new)

</div>
