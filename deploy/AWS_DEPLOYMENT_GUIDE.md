# Kuwait Painters Platform - AWS Production Deployment Guide
**Author:** DevOps & Cloud Infrastructure Architect  
**Version:** 2.0.0 (Multi-Tenant EC2 & Caddy Production Hardened)  
**Date:** October 2026  
**Target Environments:** AWS EC2 (Amazon Linux 2023 - IP: 16.16.208.155) & Cloudflare Pages  

---

## 1. Architecture Overview (Shared Production Host)

The Kuwait Painters platform is engineered to deploy seamlessly on a **shared AWS EC2 host** alongside other live production applications without interference:

```
[ Visitor / Client Browser ]
             │
             ├─────────────────────────────────────────┐
             │ Frontend (SPA)                           │ API & Database
             ▼                                         ▼
┌───────────────────────────────┐         ┌───────────────────────────────────┐
│     Cloudflare Pages CDN      │         │     Cloudflare Edge (WAF/DDoS)    │
│  - sabbagh-kuwait.pages.dev   │         │  - api.kuwaitpainters.com         │
│  - SPA rewrite via _redirects │         └─────────────────┬─────────────────┘
│  - Immutable asset caching    │                           │ Port 443 / 80
└───────────────────────────────┘                           ▼
                                          ┌───────────────────────────────────┐
                                          │      AWS EC2 (16.16.208.155)      │
                                          │                                   │
                                          │  ┌─────────────────────────────┐  │
                                          │  │ caddy_proxy Container       │  │
                                          │  │ (Port 80/443, SSL Manager)  │  │
                                          │  └──────────────┬──────────────┘  │
                                          │                 │ 'web_network'   │
                                          │                 ▼ (Bridge)        │
                                          │  ┌─────────────────────────────┐  │
                                          │  │ kuwait-painters-api :5000   │  │
                                          │  │ Loopback: 127.0.0.1:5050    │  │
                                          │  │ Memory Limit: 512MB         │  │
                                          │  │ Non-root user: node         │  │
                                          │  └──────────────┬──────────────┘  │
                                          │                 │ Internal Net    │
                                          │                 ▼                 │
                                          │  ┌─────────────────────────────┐  │
                                          │  │ kuwait-painters-postgres    │  │
                                          │  │ Port 5432 (Internal only)   │  │
                                          │  │ Memory Limit: 384MB         │  │
                                          │  │ Persistent Docker Volume    │  │
                                          │  └─────────────────────────────┘  │
                                          │                                   │
                                          │  --- OTHER UNTOUCHED APPS ---     │
                                          │  - yahduth_app (0.0.0.0:5000)     │
                                          │  - democlean_app (127.0.0.1:3000) │
                                          │  - clashmarket_app (Port 8080)    │
                                          └───────────────────────────────────┘
```

---

## 2. Server Coexistence & Safety Mandates

The host currently runs active services. The following rules are **strictly enforced**:

1. **NO Port Conflicts:**
   - Port `80` & `443`: Reserved by `caddy_proxy`.
   - Port `5000`: Reserved by `yahduth_app` (`0.0.0.0:5000->4321/tcp`).
   - Port `3000`: Reserved by `democlean_app` (`127.0.0.1:3000`).
   - Port `8080`: Reserved by `clashmarket_app`.
   - **Kuwait Painters Host Binding:** Uses `127.0.0.1:5050` exclusively for local loopback probes. Zero ports are bound to `0.0.0.0`.

2. **Reverse Proxy Integration (Caddy):**
   - Kuwait Painters attaches to the pre-existing external Docker network: `web_network`.
   - `caddy_proxy` forwards requests directly to `http://kuwait-painters-api:5000` via Docker's internal DNS.
   - Nginx is NOT run as a host container on this server to avoid any port collision.

3. **Memory & CPU Guardrails (OOM Protection):**
   - Host has 2GB RAM (~1GB free, with active swap).
   - `kuwait-painters-api`: Hard limit `512MB`, reservation `128MB`, Node heap `384MB`.
   - `kuwait-painters-postgres`: Hard limit `384MB`, reservation `128MB`.
   - Total maximum memory impact: `< 900MB`, safely fitting within available memory without triggering OOM.

---

## 3. Step-by-Step Server Deployment Playbook

### Step 3.1: Connect to the Server
From your management terminal using the SSH key:
```bash
ssh -i "C:\Users\Dell\Desktop\n8n-server-key.pem" ec2-user@16.16.208.155
```

---

