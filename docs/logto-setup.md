# Cấu hình Logto Admin Console

Hướng dẫn chi tiết cấu hình Logto sau khi `docker compose up` thành công.

## 1. Tạo Admin Account

1. Truy cập **https://admin.DOMAIN** (thay `DOMAIN` bằng domain thật của bạn)
2. Lần đầu tiên, Logto sẽ yêu cầu tạo admin account
3. Nhập email và password → Create account

## 2. Tạo Application

1. Vào **Applications** → **Create application**
2. Chọn type: **Traditional web**
3. Đặt tên: `Logto Demo Frontend`
4. Sau khi tạo, vào tab **Settings**:
   - Copy **App ID** và **App Secret**
   - **Redirect URIs**: thêm `https://DOMAIN/callback`
   - **Post sign-out redirect URIs**: thêm `https://DOMAIN`
   - **CORS allowed origins**: thêm `https://DOMAIN`
5. Click **Save changes**

> ⚠️ Paste **App ID** và **App Secret** vào file `.env` ở thư mục gốc

## 3. Tạo API Resource

1. Vào **API resources** → **Create API resource**
2. Đặt tên: `Logto Demo Backend`
3. API identifier: `https://DOMAIN/api`
4. Click **Create**

> ⚠️ API identifier này phải khớp với `LOGTO_API_RESOURCE` trong `.env`

## 4. Cấu hình Email Connector (SMTP → Mailpit)

1. Vào **Connectors** → **Email and SMS connectors**
2. Click **Set up** trên Email connector
3. Chọn **SMTP**
4. Paste config JSON sau:

```json
{
  "host": "mailpit",
  "port": 1025,
  "security": "None",
  "fromEmail": "noreply@logto-demo.local",
  "replyTo": "noreply@logto-demo.local",
  "templates": [
    {
      "usageType": "Register",
      "subject": "Your verification code",
      "content": "<h1>Welcome to Logto Demo!</h1><p>Your verification code is: <strong>{{code}}</strong></p><p>This code expires in 10 minutes.</p>",
      "contentType": "text/html"
    },
    {
      "usageType": "SignIn",
      "subject": "Your sign-in verification code",
      "content": "<h1>Sign-in Verification</h1><p>Your verification code is: <strong>{{code}}</strong></p><p>This code expires in 10 minutes.</p>",
      "contentType": "text/html"
    },
    {
      "usageType": "ForgotPassword",
      "subject": "Reset your password",
      "content": "<h1>Password Reset</h1><p>Your verification code is: <strong>{{code}}</strong></p><p>This code expires in 10 minutes.</p>",
      "contentType": "text/html"
    },
    {
      "usageType": "Generic",
      "subject": "Your verification code",
      "content": "<h1>Verification</h1><p>Your verification code is: <strong>{{code}}</strong></p><p>This code expires in 10 minutes.</p>",
      "contentType": "text/html"
    }
  ]
}
```

5. Click **Test** → nhập email bất kỳ → Send
6. Mở **https://mail.DOMAIN** (Mailpit) → confirm nhận được email
7. Click **Save and done**

> **Lưu ý quan trọng**: Host phải là `mailpit` (tên Docker container), KHÔNG phải `localhost`. Vì Logto container cần kết nối tới Mailpit container qua Docker network.

## 5. Cấu hình Sign-in Experience

1. Vào **Sign-in experience** → tab **Sign-up and sign-in**
2. **Sign-up settings**:
   - Identifiers: chọn **Email address**
   - ✅ Bật **Verify at sign-up**
   - ✅ Bật **Create your password**
3. **Sign-in settings**:
   - Chọn identifier: **Email address**
   - ✅ Bật **Verification code** (bên cạnh Password)
4. Click **Save changes**

## 6. Test Complete Flow

1. Mở https://DOMAIN
2. Click **Sign In / Sign Up**
3. Click **Create account** (nếu chưa có tài khoản)
4. Nhập email → verification code sẽ được gửi
5. Mở https://mail.DOMAIN → copy code
6. Nhập code vào form → đặt password
7. Hoàn tất → redirect về app

## Tham khảo

- [Logto Docs](https://docs.logto.io/)
- [Logto Next.js SDK](https://docs.logto.io/quick-starts/next-app-router)
- [SMTP Connector](https://docs.logto.io/integrations/email/smtp)
