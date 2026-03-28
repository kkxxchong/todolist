#!/bin/bash
set -e

cd /Users/chong/project/openclaws/todolist

# 环境检测：是否在 CI 中
if [ -n "$CI" ] || [ -n "$GITHUB_ACTIONS" ]; then
  echo "🔧 Running in CI environment"

  # CI 环境：只构建，不推送（由 GitHub Actions 管理）
  echo "📦 Installing dependencies..."
  npm ci --only=production

  echo "🔨 Building application..."
  npm run build

  echo "✅ CI build completed successfully"
  exit 0
fi

# 本地环境：完整部署流程
echo "🖥️ Running in local environment"

# 初始化 Git（如果还没有）
if [ ! -d ".git" ]; then
  git init
  git config user.name "wchonge"
  git config user.email "wchonge@qq.com"
fi

# 确保忽略 node_modules
if ! grep -q "^/node_modules$" .gitignore 2>/dev/null; then
  echo "/node_modules" >> .gitignore
fi

# 添加所有文件
git add -A

# 显示将要提交的文件
echo "Files to commit:"
git status --short

# 读取提交信息
DEFAULT_MSG="deploy: update Todo List app"
read -p "Enter commit message [$DEFAULT_MSG]: " COMMIT_MSG
COMMIT_MSG=${COMMIT_MSG:-$DEFAULT_MSG}

# 提交
git commit -m "$COMMIT_MSG" || echo "Nothing to commit"

# 显示分支
git branch -a

# 推送到 GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main --force

# 询问是否部署到 Vercel
read -p "Deploy to Vercel now? (y/n): " DEPLOY_VERCEL
if [ "$DEPLOY_VERCEL" = "y" ] || [ "$DEPLOY_VERCEL" = "Y" ]; then
  echo "📡 Deploying to Vercel..."
  if command -v vercel &> /dev/null; then
    vercel --prod
  else
    echo "⚠️  Vercel CLI not found. Install with: npm i -g vercel"
  fi
fi

echo "✅ Deployment workflow completed!"
