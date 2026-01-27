# GitHub Actions 自动部署配置指南

## 前置准备

### 1. 服务器准备

在服务器上确保以下内容已就绪：

```bash
# 1. 确保项目目录存在
mkdir -p /root/projects/cbiu-website
cd /root/projects/cbiu-website

# 2. 准备 docker-compose.yml 和 .env 文件
# 确保 docker-compose.yml 配置正确（使用 image 而非 build）

# 3. 拉取 MySQL 镜像（首次部署需要）
docker pull mysql:8.0

# 4. 启动数据库
docker-compose up -d db

# 5. 等待数据库启动
sleep 20
```

### 2. 生成 SSH 密钥（本地 Windows）

在 PowerShell 中：

```powershell
# 生成 SSH 密钥对（如果还没有）
ssh-keygen -t rsa -b 4096 -f "$env:USERPROFILE\.ssh\cbiu_deploy"

# 查看公钥
Get-Content "$env:USERPROFILE\.ssh\cbiu_deploy.pub"

# 查看私钥（用于 GitHub Secrets）
Get-Content "$env:USERPROFILE\.ssh\cbiu_deploy"
```

### 3. 将公钥添加到服务器

```bash
# SSH 连接到服务器
ssh root@your-server-ip

# 添加公钥到授权列表
echo "your-public-key-content" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

## GitHub 配置

### 1. 推送代码到 GitHub

```powershell
cd d:\project\cbiu-webside

# 如果还没初始化 git
git init
git add .
git commit -m "Initial commit with GitHub Actions"

# 关联远程仓库（替换为您的仓库地址）
git remote add origin https://github.com/YOUR_USERNAME/cbiu-website.git

# 推送代码
git branch -M main
git push -u origin main
```

### 2. 配置 GitHub Secrets

访问：`https://github.com/YOUR_USERNAME/cbiu-website/settings/secrets/actions`

点击 **New repository secret**，添加以下密钥：

| Name | Value | 说明 |
|------|-------|------|
| `SERVER_HOST` | `your.server.ip.address` | 服务器 IP 地址 |
| `SERVER_USER` | `root` | SSH 用户名 |
| `SERVER_SSH_KEY` | `-----BEGIN OPENSSH PRIVATE KEY-----...` | SSH 私钥内容（完整的） |
| `SERVER_PORT` | `22` | SSH 端口（可选，默认 22） |

**获取 SSH 私钥内容：**
```powershell
Get-Content "$env:USERPROFILE\.ssh\cbiu_deploy"
```
复制**完整内容**（包括开头和结尾的标记）。

## 使用方式

### 自动部署

每次 push 代码到 `main` 分支，GitHub Actions 会自动：

1. ✅ 构建 Docker 镜像
2. ✅ 上传到服务器
3. ✅ 加载镜像并重启容器
4. ✅ 清理临时文件

```bash
# 本地修改代码后
git add .
git commit -m "Update features"
git push

# 🎉 自动部署开始！
```

### 手动触发

访问：`https://github.com/YOUR_USERNAME/cbiu-website/actions`
选择 "Deploy to Production" → "Run workflow"

### 查看部署日志

`https://github.com/YOUR_USERNAME/cbiu-website/actions`

点击最新的 workflow run 查看详细日志。

## 首次部署

```bash
# 1. 在服务器上准备环境
cd /root/projects/cbiu-website

# 2. 确保 docker-compose.yml 正确配置
cat docker-compose.yml

# 3. 配置环境变量
cp .env.prod.example .env
nano .env

# 4. 启动数据库
docker-compose up -d db
sleep 20

# 5. 推送代码触发首次部署
# （在本地 Windows 执行）
git push

# 6. 等待 GitHub Actions 完成

# 7. 运行数据库迁移
docker-compose exec app npx prisma migrate deploy

# 8. 验证
curl http://localhost:3000
```

## 故障排查

### 部署失败

1. 检查 GitHub Actions 日志
2. 确认服务器 SSH 连接正常
3. 检查服务器磁盘空间：`df -h`
4. 查看容器日志：`docker-compose logs app`

### SSH 连接失败

```bash
# 测试 SSH 密钥（本地）
ssh -i "$env:USERPROFILE\.ssh\cbiu_deploy" root@your-server-ip

# 检查服务器 SSH 配置
sudo nano /etc/ssh/sshd_config
# 确保 PubkeyAuthentication yes
```

### 镜像加载失败

```bash
# 检查磁盘空间
df -h

# 清理旧镜像
docker system prune -af
```

## 优化建议

### 加快部署速度

在 `.github/workflows/deploy.yml` 中添加缓存：

```yaml
- name: Cache Docker layers
  uses: actions/cache@v3
  with:
    path: /tmp/.buildx-cache
    key: ${{ runner.os }}-buildx-${{ github.sha }}
    restore-keys: |
      ${{ runner.os }}-buildx-
```

### 部署通知

添加部署成功/失败通知（可选）：

```yaml
- name: Notify deployment status
  if: always()
  run: |
    # 发送通知到钉钉、Slack 等
```
