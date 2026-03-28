# GitHub Actions Secrets Configuration

为 Todo List 项目配置自动部署到 Vercel，需要在 GitHub 仓库设置以下 Secrets：

## Vercel Integration

### 方法一：使用 Vercel CLI（推荐）

1. 安装 Vercel CLI（如果还没有）:
   ```bash
   npm i -g vercel
   ```

2. 登录并获取 Token:
   ```bash
   vercel login
   # 在浏览器中确认后，Token 会保存在 ~/.vercel/credentials.json
   ```

3. 在 Vercel 仪表板中获取 Org ID 和 Project ID:
   - 访问 https://vercel.com/[your-org]/todolist
   - 在设置 → General 中找到 Project ID
   - 在 https://vercel.com/account/settings 找到 Team ID (Org ID)

4. 在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加:

   | Secret Name | Value | 说明 |
   |-------------|-------|------|
   | `VERCEL_TOKEN` | 从 `~/.vercel/credentials.json` 获取 `token` 字段 | Vercel API 令牌 |
   | `VERCEL_ORG_ID` | 你的 Team/Org ID | Vercel 组织 ID |
   | `VERCEL_PROJECT_ID` | 项目 ID | Vercel 项目 ID |
   | `VERCEL_URL` | https://todolist.vercel.app (或你的域名) | 生产环境 URL |

### 方法二：使用 Vercel GitHub App

1. 在 https://vercel.com/ 点击 "Add GitHub Integration"
2. 选择你的仓库并授权
3. Vercel 会自动配置，无需手动设置 Secrets

---

## 工作流程说明

### CI (`.github/workflows/ci.yml`)
- **触发**: PR 到 main/master，或推送到这些分支
- **步骤**:
  1. `install` - `npm ci`
  2. `lint` - `npm run lint`
  3. `test` - `npm test` (Jest)
  4. `build` - `npm run build` (Next.js 构建)
- **产物**: 上传构建产物和测试覆盖率报告

### Deploy (`.github/workflows/deploy.yml`)
- **触发**: 推送到 main/master 或手动 dispatch
- **前置条件**: CI 的 lint、test、build 全部通过
- **步骤**:
  1. 拉取 Vercel 环境配置
  2. 构建生产版本
  3. 部署到 Vercel（生产环境）
- **环境变量**: 使用上面配置的 Vercel Secrets

---

## 验证流程

1. 确保本地代码已推送到 GitHub:
   ```bash
   git add .github/
   git commit -m "ci: add GitHub Actions workflows"
   git push origin main
   ```

2. 访问 GitHub 仓库的 Actions 标签:
   https://github.com/kkxxchong/todolist/actions

3. 查看 CI 工作流运行状态，应看到:
   - ✅ lint
   - ✅ test
   - ✅ build

4. CI 通过后，Deploy 工作流自动触发，完成后:
   - Vercel 部署完成
   - 访问 `VERCEL_URL` 验证部署成功

---

## 故障排除

**Vercel CLI 安装失败**:
```bash
npm config set fund false
npm ci --ignore-scripts
```

**构建失败 "TypeScript errors"**:
```bash
# 本地先运行构建检查
npm run build
# 修复所有 TypeScript 错误后再提交
```

**部署后页面空白**:
- 检查 Vercel 日志
- 确认 `next.config.mjs` 配置正确
- 确保 `package.json` 有正确的 `build` 脚本

**Secrets 不生效**:
- 确保 Secret 名称完全匹配（区分大小写）
- Secret 值不能包含空格或换行
- 修改 Secret 后需要重新触发 workflow

---

## 本地测试

测试 CI 工作流本地运行:
```bash
# 安装所有依赖
npm ci

# 运行 lint
npm run lint

# 运行测试
npm test

# 构建
npm run build

# 如果成功，推送代码触发 GitHub Actions
git push origin main
```
