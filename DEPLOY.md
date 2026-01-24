# CBIU Website 部署方案 (Docker)

本文档详细介绍了如何使用 Docker 和 Docker Compose 部署 CBIU Website，并配置 Nginx 反向代理以实现公网访问。

## 1. 准备工作

确保你的服务器（VPS）已经安装了以下软件：
- **Docker**: [安装指南](https://docs.docker.com/engine/install/)
- **Docker Compose**: [安装指南](https://docs.docker.com/compose/install/)
- **Git**: 用于拉取代码

## 2. 项目配置

### 2.1 获取代码
建议在服务器上创建一个专门存放项目的目录，例如 `~/projects` 或 `/opt/cbiu`。

```bash
mkdir -p ~/projects
cd ~/projects

git clone https://github.com/your-repo/cbiu-webside.git
cd cbiu-webside
```

### 2.2 环境变量配置 (关键步骤)

Docker Compose 会自动读取同目录下的 `.env` 文件来填充配置。我们需要创建一个`.env`文件来管理敏感信息。

**1. 创建 `.env` 文件**
在项目根目录（即 `cbiu-webside` 文件夹内）创建一个名为 `.env` 的文件：

```bash
nano .env
```

**2. 填入以下内容 (请根据注释修改):**

```env
# --- 数据库配置 ---
# 格式: mysql://用户名:密码@服务名:3306/数据库名
# 注意: 
# 1. 这里的 host 必须填 'db'，因为这是我们在 docker-compose.yml 中给数据库服务起的名字
# 2. 这里的密码 (123456) 必须与下面 MYSQL_ROOT_PASSWORD 保持一致
DATABASE_URL="mysql://root:123456@db:3306/cbiu_webside"
# --- MySQL 容器初始化配置 ---
# 这些变量仅用于首次创建数据库容器时设置密码和库名。
# 必须与上面的 DATABASE_URL 中的信息保持一致。
MYSQL_ROOT_PASSWORD="123456"      # 数据库 root 密码
MYSQL_DATABASE="cbiu_webside"     # 默认创建的数据库名
# --- NextAuth 认证配置 ---
# 1. 生成一个随机密钥。在终端运行: openssl rand -base64 32
# 将输出的结果填在下面:
AUTH_SECRET="lHZ93apCxxHrjKfvxGTVOUCquHA0qF9gq30PSg07e8M="
# 2. 你的网站完整访问地址 (包含协议 https://)
# 如果你还在本地测试，可以用 http://localhost:3000
# 上线时务必改成你的域名，例如:
# AUTH_URL="https://www.your-domain.com"
AUTH_URL="http://你的公网IP:3000" 

```

**3. 保存并退出**
- 如果是使用 `nano`: 按 `Ctrl + O` -> `Enter` (保存), 然后 `Ctrl + X` (退出)。
- 如果是使用 `vim`: 按 `Esc` -> 输入 `:wq` -> `Enter`。

> **注意**: `.env` 文件包含密码，**绝对不要**提交到 GitHub 等公开仓库！

## 3. 启动服务

在此之前，如果服务器内存较小（<4G），**强烈建议先增加 Swap**，否则可能会因为内存不足构建失败。
```bash
# 增加 4G Swap (一次性执行即可)
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile && echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

然后，在项目根目录下运行：

```bash
# 构建并后台启动
docker-compose up -d --build
```

查看日志确保启动成功（可能需要几分钟构建）：
```bash
docker-compose logs -f app
```
如果看到 `Ready in ...` 字样，说明应用已启动并监听在 `0.0.0.0:3000`。

### 3.1 数据库初始化
首次启动数据库是空的，我们需要同步数据库结构。

```bash
# 进入应用容器执行迁移命令
docker-compose exec app npx prisma db push

# (可选) 填充初始数据
docker-compose exec app npx prisma db seed
```

## 4. 访问网站

### 方法 A: 使用 IP 直接访问 (最简单)
如果你没有域名，或者不想配 Nginx：
1. 去云服务器控制台 -> 安全组 -> 放行 TCP **3000** 端口。
2. 在浏览器输入: `http://你的公网IP:3000`

### 方法 B: 公网访问配置 (Nginx 反向代理 + 域名)

**前提**: 你已经买好了域名，并解析到了你的服务器 IP。

假设你已经安装了 Nginx (`sudo apt install nginx`)。

#### 1. Nginx 配置
创建一个新的配置文件 `/etc/nginx/sites-available/cbiu`：

```nginx
server {
    listen 80;
    server_name cbiu.fun www.cbiu.fun; # 替换你的域名

    location / {
        proxy_pass http://localhost:3000; # 转发到 Docker 容器映射的端口
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 获取真实IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置并重载 Nginx：
```bash
sudo ln -s /etc/nginx/sites-available/cbiu /etc/nginx/sites-enabled/
sudo nginx -t # 检查配置语法
sudo systemctl reload nginx
```

#### 2. 开启 HTTPS (推荐)

使用 Certbot 免费获取 SSL 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 5.常用维护命令

- **停止服务**: `docker-compose down`
- **重启服务**: `docker-compose restart`
- **查看应用日志**: `docker-compose logs -f --tail=100 app`
- **查看数据库日志**: `docker-compose logs -f --tail=100 db`
- **更新应用**:
  1. `git pull`
  2. `docker-compose up -d --build` (这将重新构建镜像并重启容器)