### Step 3.2: Create Isolated Directory
Create the application directory isolated under `ec2-user`'s home directory:
```bash
mkdir -p ~/kuwait-painters/deploy
```

---

### Step 3.3: Transfer Project Files
From your local Windows machine, transfer the required deployment files and source code using `scp`:

```powershell
# In PowerShell on local machine:
$KEY = "C:\Users\Dell\Desktop\n8n-server-key.pem"
$SERVER = "ec2-user@16.16.208.155"

# Copy root monorepo files:
scp -i $KEY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json .dockerignore ${SERVER}:~/kuwait-painters/

# Copy lib and artifacts:
scp -i $KEY -r lib ${SERVER}:~/kuwait-painters/
scp -i $KEY -r artifacts/api-server ${SERVER}:~/kuwait-painters/artifacts/

# Copy deploy directory:
scp -i $KEY -r deploy ${SERVER}:~/kuwait-painters/
```

---

### Step 3.4: Configure Production Secrets (`deploy/backend.env`)
On the server, generate strong random secrets and create `deploy/backend.env`:

```bash
cd ~/kuwait-painters/deploy

# Generate credentials:
DB_PASS=$(openssl rand -base64 24 | tr -dc 'a-zA-Z0-9')
JWT_SECRET=$(openssl rand -hex 32)

cat <<EOF > backend.env
NODE_ENV=production
PORT=5000
TZ=Asia/Kuwait
LOG_LEVEL=info

POSTGRES_USER=kuwait_admin
POSTGRES_PASSWORD=${DB_PASS}
POSTGRES_DB=kuwait_painters
POSTGRES_PORT=5432

DATABASE_URL=postgresql://kuwait_admin:${DB_PASS}@postgres:5432/kuwait_painters?sslmode=disable
CORS_ORIGIN=https://sabbagh-kuwait.pages.dev,https://kuwaitpainters.com,https://www.kuwaitpainters.com
JWT_SECRET=${JWT_SECRET}
EOF

chmod 600 backend.env
```

---

### Step 3.5: Build and Start Containers
From `~/kuwait-painters/deploy`:

```bash
cd ~/kuwait-painters/deploy
docker compose up -d --build
```

Verify that the containers start and become healthy:
```bash
docker compose ps
```
*Expected Output:*
```
NAME                      IMAGE               STATUS                    PORTS
kuwait-painters-postgres  postgres:16-alpine  Up (healthy)              5432/tcp
kuwait-painters-api       deploy-api-server   Up (healthy)              127.0.0.1:5050->5000/tcp
```

Test the local loopback probe:
```bash
curl -i http://127.0.0.1:5050/api/healthz
# Expected: HTTP/1.1 200 OK {"status":"ok"}
```

Verify existing applications are unaffected:
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}\t{{.Ports}}'
```

---

### Step 3.6: Update Caddyfile Reverse Proxy
Safely backup the existing Caddyfile and append the Kuwait Painters routing block:

```bash
cd ~/reverse-proxy

# 1. Take a timestamped backup
cp Caddyfile Caddyfile.bak.$(date +%Y%m%d_%H%M%S)

# 2. Append Kuwait Painters block
cat <<'EOF' >> Caddyfile

# 4. Kuwait Painters API
api.kuwaitpainters.com {
    encode zstd gzip
    reverse_proxy kuwait-painters-api:5000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
EOF

# 3. Reload Caddy configuration with zero downtime
docker exec -w /etc/caddy caddy_proxy caddy reload
```

---

## 4. Cloudflare Pages Frontend Deployment

### 4.1 Build Configuration
In the **Cloudflare Dashboard** > **Workers & Pages** > **Create application** > **Pages**:
- **Framework Preset:** `Vite`
- **Root Directory:** `/`
- **Build Command:** `pnpm --filter sabbagh-kuwait run build`
- **Build Output Directory:** `artifacts/sabbagh-kuwait/dist/public`

### 4.2 Environment Variables (Pages Dashboard)
Set under **Settings > Environment variables**:
- `NODE_VERSION` = `24`
- `VITE_API_URL` = `https://api.kuwaitpainters.com/api`

---

## 5. Rollback & Emergency Playbook

If any issue arises:
```bash
# 1. Stop Kuwait Painters without touching other apps:
cd ~/kuwait-painters/deploy
docker compose down

# 2. Restore Caddyfile from backup:
cd ~/reverse-proxy
cp Caddyfile.bak.<latest_timestamp> Caddyfile
docker exec -w /etc/caddy caddy_proxy caddy reload

# 3. Verify all live applications:
docker ps
```
