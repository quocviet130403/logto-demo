#!/bin/bash

# =============================================================================
# init-letsencrypt.sh
# Khởi tạo SSL certificates cho lần đầu deploy
#
# Usage:
#   1. Đảm bảo DNS đã trỏ về server
#   2. Sửa .env với domain và email thật
#   3. chmod +x init-letsencrypt.sh
#   4. sudo ./init-letsencrypt.sh
# =============================================================================

set -e

# Load environment variables from .env
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$DOMAIN" ]; then
  echo "❌ Error: DOMAIN is not set in .env"
  exit 1
fi

if [ -z "$ACME_EMAIL" ] || [ "$ACME_EMAIL" = "your-email@example.com" ]; then
  echo "❌ Error: Please set a real ACME_EMAIL in .env"
  exit 1
fi

domains=("$DOMAIN" "$DOMAIN_AUTH" "$DOMAIN_ADMIN" "$DOMAIN_MAIL")
rsa_key_size=4096
data_path="./certbot"
staging=0 # Set to 1 to test against Let's Encrypt staging (no rate limits)

echo "=== Init Let's Encrypt ==="
echo "Domain: $DOMAIN"
echo "Auth: $DOMAIN_AUTH"
echo "Admin: $DOMAIN_ADMIN"
echo "Mail: $DOMAIN_MAIL"
echo "Email: $ACME_EMAIL"
echo ""

# Step 1: Create required directories
echo ">>> Creating directories..."
mkdir -p "$data_path/conf/live/$DOMAIN"
mkdir -p "$data_path/www"

# Step 2: Download recommended TLS parameters
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo ">>> Downloading recommended TLS parameters..."
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
fi

# Step 3: Create dummy certificate (so Nginx can start)
echo ">>> Creating dummy certificate for $DOMAIN..."
openssl req -x509 -nodes -newkey rsa:2048 -days 1 \
  -keyout "$data_path/conf/live/$DOMAIN/privkey.pem" \
  -out "$data_path/conf/live/$DOMAIN/fullchain.pem" \
  -subj "/CN=localhost" 2>/dev/null

# Step 4: Start Nginx with dummy cert
echo ">>> Starting Nginx..."
docker compose up -d nginx
sleep 5

# Step 5: Remove dummy certificate
echo ">>> Deleting dummy certificate..."
rm -rf "$data_path/conf/live/$DOMAIN"

# Step 6: Request real certificate from Let's Encrypt
echo ">>> Requesting Let's Encrypt certificate..."

# Build domain args
domain_args=""
for d in "${domains[@]}"; do
  domain_args="$domain_args -d $d"
done

# Staging or production?
if [ $staging != "0" ]; then
  staging_arg="--staging"
else
  staging_arg=""
fi

docker compose run --rm certbot certonly \
  --webroot \
  -w /var/www/certbot \
  $domain_args \
  --email $ACME_EMAIL \
  --rsa-key-size $rsa_key_size \
  --agree-tos \
  --no-eff-email \
  --force-renewal \
  $staging_arg

# Step 7: Reload Nginx with real certificate
echo ">>> Reloading Nginx..."
docker compose exec nginx nginx -s reload

echo ""
echo "✅ SSL certificates successfully obtained!"
echo "   Domains: ${domains[*]}"
echo ""
echo ">>> Now start all services:"
echo "   docker compose up -d"
