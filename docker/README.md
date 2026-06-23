# MALIANG Production Deployment

部署基于 Docker + Nginx，适用于生产环境。

## 快速开始

### 构建镜像

```bash
docker build -t maliang:latest .
```

### 运行容器

```bash
docker run -d \
  --name maliang \
  -p 5910:5910 \
  maliang:latest
```

访问 http://localhost:5910/bi/

### 使用 Docker Compose

```yaml
version: '3.8'

services:
  maliang:
    build: .
    container_name: maliang
    restart: unless-stopped
    ports:
      - "5910:5910"
    environment:
      - NODE_ENV=production
```

运行：

```bash
docker-compose up -d
```

## 环境变量

如需在构建时传入环境变量，可以使用 `--build-arg`：

```bash
docker build --build-arg API_BASE=https://api.example.com -t maliang:latest .
```

## 生产环境配置

### 使用外部代理地址

如果需要修改 API 代理地址，编辑 `docker/nginx.conf` 中的 `/aisos/` location 块：

```nginx
location /aisos/ {
    proxy_pass http://YOUR_API_SERVER:PORT;
    # ...
}
```

### HTTPS 配置

如需 HTTPS，可在前端使用 Nginx 反向代理或在容器前加一层 Nginx/Caddy。

## 目录结构

```
maliang/
├── docker/
│   └── nginx.conf      # Nginx 配置文件
├── Dockerfile          # 多阶段构建配置
├── .dockerignore       # Docker 构建忽略文件
└── .umirc.ts           # Umi 配置 (publicPath: /bi/)
```

## 注意事项

1. **端口 5910**：已在配置中硬编码，如需修改请同时更新：
   - `docker/nginx.conf` 中的 `listen 5910`
   - Docker 运行的 `-p` 端口映射

2. **API 代理**：当前配置代理到 `http://111.19.166.16:10628`，如需修改请编辑 `nginx.conf`

3. **构建缓存**：生产环境建议定期清理旧镜像以节省空间：

   ```bash
   docker image prune -f
   ```
