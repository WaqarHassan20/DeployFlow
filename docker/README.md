# DeployFlow Docker Services

This directory contains Docker configurations for all microservices in the DeployFlow monorepo. Each service is containerized for production deployment with optimized multi-stage builds.

## 🏗️ Architecture Overview

DeployFlow consists of 4 main services:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Front-End     │    │   API Server    │    │  Build Server   │
│   (Next.js)     │────▶   (Express)     │────▶  (Git + S3)    │
│   Port: 3000    │    │   Port: 9000    │    │  (On-demand)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         ▲                        ▲
         │                        │
┌─────────────────┐               │
│  Reverse Proxy  │───────────────┘
│   (Express)     │
│   Port: 8080    │
└─────────────────┘
```

---

## 📦 Service Details

### 1. **Front-End Service** (`Dockerfile.front-end`)
- **Framework**: Next.js 15.5.3 with React
- **Runtime**: Bun 1.2.15 on Alpine Linux
- **Port**: 3000
- **Build Time**: ~12-15 minutes
- **Features**:
  - Server-side rendering (SSR)
  - Static asset optimization
  - Prisma client integration
  - Production-optimized build

**Dependencies**:
- `@repo/prisma-store` - Database operations
- Next.js, React, TypeScript
- Framer Motion, Tailwind CSS

**Environment Variables**:
```bash
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
PORT=3000
HOSTNAME=0.0.0.0
```

**Build Command**:
```bash
docker build -f docker/Dockerfile.front-end -t deployflow/front-end .
```

**Run Command**:
```bash
docker run -p 3000:3000 -e DATABASE_URL="postgresql://..." deployflow/front-end
```

---

### 2. **API Server** (`Dockerfile.api-server`)
- **Framework**: Express.js with TypeScript
- **Runtime**: Bun 1.2.15 on Alpine Linux
- **Port**: 9000
- **Build Time**: ~3-4 minutes
- **Features**:
  - RESTful API endpoints
  - CORS configuration
  - Prisma database integration
  - Health check endpoint

**API Endpoints**:
- `GET /health` - Health check
- `/user` - User management
- `/project` - Project operations
- `/deploy` - Deployment management
- `/logs` - Build logs

**Dependencies**:
- `@repo/prisma-store` - Database operations
- Express, CORS, dotenv

**Environment Variables**:
```bash
NODE_ENV=production
API_PORT=9000
DATABASE_URL=postgresql://...
FRONTEND_URL=http://localhost:3000
```

**Build Command**:
```bash
docker build -f docker/Dockerfile.api-server -t deployflow/api-server .
```

**Run Command**:
```bash
docker run -p 9000:9000 \
  -e DATABASE_URL="postgresql://..." \
  -e FRONTEND_URL="http://localhost:3000" \
  deployflow/api-server
```

---

### 3. **Build Server** (`Dockerfile.build-server`)
- **Framework**: Node.js with Git & S3 integration
- **Runtime**: Bun 1.2.15 on Alpine Linux
- **Port**: No exposed port (runs tasks)
- **Build Time**: ~4-5 minutes
- **Features**:
  - Git repository cloning
  - Project building (npm/yarn/bun)
  - S3 static file deployment
  - Prisma database logging

**Workflow**:
1. Clone repository from Git URL
2. Install project dependencies
3. Build static assets
4. Upload to S3 bucket
5. Log deployment status

**Dependencies**:
- `@repo/awss3` - S3 file operations
- `@repo/prisma-store` - Database logging
- Git, mime-types

**Environment Variables**:
```bash
NODE_ENV=production
GIT_REPOSITORY_URL=https://github.com/user/repo
PROJECT_ID=unique-project-id
DEPLOYMENT_ID=unique-deployment-id
S3_ACCESS_KEY_ID=your-access-key
S3_SECRET_ACCESS_KEY=your-secret-key
S3_ENDPOINT=https://s3.amazonaws.com
BUCKET=your-bucket-name
DATABASE_URL=postgresql://...
```

**Build Command**:
```bash
docker build -f docker/Dockerfile.build-server -t deployflow/build-server .
```

**Run Command**:
```bash
docker run \
  -e GIT_REPOSITORY_URL=https://github.com/user/repo \
  -e PROJECT_ID=my-project \
  -e DEPLOYMENT_ID=deploy-123 \
  -e S3_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE \
  -e S3_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY \
  -e S3_ENDPOINT=https://s3.amazonaws.com \
  -e BUCKET=my-deployments \
  -e DATABASE_URL=postgresql://... \
  deployflow/build-server
