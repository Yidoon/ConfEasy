# GitHub Actions 配置说明

## 📋 工作流概览

项目包含两个 GitHub Actions 工作流：

### 1. `test.yml` - 持续集成测试
**触发条件:**
- 推送到 `main` 分支
- 创建 Pull Request 到 `main` 分支

**执行内容:**
- 在 macOS、Windows、Linux 三个平台并行构建
- 代码质量检查 (`npm run lint`)
- 构建测试 (`npm run build`)
- 打包测试 (`npm run make`)

### 2. `build-release.yml` - 自动发布
**触发条件:**
- 推送以 `v` 开头的标签（如 `v1.0.0`, `v1.2.1-beta.1`）

**执行内容:**
- 多平台构建并生成安装包
- 自动创建 GitHub Release
- 上传所有平台的安装文件

## 🚀 使用方法

### 发布新版本

#### 方法一：使用发布脚本（推荐）
```bash
# 发布正式版本
./scripts/release.sh 1.1.0

# 发布预览版本
./scripts/release.sh 1.1.0-beta.1
```

#### 方法二：手动发布
```bash
# 1. 更新版本号
npm version 1.1.0 --no-git-tag-version

# 2. 提交更改
git add package.json package-lock.json
git commit -m "chore: bump version to 1.1.0"
git push origin main

# 3. 创建标签
git tag v1.1.0
git push origin v1.1.0
```

### 查看构建状态
- **Actions 页面**: `https://github.com/你的用户名/ConfEasy/actions`
- **Releases 页面**: `https://github.com/你的用户名/ConfEasy/releases`

## 📦 输出文件

成功构建后会生成以下文件：

### macOS
- `ConfEasy-darwin-x64-1.0.0.zip`
- 包含 `.app` 应用程序包

### Windows
- `ConfEasy-1.0.0 Setup.exe` 
- Windows 安装程序（Squirrel 格式）

### Linux
- `confeasy_1.0.0_amd64.deb` (Ubuntu/Debian)
- `confeasy-1.0.0.x86_64.rpm` (CentOS/RHEL)

## 🔧 配置说明

### 构建矩阵
```yaml
strategy:
  matrix:
    os: [macos-latest, ubuntu-latest, windows-latest]
```

### Node.js 版本
固定使用 Node.js 18，确保构建一致性：
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```

### 权限要求
- `GITHUB_TOKEN`: 自动提供，用于创建 Release
- `contents: write`: 用于上传 Release 资源

## 🛠 故障排除

### 常见构建错误

1. **依赖安装失败**
   - 检查 `package.json` 中的依赖版本
   - 确保 `package-lock.json` 已提交

2. **代码检查失败**
   - 运行 `npm run lint` 修复代码问题
   - 检查 TypeScript 类型错误

3. **打包失败**
   - 确保 `npm run build` 在本地成功
   - 检查 Electron 版本兼容性

4. **Release 创建失败**
   - 确认标签格式正确（必须以 `v` 开头）
   - 检查仓库权限设置

### 调试方法

1. **查看详细日志**
   - 在 GitHub Actions 页面点击失败的构建
   - 展开具体的步骤查看错误信息

2. **本地复现**
   ```bash
   # 模拟 CI 环境
   npm ci
   npm run lint
   npm run build
   npm run make
   ```

3. **逐步调试**
   - 先确保 `test.yml` 工作流通过
   - 再尝试发布版本

## 📈 优化建议

### 缓存优化
已启用 npm 缓存：
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
```

### 并行构建
三个平台并行构建，减少总时间。

### 条件执行
只有推送标签时才会执行发布流程，避免不必要的构建。

## 🔒 安全考虑

1. **代码签名**: 目前未配置，用户首次运行时可能需要允许
2. **依赖安全**: 定期运行 `npm audit` 检查漏洞
3. **权限最小化**: 只使用必要的 GitHub 权限

## 📝 更新记录

- 初始版本：支持三平台自动构建和发布
- 添加了代码质量检查
- 配置了构建缓存优化