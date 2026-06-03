# Logto Demo — Next.js + NestJS + Docker

Full-stack authentication demo sử dụng **Logto OSS** với email verification.

## Tech Stack

| Layer          | Technology    | Port |
|----------------|---------------|------|
| Auth Provider  | Logto OSS     | 3001/3002 |
| Frontend       | Next.js 15    | 3000 |
| Backend        | NestJS 11     | 4000 |
| Database       | PostgreSQL 17 | 5432 |
| Email (Dev)    | Mailpit       | 1025/8025 |

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (đã cài và đang chạy)
- [Node.js](https://nodejs.org/) ≥ 18
- npm

## Quick Start

### 1. Khởi chạy Infrastructure (Docker)

```bash
docker compose up -d postgres logto mailpit
```

Đợi khoảng 30s để Logto seed database. Kiểm tra:
- Logto Admin Console: http://localhost:3002
- Mailpit Web UI: http://localhost:8025

### 2. Cấu hình Logto (1 lần)

Xem hướng dẫn chi tiết tại [docs/logto-setup.md](docs/logto-setup.md).

**Tóm tắt:**
1. Truy cập http://localhost:3002 → tạo admin account
2. Tạo Application (Traditional Web) → lấy **App ID** & **App Secret**
3. Tạo API Resource: `http://localhost:4000/api`
4. Cấu hình Email Connector (SMTP → Mailpit)
5. Cấu hình Sign-in Experience: Email + Verify + Password

### 3. Cập nhật Environment Variables

Paste App ID & App Secret vào file `.env` ở thư mục gốc:

```bash
LOGTO_APP_ID=<your-app-id>
LOGTO_APP_SECRET=<your-app-secret>
```

### 4. Khởi chạy toàn bộ stack

```bash
docker compose up -d --build
```

Kiểm tra:
- Frontend: http://localhost:3000
- Backend Health: http://localhost:4000/api/health

### 5. Test Auth Flow

1. Click **Sign In / Sign Up** trên frontend
2. Chọn **Create account** → nhập email
3. Mở http://localhost:8025 (Mailpit) → xem verification code
4. Nhập code → đặt password → hoàn tất đăng ký
5. Thử trang **Protected API** → xem kết quả từ NestJS backend

## Project Structure

```
logto-demo/
├── docker-compose.yml       # PostgreSQL + Logto + Mailpit
├── frontend/                # Next.js App Router
│   ├── src/
│   │   ├── app/             # Pages (home, callback, protected)
│   │   ├── components/      # SignInButton, SignOutButton, UserProfile
│   │   └── lib/logto.ts     # Logto server actions
│   └── .env.local           # Logto credentials
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/            # JWT guard + JWKS validation
│   │   └── user/            # Protected user endpoints
│   └── .env                 # Backend config
└── docs/
    └── logto-setup.md       # Chi tiết cấu hình Logto Console
```

## Useful Links

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend Health | http://localhost:4000/api/health |
| Logto Admin Console | http://localhost:3002 |
| Mailpit (xem email) | http://localhost:8025 |
| Logto User Endpoint | http://localhost:3001 |

## Troubleshooting

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
- Chưa cập nhật `frontend/.env.local` với App ID & Secret từ Logto Console
