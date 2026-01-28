# GitHub Actions 自动部署问题总结

本文档记录了在配置 GitHub Actions 自动部署到生产服务器时遇到的所有问题及解决方案。

---

## 📋 目录

1. [部署架构](#部署架构)
2. [问题一：Secrets 配置警告](#问题一secrets-配置警告)
3. [问题二：文件权限拒绝](#问题二文件权限拒绝)
4. [问题三：服务器网络限制](#问题三服务器网络限制)
5. [问题四：docker-compose 配置冲突](#问题四docker-compose-配置冲突)
6. [问题五：环境变量缺失](#问题五环境变量缺失)
7. [问题六：数据库迁移缺失](#问题六数据库迁移缺失)
8. [问题七：镜像缓存更新失败](#问题七镜像缓存更新失败)
9. [问题八：Next.js 静态生成与动态渲染差异](#问题八nextjs-静态生成与动态渲染差异)
10. [最终解决方案](#最终解决方案)
11. [经验教训](#经验教训)
12. [完整问题列表总结](#完整问题列表总结)

---

## 部署架构

### 目标
使用 GitHub Actions 实现代码推送后自动构建 Docker 镜像并部署到生产服务器。

### 技术栈
- **应用**：Next.js 16 + Prisma
- **容器化**：Docker + Docker Compose
- **CI/CD**：GitHub Actions
- **部署方式**：SCP 上传镜像 + SSH 远程执行部署命令

---

## 问题一：Secrets 配置警告

### ❌ 错误信息
```
Context access might be invalid: SERVER_HOST @[deploy.yml:L27]
```

### 🔍 原因分析
GitHub Actions 在静态分析时无法验证 `secrets.SERVER_HOST` 是否存在，因为 repository secrets 尚未配置。

### ✅ 解决方案
在 GitHub 仓库设置中添加以下 Secrets：

1. 进入 **Settings** → **Secrets and variables** → **Actions**
2. 添加以下 secrets：
   - `SERVER_HOST`：服务器 IP 地址（如 `8.166.136.59`）
   - `SERVER_USER`：SSH 用户名（如 `root`）
   - `SERVER_SSH_KEY`：SSH 私钥完整内容
   - `SERVER_PORT`：SSH 端口（可选，默认 22）

---

## 问题二：文件权限拒绝

### ❌ 错误信息
```
tar: can't open 'cbiu-website.tar': Permission denied
exit status 1
```

### 🔍 原因分析
`docker save` 命令生成的 tar 文件默认权限可能不允许后续的 SCP action 读取。

### ✅ 解决方案
在保存 Docker 镜像后添加 `chmod` 命令修改文件权限：

```yaml
- name: Build Docker image
  run: |
    docker build -t cbiu-website:latest .
    docker save cbiu-website:latest -o cbiu-website.tar
    chmod 644 cbiu-website.tar  # 添加此行
```

---

## 问题三：服务器网络限制

### ❌ 错误信息
```
ERROR: failed to resolve reference "docker.io/library/mysql:8.0": 
failed to do request: Head "https://registry-1.docker.io/v2/library/mysql/manifests/8.0": 
dial tcp 168.143.162.58:443: i/o timeout
```

### 🔍 原因分析
生产服务器存在严重的网络限制问题：
1. 无法访问 Docker Hub 官方镜像仓库
2. DNS 解析失败（无法解析 `mirror.ccs.tencentyun.com` 等镜像加速器域名）
3. 配置了 Docker 镜像加速器后仍然超时
4. 尝试多个镜像源（腾讯云、阿里云、网易、中科大）均失败

**核心问题**：服务器网络环境特殊，几乎无法从外部拉取任何 Docker 镜像。

### ✅ 解决方案
**将镜像拉取工作转移到 GitHub Actions 服务器**（网络畅通），然后上传到生产服务器：

#### 1. 修改构建步骤，同时拉取并保存 MySQL 镜像

```yaml
- name: Build Docker images
  run: |
    # Build application image
    docker build -t cbiu-website:latest .
    docker save cbiu-website:latest -o cbiu-website.tar
    chmod 644 cbiu-website.tar
    
    # Pull and save MySQL image
    docker pull mysql:8.0
    docker save mysql:8.0 -o mysql.tar
    chmod 644 mysql.tar
```

#### 2. 上传两个镜像文件

```yaml
- name: Upload images to server
  uses: appleboy/scp-action@v0.1.7
  with:
    source: "cbiu-website.tar,mysql.tar"  # 上传多个文件
    target: "/root/projects/cbiu-website/"
```

#### 3. 在服务器上加载镜像

```yaml
script: |
  cd /root/projects/cbiu-website
  docker load -i mysql.tar
  docker load -i cbiu-website.tar
```

---

## 问题四：docker-compose 配置冲突

### ❌ 错误信息
```
Building app
ERROR: failed to solve: node:20.9.0-alpine3.18: 
failed to resolve source metadata for docker.io/library/node:20.9.0-alpine3.18
```

### 🔍 原因分析
`docker-compose.yml` 中 `app` 服务配置了 `build` 字段：

```yaml
app:
  build:
    context: .
    dockerfile: Dockerfile
```

执行 `docker-compose up -d` 时，Docker Compose 会尝试**重新构建镜像**，而不是使用已有的 `cbiu-website:latest` 镜像。这导致服务器再次尝试从网络拉取 Node.js 基础镜像，最终失败。

### ✅ 解决方案（两步）

#### 方案 1：修改本地 docker-compose.yml
将 `build` 配置改为 `image` 配置：

```yaml
app:
  container_name: cbiu-website
  image: cbiu-website:latest  # 使用预构建镜像
  restart: always
```

**优点**：一劳永逸  
**缺点**：影响本地开发环境的构建流程

#### 方案 2：部署时自动修改（最终采用）
在 GitHub Actions 部署脚本中自动修改服务器上的 `docker-compose.yml`：

```yaml
script: |
  cd /root/projects/cbiu-website
  
  # Load images
  docker load -i mysql.tar
  docker load -i cbiu-website.tar
  
  # Auto-fix docker-compose.yml
  if grep -q "build:" docker-compose.yml; then
    sed -i '/app:/,/restart:/ {
      /build:/,/dockerfile:/d
      /container_name:/a\    image: cbiu-website:latest
    }' docker-compose.yml
  fi
  
  # Start services
  docker-compose up -d
```

**优点**：不影响本地开发，每次部署自动修正  
**缺点**：需要额外的脚本逻辑

---

## 问题五：环境变量缺失

### ❌ 现象
容器启动后立即退出，或应用无法连接数据库。

### 🔍 原因分析
GitHub Actions 只上传了镜像文件，但**没有上传 `.env` 文件**（因为 `.env` 在 `.gitignore` 中）。

应用启动时缺少必要的环境变量：
- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL`
- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`

### ✅ 解决方案
在服务器上手动创建 `.env` 文件：

```bash
cd /root/projects/cbiu-website
nano .env
```

填入以下内容：

```env
# 数据库配置
DATABASE_URL="mysql://root:123456@db:3306/cbiu_webside"

# MySQL 初始化配置
MYSQL_ROOT_PASSWORD="123456"
MYSQL_DATABASE="cbiu_webside"

# NextAuth 配置
AUTH_SECRET="生成的随机密钥"  # 使用 openssl rand -base64 32 生成
AUTH_URL="http://8.166.136.59:3000"
```

> **注意**：`AUTH_URL` 必须包含 `http://` 协议前缀，否则会导致认证失败。

---

## 最终解决方案

### 完整的 GitHub Actions 工作流

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      
      # 构建应用镜像 + 拉取 MySQL 镜像
      - name: Build Docker images
        run: |
          docker build -t cbiu-website:latest .
          docker save cbiu-website:latest -o cbiu-website.tar
          chmod 644 cbiu-website.tar
          
          docker pull mysql:8.0
          docker save mysql:8.0 -o mysql.tar
          chmod 644 mysql.tar
      
      # 同时上传两个镜像
      - name: Upload images to server
        uses: appleboy/scp-action@v0.1.7
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT || 22 }}
          source: "cbiu-website.tar,mysql.tar"
          target: "/root/projects/cbiu-website/"
      
      # 部署并自动修正配置
      - name: Deploy on server
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          port: ${{ secrets.SERVER_PORT || 22 }}
          script: |
            cd /root/projects/cbiu-website
            
            # 加载镜像
            docker load -i mysql.tar
            docker load -i cbiu-website.tar
            
            # 自动修正 docker-compose.yml
            if grep -q "build:" docker-compose.yml; then
              sed -i '/app:/,/restart:/ {
                /build:/,/dockerfile:/d
                /container_name:/a\    image: cbiu-website:latest
              }' docker-compose.yml
            fi
            
            # 启动服务
            docker-compose up -d
            
            # 清理
            docker image prune -f
            rm cbiu-website.tar mysql.tar
            
            echo "✅ Deployment completed successfully!"
```

---

## 经验教训

### 1. 🌐 网络环境评估至关重要
在配置 CI/CD 之前，必须先评估生产服务器的网络环境：
- 能否访问 Docker Hub？
- 能否使用镜像加速器？
- DNS 解析是否正常？

如果网络受限，应该将镜像构建工作完全转移到 CI 环境。

### 2. 📦 Docker Compose 的两种模式
- **开发模式**：使用 `build` 配置，本地构建镜像
- **生产模式**：使用 `image` 配置，使用预构建镜像

两种模式不能混用，否则会导致部署时尝试重新构建。

### 3. 🔐 环境变量管理
- `.env` 文件不应提交到 Git
- 生产环境需要手动或通过配置管理工具创建 `.env`
- 考虑使用 GitHub Secrets + 部署脚本自动生成 `.env`

### 4. 🛠️ 自动化脚本的健壮性
部署脚本应该：
- 检查文件是否存在
- 处理配置文件差异
- 提供清晰的错误信息
- 支持幂等操作（多次执行结果一致）

### 5. 📝 权限问题预防
生成的文件（如 tar 包）应该显式设置权限，避免后续步骤无法访问。

### 6. 🔄 分步验证
遇到问题时，逐步验证：
1. 镜像是否已构建？
2. 镜像是否已上传？
3. 镜像是否已加载？
4. 容器是否已创建？
5. 容器是否正在运行？
6. 应用是否正常启动？

---

## 后续优化建议

1. **使用私有镜像仓库**
   - 在阿里云 ACR 或腾讯云 TCR 创建私有仓库
   - GitHub Actions 推送镜像到私有仓库
   - 服务器从私有仓库拉取（避免传输大文件）

2. **环境变量自动化**
   ```yaml
   - name: Create .env file
     script: |
       cat > .env << EOF
       DATABASE_URL=${{ secrets.DATABASE_URL }}
       AUTH_SECRET=${{ secrets.AUTH_SECRET }}
       AUTH_URL=${{ secrets.AUTH_URL }}
       EOF
   ```

3. **健康检查**
   添加部署后的健康检查：
   ```yaml
   - name: Health check
     run: |
       sleep 10
       curl -f http://${{ secrets.SERVER_HOST }}:3000/ || exit 1
   ```

4. **回滚机制**
   保留上一个版本的镜像，部署失败时自动回滚。

5. **通知集成**
   部署成功/失败时发送通知（Slack、邮件、企业微信等）。

---

## 总结

这次部署经历了从简单的配置错误到复杂的网络环境问题，最终通过**将镜像构建转移到 CI 环境**和**自动化配置修正**解决了所有问题。

**关键要点**：
- ✅ CI/CD 设计应适应生产环境限制
- ✅ 网络受限环境需要完整的镜像传输方案
- ✅ 自动化脚本要能处理配置差异
- ✅ 环境变量管理需要明确的流程

GitHub Actions 部署已成功运行，现在每次代码推送都会自动构建并部署到生产环境！🎉

---

## 问题六：数据库迁移缺失

### ❌ 错误信息
```
Error [PrismaClientKnownRequestError]: 
Invalid `prisma.articleCategory.findMany()` invocation:
The table `article_categories` does not exist in the current database.
```

### 🔍 原因分析
本地开发添加了新功能（文章分类模块），更新了 Prisma schema 并在本地执行了数据库迁移，但生产数据库没有执行相应的迁移。Dockerfile 使用 Next.js Standalone 模式，`prisma/schema.prisma` 不会被包含在生产镜像中。

### ✅ 解决方案
在服务器上手动创建表：

```bash
docker exec -it cbiu-db mysql -uroot -p123456 cbiu_webside

CREATE TABLE article_categories (
  id VARCHAR(191) NOT NULL PRIMARY KEY,
  name VARCHAR(191) NOT NULL,
  slug VARCHAR(191) NOT NULL UNIQUE,
  description TEXT,
  color VARCHAR(191),
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE articles ADD COLUMN category_id VARCHAR(191);
```

---

## 问题七：镜像缓存更新失败

### ❌ 现象
GitHub Actions 显示部署成功，但服务器镜像 ID 未变化，应用仍运行旧代码。

### 🔍 原因分析
`docker load` 不会覆盖同名镜像（`cbiu-website:latest`），导致新镜像没有真正加载。

### ✅ 解决方案
在加载新镜像前强制删除旧镜像：

```yaml
script: |
  docker-compose down || true
  docker rmi -f cbiu-website:latest || echo "No old image"
  docker load -i cbiu-website.tar
  docker images | grep cbiu-website  # 验证新镜像
  docker-compose up -d
```

---

## 问题八：Next.js 静态生成与动态渲染差异

### ❌ 错误信息
```
Error [PrismaClientValidationError]: 
Invalid `prisma.article.findUnique()` invocation:
Argument `where` needs at least one of `id` or `slug` arguments.
```

本地正常，生产环境报错。

### 🔍 原因分析
- **本地开发**（`pnpm dev`）：动态渲染，每次请求都执行
- **生产环境**：Next.js 默认静态生成，构建时预渲染导致错误

### ✅ 解决方案
强制使用动态渲染：

```typescript
// app/[locale]/articles/[slug]/page.tsx
export const dynamic = 'force-dynamic'  // 添加此行

export default async function ArticlePage(props: { params: Promise<{ slug: string }> }) {
  // ... 现有代码
}
```

---

## 完整问题列表总结

1. ✅ Secrets 配置警告 → 添加 GitHub Secrets
2. ✅ 文件权限拒绝 → 添加 `chmod 644`
3. ✅ 服务器网络限制 → CI 环境拉取镜像
4. ✅ docker-compose 配置冲突 → 自动修正配置
5. ✅ 环境变量缺失 → 手动创建 `.env`
6. ✅ 数据库表缺失 → 手动创建表
7. ✅ 镜像缓存更新失败 → 强制删除旧镜像
8. ✅ Next.js 静态生成错误 → 强制动态渲染

所有问题已解决，自动部署完全正常运行！🚀
