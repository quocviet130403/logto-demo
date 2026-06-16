# Logto Demo — Next.js + NestJS + Docker

Full-stack authentication demo sử dụng **Logto OSS** với email verification.

## Tech Stack

| Layer          | Technology    | Mô tả |
|----------------|---------------|-------|
| Auth Provider  | Logto OSS     | `auth.DOMAIN` |
| Frontend       | Next.js 15    | `DOMAIN` |
| Backend        | NestJS 11     | `DOMAIN/api` |
| Database       | PostgreSQL 17 | Internal |
| Email (Dev)    | Mailpit       | `mail.DOMAIN` |
| Reverse Proxy  | Nginx         | SSL termination, port 80/443 |
| SSL            | Let's Encrypt | Auto-renew via Certbot |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (đã cài và đang chạy)
- Một tên miền đã trỏ DNS về server IP
- (Optional) [Node.js](https://nodejs.org/) ≥ 18 cho local development

## Quick Start

### 1. Cấu hình Domain & SSL

#### a. Trỏ DNS

Trỏ A record cho domain và subdomain về IP server:

```
logto-demo.minproxy.io          → YOUR_SERVER_IP
logto-demo-auth.minproxy.io     → YOUR_SERVER_IP
logto-demo-admin.minproxy.io    → YOUR_SERVER_IP
logto-demo-mail.minproxy.io     → YOUR_SERVER_IP
logto-demo-casdoor.minproxy.io  → YOUR_SERVER_IP
logto-demo-casvisor.minproxy.io → YOUR_SERVER_IP
```

#### b. Cập nhật `.env`

Sửa file `.env` ở thư mục gốc:

```bash
# Domain đã được cấu hình sẵn trong .env
# Chỉ cần thay ACME_EMAIL
ACME_EMAIL=your-email@example.com
```

> ⚠️ Tất cả URL khác trong `.env` sẽ tự động sử dụng giá trị `DOMAIN`. Bạn chỉ cần thay đổi 1 nơi.

#### c. Khởi tạo SSL (lần đầu)

```bash
chmod +x init-letsencrypt.sh
sudo ./init-letsencrypt.sh
```

Script sẽ tự động:
1. Tạo self-signed cert tạm
2. Start Nginx
3. Lấy cert thật từ Let's Encrypt
4. Reload Nginx

### 2. Khởi chạy toàn bộ stack

```bash
docker compose up -d --build
```

Kiểm tra:
- Frontend: https://DOMAIN
- Backend Health: https://DOMAIN/api/health
- Logto Admin: https://admin.DOMAIN
- Mailpit: https://mail.DOMAIN

### 3. Cấu hình Logto (1 lần)

Xem hướng dẫn chi tiết tại [docs/logto-setup.md](docs/logto-setup.md).

**Tóm tắt:**
1. Truy cập https://admin.DOMAIN → tạo admin account
2. Tạo Application (Traditional Web) → lấy **App ID** & **App Secret**
3. Tạo API Resource: `https://DOMAIN/api`
4. Cấu hình Email Connector (SMTP → Mailpit)
5. Cấu hình Sign-in Experience: Email + Verify + Password

### 4. Cập nhật Environment Variables

Paste App ID & App Secret vào file `.env`:

```bash
LOGTO_APP_ID=<your-app-id>
LOGTO_APP_SECRET=<your-app-secret>
```

Sau đó restart frontend:

```bash
docker compose up -d --build frontend
```

### 5. Test Auth Flow

1. Click **Sign In / Sign Up** trên frontend
2. Chọn **Create account** → nhập email
3. Mở https://mail.DOMAIN (Mailpit) → xem verification code
4. Nhập code → đặt password → hoàn tất đăng ký
5. Thử trang **Protected API** → xem kết quả từ NestJS backend

## Thay đổi Domain

Để đổi sang domain khác, chỉ cần:

1. Sửa `DOMAIN=new-domain.com` trong `.env`
2. Trỏ DNS cho domain mới
3. Chạy lại `init-letsencrypt.sh` để lấy cert mới
4. `docker compose up -d --build`
5. Cập nhật Redirect URIs trong Logto Admin Console

## Project Structure

```
logto-demo/
├── docker-compose.yml       # All services + Nginx + Certbot
├── .env                     # Domain & credentials (thay đổi ở đây)
├── init-letsencrypt.sh      # SSL initialization script
├── nginx/
│   ├── nginx.conf           # Nginx main config
│   ├── ssl-common.conf      # Shared SSL settings
│   └── conf.d/
│       └── default.conf.template  # Server blocks (envsubst)
├── certbot/                 # SSL certificates (auto-generated)
├── frontend/                # Next.js App Router
│   ├── src/
│   │   ├── app/             # Pages (home, callback, protected)
│   │   ├── components/      # SignInButton, SignOutButton, UserProfile
│   │   └── lib/logto.ts     # Logto server actions
│   └── Dockerfile
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/            # JWT guard + JWKS validation
│   │   └── user/            # Protected user endpoints
│   └── Dockerfile
├── casdoor/                 # Casdoor IAM
│   └── conf/app.conf        # Casdoor configuration
├── casvisor/                # Casvisor Bastion/Audit
│   └── conf/app.conf        # Casvisor configuration
└── docs/
    ├── logto-setup.md       # Chi tiết cấu hình Logto Console
    └── casvisor-setup.md    # Hướng dẫn setup Casvisor + Casdoor
```

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | https://DOMAIN |
| Backend API | https://DOMAIN/api |
| Backend Health | https://DOMAIN/api/health |
| Logto Auth | https://auth.DOMAIN |
| Logto Admin Console | https://admin.DOMAIN |
| Mailpit (xem email) | https://mail.DOMAIN |
| Casdoor Admin | https://casdoor.DOMAIN |
| Casvisor UI | https://casvisor.DOMAIN |

## SSL Certificate Renewal

Certbot container tự động renew certificates mỗi 12 giờ. Không cần thao tác thủ công.

Kiểm tra trạng thái cert:
```bash
docker compose exec certbot certbot certificates
```

## Troubleshooting

### Nginx báo lỗi SSL
```bash
docker compose logs nginx
```
Thường do cert chưa được tạo. Chạy `init-letsencrypt.sh` trước.

### Logto không khởi động
```bash
docker compose logs logto
```
Thường do database chưa sẵn sàng. Thử `docker compose restart logto`.

### Email không gửi được
- Kiểm tra SMTP connector config trong Logto Admin Console
- Host phải là `mailpit` (tên container), port `1025`
- Kiểm tra Mailpit logs: `docker compose logs mailpit`

### Frontend báo lỗi "appId is required"
- Chưa cập nhật `.env` với App ID & Secret từ Logto Console

### Let's Encrypt rate limit
- Nếu bị rate limit, set `staging=1` trong `init-letsencrypt.sh` để test
- Production rate limit: 50 certs/domain/tuần
