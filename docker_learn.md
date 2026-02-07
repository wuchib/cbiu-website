# Docker 学习指南 - 结合 cbiu.fun 网站实战

> 本文档结合您的 cbiu.fun 网站项目，帮助您理解 Docker 相关概念。

---

## 1. Docker 基础知识

### 1.1 什么是 Docker？

**Docker** 是一个开源的容器化平台，它可以将应用程序及其所有依赖项打包到一个标准化的单元中，称为 **容器（Container）**。

简单比喻：
- **虚拟机** 就像是完整的独立电脑（包含操作系统、硬件虚拟化等）
- **Docker 容器** 就像是轻量级的"应用盒子"（只包含应用和依赖，共享主机操作系统内核）

### 1.2 核心概念

| 概念 | 说明 | 您项目中的例子 |
|------|------|--------------|
| **镜像 (Image)** | 只读模板，包含运行应用所需的一切 | `cbiu-website:latest`、`mysql:8.0` |
| **容器 (Container)** | 镜像的运行实例，可以启动、停止、删除 | `cbiu-website`、`cbiu-db` |
| **Dockerfile** | 构建镜像的脚本/配方 | 您项目根目录的 `Dockerfile` |
| **Docker Compose** | 定义和运行多容器应用的工具 | `docker-compose.yml` |
| **数据卷 (Volume)** | 持久化存储数据的机制 | `db-data` 卷存储 MySQL 数据 |
| **网络 (Network)** | 容器之间通信的桥梁 | `cbiu-network` |

### 1.3 常用 Docker 命令

```bash
# 镜像相关
docker images                    # 查看所有镜像
docker pull mysql:8.0            # 下载镜像
docker rmi cbiu-website:latest   # 删除镜像
docker build -t myapp:v1 .       # 构建镜像

# 容器相关
docker ps                        # 查看运行中的容器
docker ps -a                     # 查看所有容器（包括已停止的）
docker logs cbiu-website         # 查看容器日志
docker logs -f cbiu-website      # 实时跟踪日志
docker exec -it cbiu-db bash     # 进入容器执行命令
docker stop cbiu-website         # 停止容器
docker start cbiu-website        # 启动容器
docker restart cbiu-website      # 重启容器

# Docker Compose 相关
docker-compose up -d             # 启动所有服务（后台运行）
docker-compose down              # 停止并删除所有容器
docker-compose logs -f           # 查看所有服务日志
docker-compose ps                # 查看服务状态
```

---

## 2. Docker 部署的优势

### 2.1 为什么用 Docker 部署您的网站？

| 优势 | 传统部署 | Docker 部署 |
|------|---------|-------------|
| **环境一致性** | 开发、测试、生产环境可能不同 | 一次构建，处处运行 |
| **依赖管理** | 手动安装 Node.js、MySQL 等 | 全部打包在镜像中 |
| **隔离性** | 多个应用可能相互影响 | 每个容器独立运行 |
| **部署速度** | 每次都要配置环境 | 秒级启动 |
| **回滚能力** | 回滚复杂 | 切换镜像版本即可 |
| **可移植性** | 换服务器需要重新配置 | 复制镜像文件即可 |

### 2.2 具体到您的项目

```
您的开发环境 (Windows)        生产服务器 (Linux)
        ↓                            ↓
   相同的 Dockerfile    ──────>  相同的容器环境
   相同的 docker-compose.yml     相同的运行方式
```

**好处体现**：
1. **不用在服务器上安装 Node.js** - 容器里已经有了
2. **不用担心 Node.js 版本冲突** - 镜像固定使用 `node:20.9.0-alpine3.18`
3. **数据库配置简单** - MySQL 容器自动启动，无需手动安装配置
4. **快速恢复** - 服务器出问题？重新拉取镜像启动即可

---

## 3. Dockerfile 与 docker-compose.yml 的作用

### 3.1 Dockerfile - 构建应用镜像的"配方"

**作用**：定义如何一步步构建您的 `cbiu-website` 镜像。

您的 Dockerfile 采用了 **多阶段构建 (Multi-stage Build)**，这是一种优化镜像大小的最佳实践：

