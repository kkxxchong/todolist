#!/bin/bash

# 快速重启开发服务器

echo "🔄 重启 Todo List 开发服务器..."

# 1. 停止现有进程
pkill -f "next dev" 2>/dev/null || true
sleep 1

# 2. 清理缓存（可选）
echo "🧹 清理缓存..."
rm -rf .next

# 3. 确保依赖已安装
if [ ! -d "node_modules" ]; then
  echo "📦 安装依赖..."
  npm install
fi

# 4. 重新启动
echo "🚀 启动服务器..."
npm run dev

echo ""
echo "✅ 服务器已重启！"
echo "📱 公网链接: https://${CODESPACE_NAME:-YOUR-CODE}-3000.app.github.dev/"