```

---

### 4. **Reverse Proxy** (`Dockerfile.reverse-proxy`)
- **Framework**: Express.js with http-proxy
- **Runtime**: Bun 1.2.15 on Alpine Linux
- **Port**: 8080
- **Build Time**: ~30 seconds
- **Features**:
  - Subdomain-based routing
  - Static file serving
  - Load balancing support

**Routing Logic**:
- `project1.deployflow.com` → `BASE_PATH/project1/`
- `project2.deployflow.com` → `BASE_PATH/project2/`
- Root path `/` → `/index.html`

**Dependencies**:
- Express, http-proxy

**Environment Variables**:
```bash
NODE_ENV=production
PORT=8080
BASE_PATH=https://s3.amazonaws.com/bucket-name
```

**Build Command**:
```bash
docker build -f docker/Dockerfile.reverse-proxy -t deployflow/reverse-proxy .
```

**Run Command**:
```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e BASE_PATH=https://s3.amazonaws.com/my-bucket \
  deployflow/reverse-proxy
```

---

## 🚀 Build All Services

```bash
# Build all Docker images
docker build -f docker/Dockerfile.front-end -t deployflow/front-end .
docker build -f docker/Dockerfile.api-server -t deployflow/api-server .
docker build -f docker/Dockerfile.build-server -t deployflow/build-server .
docker build -f docker/Dockerfile.reverse-proxy -t deployflow/reverse-proxy .
```

## 🐳 Docker Compose (Optional)

Create a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  front-end:
    build:
      context: .
      dockerfile: docker/Dockerfile.front-end
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/deployflow

  api-server:
    build:
      context: .
      dockerfile: docker/Dockerfile.api-server
    ports:
      - "9000:9000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/deployflow
      - FRONTEND_URL=http://localhost:3000

  reverse-proxy:
    build:
      context: .
      dockerfile: docker/Dockerfile.reverse-proxy
    ports:
      - "8080:8080"
    environment:
      - BASE_PATH=https://s3.amazonaws.com/your-bucket
```

## 🔧 Troubleshooting

### Common Issues

1. **Build fails with "Cannot find package"**
   - Ensure all workspace dependencies are properly copied
   - Check that package.json files exist in workspace packages

2. **Prisma client not found**
   - Verify `bunx prisma generate` runs successfully
   - Check DATABASE_URL is properly set

3. **Permission denied errors**
   - All services run as non-root user `appUser`
   - Files are copied with proper ownership

4. **Large build times**
   - Front-end: ~12-15 minutes (includes full Next.js build)
   - Build-server: ~4-5 minutes (includes Prisma generation)
   - API-server: ~3-4 minutes
   - Reverse-proxy: ~30 seconds

### Health Checks

- **API Server**: `GET /health`
- **Front-end**: `GET /` (should return HTML)
- **Reverse-proxy**: `GET /` (should proxy correctly)
- **Build-server**: Check logs for successful deployment

---

## 📊 Resource Requirements

| Service | RAM | CPU | Disk | Build Time |
|---------|-----|-----|------|------------|
| front-end | 512MB | 1 CPU | 1GB | 12-15 min |
| api-server | 256MB | 0.5 CPU | 500MB | 3-4 min |
| build-server | 512MB | 1 CPU | 1GB | 4-5 min |
| reverse-proxy | 128MB | 0.25 CPU | 100MB | 30 sec |

---

## 🏷️ Tags & Versioning

Use semantic versioning for production deployments:

```bash
# Tag with version
docker tag deployflow/front-end deployflow/front-end:v1.0.0
docker tag deployflow/api-server deployflow/api-server:v1.0.0

# Push to registry
docker push deployflow/front-end:v1.0.0
docker push deployflow/api-server:v1.0.0
```

---

Built with ❤️ using Bun, Docker, and Alpine Linux