```
┌─────────────────────────────────────────────────────────────────┐
│  阶段 1: deps（依赖安装）                                         │
│  ├── 基于 node:20.9.0-alpine3.18                                 │
│  ├── 复制 package.json 和 lock 文件                              │
│  └── 安装所有 npm 依赖                                           │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  阶段 2: builder（构建应用）                                      │
│  ├── 复制阶段1的 node_modules                                     │
│  ├── 复制所有源代码                                               │
│  ├── 运行 prisma generate（生成数据库客户端）                      │
│  └── 运行 npm run build（构建 Next.js 应用）                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  阶段 3: runner（最终运行镜像）                                    │
│  ├── 只复制运行所需的文件（.next/standalone, public 等）           │
│  ├── 安装 proxychains-ng（代理工具，绕过 GFW）                     │
│  ├── 创建非 root 用户 nextjs（安全考虑）                          │
│  ├── 暴露端口 3000                                                │
│  └── 启动命令：proxychains4 -q node server.js                    │
└─────────────────────────────────────────────────────────────────┘
```

**为什么这样设计？**
- 最终镜像只包含运行所需文件，**体积小**（可能只有 200-300MB）
- 源代码和开发依赖不会进入生产镜像，**更安全**

### 3.2 docker-compose.yml - 编排多个容器

**作用**：定义和管理多个容器如何协同工作。

```yaml
# 您的 docker-compose.yml 结构解析

services:
  app:                              # 服务1：您的 Next.js 应用
    container_name: cbiu-website    # 容器名称
    image: cbiu-website:latest      # 使用的镜像
    network_mode: "host"            # 使用宿主机网络
    environment:                    # 环境变量配置
      - DATABASE_URL=...            # 数据库连接
      - AUTH_SECRET=...             # 认证密钥
      - GOOGLE_CLIENT_ID=...        # Google OAuth
      
  db:                               # 服务2：MySQL 数据库
    container_name: cbiu-db
    image: mysql:8.0
    volumes:
      - db-data:/var/lib/mysql      # 数据持久化
    ports:
      - "3306:3306"                 # 端口映射

volumes:
  db-data:                          # 定义数据卷
```

**类比**：
- `Dockerfile` = 如何制作一道菜（制作镜像）
- `docker-compose.yml` = 如何把多道菜组合成一桌宴席（运行多个容器）

---

## 4. 为什么需要两个容器？

### 4.1 容器职责分离

```
┌─────────────────────────────────────────────────────────────────────┐
│                          您的服务器                                  │
│                                                                     │
│   ┌─────────────────────┐         ┌─────────────────────┐          │
│   │   cbiu-website      │  ───>   │     cbiu-db         │          │
│   │   (Next.js 应用)    │  查询   │     (MySQL 数据库)   │          │
│   │                     │  数据   │                     │          │
│   │ - 处理 HTTP 请求    │         │ - 存储文章数据       │          │
│   │ - 渲染页面          │         │ - 存储用户评论       │          │
│   │ - 执行业务逻辑      │         │ - 存储分类信息       │          │
│   │ - Google OAuth      │         │ - 存储管理员账号     │          │
│   └─────────────────────┘         └─────────────────────┘          │
│          ↑                                    ↑                     │
│      端口 3000                             端口 3306                │
│   (通过 Nginx 代理)                      (内部访问)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 分离的好处

| 好处 | 说明 |
|------|------|
| **独立升级** | 更新网站代码不影响数据库，反之亦然 |
| **独立扩展** | 数据库压力大？可以单独优化或迁移 |
| **故障隔离** | 应用崩溃不会导致数据库崩溃 |
| **资源限制** | 可以分别限制 CPU、内存使用 |
| **数据安全** | 数据库容器可以不暴露到外网 |

### 4.3 如果合并成一个容器会怎样？

```bash
# ❌ 不推荐的做法：把 Node.js 和 MySQL 放在同一个容器
# 问题：
# 1. 镜像巨大（Node.js + MySQL 一起）
# 2. 更新代码需要重建整个容器，包括数据库
# 3. 违反"一个容器一个进程"的最佳实践
# 4. 难以管理和调试
```

---

## 5. 每次部署做了什么？

### 5.1 部署流程详解

当您推送代码到 GitHub `main` 分支时，会触发 `.github/workflows/deploy.yml`：

```
┌─ GitHub Actions 服务器 ─────────────────────────────────────────────┐
│                                                                     │
│  Step 1: Checkout code                                              │
│  └── 拉取您的最新代码                                                │
│                                                                     │
│  Step 2: Build Docker images                                        │
│  ├── docker build -t cbiu-website:latest .                          │
│  │   └── 根据 Dockerfile 构建新镜像                                  │
│  ├── docker save cbiu-website:latest -o cbiu-website.tar            │
│  │   └── 将镜像保存为 tar 文件                                       │
│  └── docker pull/save mysql:8.0                                     │
│      └── 同时打包 MySQL 镜像（避免服务器网络问题）                    │
│                                                                     │
│  Step 3: Upload to server (SCP)                                     │
│  └── 上传 cbiu-website.tar, mysql.tar, docker-compose.yml            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                              ↓ SSH 连接
┌─ 您的阿里云服务器 ──────────────────────────────────────────────────┐
│                                                                     │
│  Step 4: docker-compose down                                        │
│  └── 停止当前运行的容器                                              │
│                                                                     │
│  Step 5: docker rmi -f cbiu-website:latest                          │
│  └── 删除旧的网站镜像                                                │
│                                                                     │
│  Step 6: docker load -i cbiu-website.tar                            │
│  └── 加载新的镜像                                                    │
│                                                                     │
│  Step 7: docker-compose up -d                                       │
│  └── 启动所有服务（cbiu-website + cbiu-db）                          │
│                                                                     │
│  Step 8: Cleanup                                                    │
│  └── 清理临时文件和无用镜像                                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 5.2 每次部署的关键点

