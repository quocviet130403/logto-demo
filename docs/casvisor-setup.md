# Casvisor + Casdoor Setup Guide

Hướng dẫn cấu hình **Casdoor** (IAM) và **Casvisor** (bastion/audit platform) tích hợp với **Logto** (upstream IdP).

## Kiến trúc

```
User → Casvisor → Casdoor → Logto (upstream IdP)
         :19000     :8000     :3001
```

- **Casvisor** dùng Casdoor để xác thực user
- **Casdoor** được cấu hình Logto làm custom OIDC provider
- **User** thực tế login qua Logto UI

## Prerequisites

1. Stack đã chạy: `docker compose up -d`
2. DNS đã trỏ:
   ```
   logto-demo-casdoor.minproxy.io  → SERVER_IP
   logto-demo-casvisor.minproxy.io → SERVER_IP
   ```
3. SSL cert đã có (chạy lại `init-letsencrypt.sh` nếu thêm domain mới)

---

## Bước 1: Khởi động Services

```bash
docker compose up -d casdoor-mysql casdoor casvisor
```

Kiểm tra logs:
```bash
docker compose logs -f casdoor casvisor
```

Đợi đến khi thấy Casdoor khởi động thành công (khoảng 30s).

---

## Bước 2: Cấu hình Casdoor

### 2.1 Đăng nhập Casdoor Admin

1. Truy cập: `https://logto-demo-casdoor.minproxy.io`
2. Login mặc định: **`admin`** / **`123`**
3. **⚠️ Đổi password ngay** sau khi login

### 2.2 Tạo Application cho Casvisor

1. Vào **Applications** → **Add**
2. Điền:
   - **Name**: `app-casvisor`
   - **Organization**: `built-in`
   - **Redirect URLs**: `https://logto-demo-casvisor.minproxy.io/callback`
3. Save → ghi nhớ **Client ID** và **Client Secret**

### 2.3 Cập nhật Casvisor Config

Sửa file `casvisor/conf/app.conf`:

```ini
clientId = <CLIENT_ID_TỪ_BƯỚC_2.2>
clientSecret = <CLIENT_SECRET_TỪ_BƯỚC_2.2>
```

Restart Casvisor:
```bash
docker compose restart casvisor
```

### 2.4 Test Casvisor Login

1. Truy cập `https://logto-demo-casvisor.minproxy.io`
2. Nó sẽ redirect sang Casdoor login
3. Đăng nhập bằng tài khoản Casdoor → vào được Casvisor dashboard

---

## Bước 3: Thêm Logto làm Upstream IdP trong Casdoor

Sau bước này, user sẽ thấy nút **"Login with Logto"** trên trang Casdoor login.

### 3.1 Tạo Application trong Logto

1. Truy cập **Logto Admin Console**: `https://logto-demo-admin.minproxy.io`
2. Vào **Applications** → **Create Application**
3. Chọn **Third-party app** → **Traditional Web**
4. Điền:
   - **Name**: `Casdoor`
   - **Redirect URI**: `https://logto-demo-casdoor.minproxy.io/callback`
5. Save → ghi nhớ **Client ID** và **Client Secret**

### 3.2 Tạo Custom OIDC Provider trong Casdoor

1. Đăng nhập **Casdoor Admin**: `https://logto-demo-casdoor.minproxy.io`
2. Vào **Providers** → **Add**
3. Cấu hình:

   | Field | Giá trị |
   |-------|---------|
   | **Name** | `provider-logto` |
   | **Category** | `OAuth` |
   | **Type** | `Custom` |
   | **Client ID** | Client ID từ Logto (bước 3.1) |
   | **Client Secret** | Client Secret từ Logto (bước 3.1) |
   | **Auth URL** | `https://logto-demo-auth.minproxy.io/oidc/auth` |
   | **Token URL** | `https://logto-demo-auth.minproxy.io/oidc/token` |
   | **UserInfo URL** | `https://logto-demo-auth.minproxy.io/oidc/me` |
   | **Scopes** | `openid profile email` |

4. **User Mapping** (nếu có):
   - `sub` → ID
   - `email` → Email  
   - `name` → Display Name

5. Click **Save**

### 3.3 Gắn Provider vào Application

1. Vào **Applications** → chọn **app-built-in** (hoặc app mà Casvisor dùng)
2. Trong phần **Providers** → thêm `provider-logto`
3. Bật cho **Login** và **Signup**
4. **Save**

### 3.4 Test Login qua Logto

1. Mở tab ẩn danh, truy cập `https://logto-demo-casvisor.minproxy.io`
2. Redirect sang trang login Casdoor
3. Bạn sẽ thấy nút **"Login with Logto"** (hoặc tên bạn đặt)
4. Click → redirect sang Logto login → nhập email/password
5. Login thành công → redirect về Casvisor dashboard ✅

---

## Bước 4 (Optional): Ẩn Casdoor Login, chỉ dùng Logto

Nếu muốn user **chỉ thấy Logto login** (không hiện form Casdoor):

1. Vào **Casdoor Admin** → **Applications** → chọn app
2. Tắt tất cả Sign Up/Sign In methods ngoại trừ Logto provider
3. Bật option **Auto Sign-in** cho Logto provider (nếu có)

Kết quả: User vào Casvisor → redirect Casdoor → auto redirect Logto → login → quay về Casvisor.

---

## Service URLs

| Service | URL |
|---------|-----|
| Casdoor Admin | `https://logto-demo-casdoor.minproxy.io` |
| Casvisor UI | `https://logto-demo-casvisor.minproxy.io` |
| Logto Auth | `https://logto-demo-auth.minproxy.io` |
| Logto Admin | `https://logto-demo-admin.minproxy.io` |

## Troubleshooting

### Casdoor không khởi động
```bash
docker compose logs casdoor
```
Thường do MySQL chưa sẵn sàng. Service đã có healthcheck, sẽ tự đợi.

### Casvisor báo "unauthorized"
- Kiểm tra `clientId` và `clientSecret` trong `casvisor/conf/app.conf` đã đúng chưa
- Kiểm tra `casdoorEndpoint` trỏ đúng `http://casdoor:8000`

### Login qua Logto bị lỗi redirect
- Kiểm tra **Redirect URI** trong Logto app phải là: `https://logto-demo-casdoor.minproxy.io/callback`
- Kiểm tra Auth URL, Token URL, UserInfo URL trong Casdoor provider config
