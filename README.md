# 🎨 Todo List - 支持颜色分类的现代化任务管理

一个简洁高效、支持颜色分类的待办事项管理应用，基于 Next.js 16 + React 19 + TypeScript + Tailwind CSS 开发。

## ✨ 核心功能

- ✅ **添加任务** - 输入内容，按 Enter 或点击添加
- ✅ **颜色标签** - 8种颜色可选（红/橙/黄/绿/蓝/紫/粉/无）
- ✅ **标记完成** - 点击复选框切换状态
- ✅ **删除任务** - 悬停显示删除按钮
- ✅ **实时统计** - 完成进度与可视化进度条
- ✅ **本地持久化** - 数据保存在 localStorage
- 🎨 **现代化 UI** - 渐变背景、毛玻璃效果、平滑动画
- 🌓 **暗色模式** - 自动适配系统主题
- 📱 **响应式** - 完美支持手机/平板/桌面

## 🚀 快速开始

### 环境要求
- Node.js 18+
- npm 或 yarn

### 安装依赖
```bash
npm install
```

### 开发环境
```bash
npm run dev
```
访问 http://localhost:3000

### 生产构建
```bash
npm run build
npm start
```

## 🎯 使用说明

1. **添加任务**
   - 输入任务内容
   - 选择颜色标签（可选）
   - 按 Enter 或点击"添加"按钮

2. **管理任务**
   - 点击左侧圆圈标记完成/未完成
   - 鼠标悬停右侧显示删除按钮
   - 已完成任务显示特殊标识

3. **颜色分类**
   - 🔴 红色 - 紧急重要
   - 🟠 橙色 - 中等优先
   - 🟡 黄色 - 低优先级
   - 🟢 绿色 - 日常任务
   - 🔵 蓝色 - 工作相关
   - 🟣 紫色 - 学习计划
   - 🩷 粉色 - 个人事务
   - ⚪ 无标签 - 默认

## 📁 项目结构

```
todolist/
├── src/
│   ├── app/
│   │   ├── globals.css      # 全局样式 + 组件
│   │   ├── layout.tsx
│   │   └── page.tsx         # 主页面
│   ├── components/
│   │   ├── TodoForm.tsx     # 添加任务表单 + 颜色选择器
│   │   ├── TodoList.tsx     # 任务列表
│   │   └── TodoItem.tsx     # 单个任务项
│   └── types/
│       └── todo.ts          # TypeScript 类型定义
├── .devcontainer/           # Codespaces 配置
├── scripts/                 # 辅助脚本
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── README.md
```

## 🛠️ 技术栈

| 技术 | 版本 |
|------|------|
| Next.js | 16.2 |
| React | 19.2 |
| TypeScript | 5 |
| Tailwind CSS | 3.4 |

## 🔧 配置说明

### 编辑器
推荐使用 VS Code + 以下插件：
- Tailwind CSS IntelliSense
- PostCSS Language Support

### Codespaces 自动部署
1. Fork 本仓库到你的 GitHub
2. 创建 Codespace (Code → Codespaces → Create)
3. 自动安装依赖 + 启动开发服务器
4. 右下角 Ports → 端口 3000 → 复制公网链接

## 🌐 公网访问

在 GitHub Codespaces 中：
1. 打开右下角 **Ports** 面板
2. 找到 **3000** 端口
3. 确保状态显示 **Public**
4. 点击链接图标复制公网 URL
5. 手机浏览器访问

**格式:**
```
https://<your-codespace-name>-3000.app.github.dev/
```

## 📱 功能截图

应用包含：
- 🎨 现代渐变色设计
- ⚡ 流畅的动画效果
- 🎭 丰富的悬停交互
- 📊 直观的进度统计
- 🌈 8种颜色标签

## 📝 更新日志

### 2026-03-28
- ✨ 添加颜色选择功能
- 🎨 全面 UI 现代化升级
- 🌈 支持 8 种颜色标签分类
- 🚀 配置 Codespaces 自动部署
- 📱 优化移动端体验

## ❓ 常见问题

**Q: 颜色标签数据会丢失吗？**
A: 不会，所有数据（包括颜色）都保存在浏览器的 localStorage 中。

**Q: 可以自定义颜色吗？**
A: 目前使用预设的 8 种颜色，如需自定义可修改 `src/types/todo.ts`。

**Q: 如何导出数据？**
A: 打开浏览器控制台：`localStorage.getItem('todos')` 即可获取 JSON 数据。

**Q: 支持多设备同步吗？**
A: 当前版本仅本地存储。如需云同步，可集成后端 API。

## 📄 License

MIT

---

**Built with ❤️ using Next.js, React, TypeScript & Tailwind CSS by 🦞龙虾CEO**