| 问题 | 答案 |
|------|------|
| **是在更新容器吗？** | ✅ 是的，每次都会停止旧容器，创建新容器 |
| **数据会丢失吗？** | ❌ 不会！因为使用了 `db-data` 数据卷 |
| **数据库结构会自动更新吗？** | ✅ 是的，`prisma migrate deploy` 会自动执行 |
| **为什么要删除旧镜像？** | 节省磁盘空间，避免镜像堆积 |
| **为什么打包成 tar？** | 避免服务器从 Docker Hub 拉取（可能很慢或被墙） |

### 5.3 数据持久化原理

```
容器生命周期：                     数据卷生命周期：
┌─────────────┐                  ┌─────────────┐
│ cbiu-db v1  │ ──────挂载────>  │   db-data   │
└─────────────┘                  │             │
      ↓ 部署更新                  │  (持久存储)  │
┌─────────────┐                  │             │
│ cbiu-db v2  │ ──────挂载────>  │   /data     │
└─────────────┘                  └─────────────┘
      ↓ 容器删除/重建
      ↓ ...
      
容器可以随时删除重建，            数据卷一直存在，
但数据不受影响！                  除非手动删除
```

---

## 6. 实用技巧

### 6.1 常用调试命令

```bash
# 查看网站日志
docker logs cbiu-website -f --tail 100

# 进入数据库容器
docker exec -it cbiu-db mysql -u root -p

# 查看容器资源使用
docker stats

# 查看网络连接
docker network inspect cbiu-network

# 强制重启服务
docker-compose restart app

# 重建并启动（不使用缓存）
docker-compose up -d --force-recreate
```

### 6.2 1Panel 管理

现在您已经安装了 1Panel，可以通过 Web 界面更直观地：
- 查看容器状态和日志
- 监控 CPU/内存/磁盘使用
- 重启/停止容器
- 管理数据库

---

## 7. 总结

| 文件 | 作用 | 比喻 |
|------|------|------|
| `Dockerfile` | 定义如何构建应用镜像 | 菜谱 |
| `docker-compose.yml` | 定义如何运行多个容器 | 点菜单 |
| `deploy.yml` | 自动化部署流程 | 厨房工作流程 |

```
代码推送 → GitHub Actions 构建镜像 → 上传到服务器 → 替换旧容器 → 网站更新完成
   1            2-3分钟                  30秒          10秒         ✅
```

现在您应该对 Docker 有了基本的了解！如有疑问，欢迎继续探讨。
