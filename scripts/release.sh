#!/bin/bash

# ConfEasy 版本发布脚本
# 使用方法: ./scripts/release.sh 1.1.0

set -e

# 检查参数
if [ $# -eq 0 ]; then
    echo "❌ 请提供版本号"
    echo "使用方法: ./scripts/release.sh 1.1.0"
    exit 1
fi

VERSION=$1
TAG="v$VERSION"

echo "🚀 准备发布 ConfEasy $VERSION"

# 检查是否在 main 分支
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "❌ 请在 main 分支上发布版本，当前分支: $CURRENT_BRANCH"
    exit 1
fi

# 检查工作目录是否干净
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ 工作目录不干净，请先提交所有更改"
    git status --short
    exit 1
fi

# 更新 package.json 版本号
echo "📝 更新 package.json 版本号到 $VERSION"
npm version $VERSION --no-git-tag-version

# 运行测试
echo "🔍 运行代码检查..."
npm run lint

echo "🏗️  构建应用..."
npm run build

echo "📦 测试打包..."
npm run make

# 提交版本变更
echo "💾 提交版本变更..."
git add package.json package-lock.json
git commit -m "chore: bump version to $VERSION

- 更新版本号到 $VERSION
- 准备发布新版本

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 创建标签
echo "🏷️  创建标签 $TAG"
git tag -a $TAG -m "Release $VERSION

ConfEasy $VERSION

主要更改请查看 CHANGELOG.md

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# 推送到远程
echo "⬆️  推送到 GitHub..."
git push origin main
git push origin $TAG

echo "✅ 版本 $VERSION 发布完成！"
echo ""
echo "🔗 查看构建进度: https://github.com/$(git remote get-url origin | sed 's/.*github\.com[:/]\([^.]*\)\.git/\1/')/actions"
echo "📦 发布页面: https://github.com/$(git remote get-url origin | sed 's/.*github\.com[:/]\([^.]*\)\.git/\1/')/releases"
echo ""
echo "⏱️  构建通常需要 5-10 分钟完成，完成后会自动创建 Release"