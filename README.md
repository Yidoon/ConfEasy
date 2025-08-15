# ConfEasy - 配置文件管理工具

一个帮你快速修改本地配置文件的 Electron 桌面应用，让配置文件管理变得简单高效。

## ✨ 主要功能

### 📁 智能文件识别

- 自动识别常见的开发配置文件：
  - `.npmrc` - npm 配置
  - `.zshrc` / `.bashrc` / `.bash_profile` - Shell 配置
  - `.gitconfig` - Git 配置
  - `hosts` - 系统 hosts 文件
  - `.ssh/config` - SSH 配置
  - VS Code 用户设置
- 支持手动添加自定义配置文件

### ✏️ 强大的编辑功能

- Monaco Editor 提供专业的代码编辑体验
- 语法高亮支持多种文件格式 (JSON, YAML, Shell, etc.)
- 实时显示文件修改状态
- 快捷键保存 (Ctrl+S / Cmd+S)

### 🏷️ 标签管理系统

- 为配置文件添加彩色标签
- 按标签快速过滤文件
- 支持创建自定义标签

### 🎨 现代化界面

- 简洁美观的 UI 设计
- 支持浅色/深色模式切换
- 响应式布局适配不同屏幕尺寸

## 📥 下载安装

### 官方下载
前往 [GitHub Releases](https://github.com/Yidoon/ConfEasy/releases) 下载最新版本：

#### macOS
- 下载 `confeasy-darwin-arm64-*.zip` 文件
- 解压后将 `confeasy.app` 拖拽到应用程序文件夹
- 首次运行可能需要在系统偏好设置中允许运行

#### Windows  
- 下载 `*.exe` 安装文件
- 运行安装程序并按提示操作
- Windows 可能会显示安全警告，选择"仍要运行"

#### Linux
- **Ubuntu/Debian 系统：** 下载 `.deb` 文件，运行 `sudo dpkg -i *.deb`
- **CentOS/RHEL 系统：** 下载 `.rpm` 文件，运行 `sudo rpm -i *.rpm`

### 开发版本
如需最新开发版本，可以 clone 本仓库并本地构建：
```bash
git clone https://github.com/Yidoon/ConfEasy.git
cd ConfEasy
npm install
npm run build
npm run make
```

### 版本发布说明
- 项目使用语义化版本控制
- 稳定版本通过 GitHub Actions 自动构建和发布
- 发布版本会同时提供 macOS、Windows 和 Linux 版本

## 🚀 技术栈

- **Electron** - 跨平台桌面应用框架
- **Vite** - 现代化构建工具
- **React** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **TailwindCSS** - 实用优先的 CSS 框架
- **Monaco Editor** - VS Code 同款编辑器

## 📖 使用方法

### 开发环境

1. 克隆项目并安装依赖：

```bash
git clone <repository-url>
cd ConfEasy
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 在另一个终端启动 Electron：

```bash
npm start
```

### 构建应用

```bash
# 构建前端资源
npm run build

# 打包 Electron 应用
npm run make
```

## 💡 使用技巧

1. **文件管理**：左侧文件列表显示所有配置文件，存在的文件显示蓝色图标，不存在的显示灰色
2. **编辑文件**：点击文件即可在右侧编辑器中打开，支持语法高亮和自动补全
3. **标签系统**：点击文件旁的标签图标可以为文件添加标签，便于分类管理
4. **快速保存**：使用 Ctrl+S (Windows/Linux) 或 Cmd+S (macOS) 快速保存文件
5. **暗黑模式**：点击右上角的月亮/太阳图标切换主题

## 🔧 支持的文件类型

- **配置文件**: .npmrc, .gitconfig, .ssh/config
- **Shell 脚本**: .zshrc, .bashrc, .bash_profile
- **数据格式**: JSON, YAML, TOML, INI
- **代码文件**: JavaScript, TypeScript, Python, Shell
- **标记语言**: HTML, XML, Markdown
- **样式文件**: CSS
- **系统文件**: hosts

## 📝 许可证

MIT License
