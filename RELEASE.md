# ConfEasy 发布指南

## 🚀 自动发布流程

项目已配置 GitHub Actions，支持以下自动化流程：

### 1. 持续集成 (CI)
- **触发条件**: 推送到 `main` 分支或创建 Pull Request
- **执行内容**: 
  - 在 macOS、Windows、Linux 三个平台上构建
  - 运行代码检查 (`npm run lint`)
  - 构建应用 (`npm run build`)
  - 测试打包 (`npm run make`)

### 2. 自动发布 Release
- **触发条件**: 推送以 `v` 开头的 tag（如 `v1.0.0`）
- **执行内容**:
  - 构建所有平台的安装包
  - 自动创建 GitHub Release
  - 上传所有平台的安装文件

## 📦 发布新版本步骤

### 1. 更新版本号
编辑 `package.json` 中的版本号：
```json
{
  "version": "1.1.0"
}
```

### 2. 更新变更日志
在 `CHANGELOG.md` 中记录新版本的更改。

### 3. 提交并推送变更
```bash
git add .
git commit -m "chore: bump version to 1.1.0"
git push origin main
```

### 4. 创建并推送标签
```bash
# 创建标签
git tag v1.1.0

# 推送标签（这将触发 Release 构建）
git push origin v1.1.0
```

### 5. 查看自动发布
- 访问 GitHub Repository 的 Actions 页面查看构建进度
- 构建完成后，在 Releases 页面会自动生成新版本

## 🔧 支持的平台和格式

### macOS
- **格式**: `.zip` 文件
- **安装**: 解压后拖拽到应用程序文件夹
- **架构**: x64 (Intel) 和 arm64 (Apple Silicon)

### Windows  
- **格式**: `.exe` 安装程序
- **安装**: 双击运行安装向导
- **架构**: x64

### Linux
- **格式**: `.deb` (Ubuntu/Debian) 和 `.rpm` (CentOS/RHEL)
- **安装**: 
  - DEB: `sudo dpkg -i confeasy_1.0.0_amd64.deb`
  - RPM: `sudo rpm -i confeasy-1.0.0.x86_64.rpm`
- **架构**: x64

## 🛠 本地构建测试

在推送标签前，建议先本地测试构建：

```bash
# 安装依赖
npm install

# 代码检查
npm run lint

# 构建应用
npm run build

# 打包测试
npm run make

# 查看输出
ls -la out/make/
```

## 📝 版本命名规范

使用语义化版本控制 (SemVer)：
- `v1.0.0` - 主要版本（重大更改）
- `v1.1.0` - 次要版本（新功能）
- `v1.0.1` - 修订版本（Bug 修复）

### 预发布版本
- `v1.1.0-beta.1` - Beta 版本
- `v1.1.0-alpha.1` - Alpha 版本
- `v1.1.0-rc.1` - Release Candidate

## 🔍 故障排除

### 构建失败
1. 检查 GitHub Actions 日志
2. 确保所有依赖都在 `package.json` 中
3. 验证 `npm run lint` 和 `npm run build` 在本地成功

### Release 未创建
1. 确保标签以 `v` 开头
2. 检查是否有推送权限
3. 验证 `GITHUB_TOKEN` 权限

### 下载的文件无法运行
1. macOS: 可能需要在系统偏好设置中允许运行
2. Windows: 可能被 Windows Defender 阻止
3. Linux: 检查文件权限 `chmod +x`

## 📊 发布统计

可以在以下位置查看发布信息：
- GitHub Releases 页面查看下载统计
- Actions 页面查看构建历史
- Insights 页面查看 Traffic 数据