#!/bin/bash
set -e

cd /Users/chong/project/openclaws/todolist

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

# 提交
git commit -m "feat: complete Todo List with modern UI, color picker, and Codespaces support" || echo "Nothing to commit"

# 显示分支
git branch -a

# 推送到 GitHub
git push -u origin main --force