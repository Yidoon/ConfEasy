<div align="center">
  <img src="public/logo.png" alt="ConfEasy Logo" width="128" height="128">
  
# ConfEasy - 配置文件管理工具

一个帮你快速修改本地配置文件的 Electron 桌面应用，让配置文件管理变得简单高效。

[English](./README-EN.md) | 中文

<img width="1207" height="741" alt="easy-conf-demo" src="https://github.com/user-attachments/assets/14b5dada-2343-4be2-af20-d276747f4cb8" />


</div>

## ✨ 主要功能

### 📁 文件管理

- 自定义添加常见配置文件（.npmrc, .zshrc, .gitconfig, hosts 等）
- 支持文件夹管理
- 一键打开文件在系统中位置

### ✏️ 编辑

- Monaco Editor（VS Code 同款）提供语法高亮
- 支持 JSON, YAML, Shell, Markdown 等多种格式
- 未保存更改提醒，文件状态实时显示

### 🏷️ 标签分类

- 标签管理，快速筛选定位
- 支持文件和文件夹标签化组织
- 自定义标签名称和颜色

## 📥 下载安装

### 官方下载

前往 [GitHub Releases](https://github.com/Yidoon/ConfEasy/releases) 下载最新版本：

#### macOS

- **Intel 芯片**：下载 `confeasy-darwin-x64-*.zip`
- **Apple Silicon (M1/M2)**：下载 `confeasy-darwin-arm64-*.zip`
- 解压后将 `confeasy.app` 拖拽到应用程序文件夹

**首次运行安全提示**：右键点击应用图标，选择"打开"，在弹出的对话框中点击"打开"

#### Windows

- 下载 `confeasy-*-Setup.exe` 安装文件
- 运行安装程序并按提示操作

#### Linux

- **Ubuntu/Debian**：下载 `.deb` 文件，运行 `sudo dpkg -i *.deb`
- **CentOS/RHEL**：下载 `.rpm` 文件，运行 `sudo rpm -i *.rpm`

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

## 🚀 技术栈

- **[Electron](https://www.electronjs.org/)** - 跨平台桌面应用框架
- **[React](https://react.dev/)** - 用户界面库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全的 JavaScript
- **[Vite](https://vitejs.dev/)** - 下一代前端构建工具
- **[TailwindCSS](https://tailwindcss.com/)** - 实用优先的 CSS 框架
- **[Monaco Editor](https://microsoft.github.io/monaco-editor/)** - VS Code 编辑器核心

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
