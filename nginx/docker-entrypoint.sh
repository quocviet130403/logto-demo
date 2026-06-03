#!/bin/sh
set -e

CERT_DIR="/etc/letsencrypt/live/${DOMAIN}"
CERT_FILE="${CERT_DIR}/fullchain.pem"
KEY_FILE="${CERT_DIR}/privkey.pem"

# If real certs don't exist yet, create self-signed ones so Nginx can start
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
  echo ">>> SSL certificates not found. Creating self-signed certificate for initial startup..."
  mkdir -p "$CERT_DIR"
  openssl req -x509 -nodes -newkey rsa:2048 -days 365 \
    -keyout "$KEY_FILE" \
    -out "$CERT_FILE" \
    -subj "/CN=${DOMAIN}" 2>/dev/null
  echo ">>> Self-signed certificate created. Run init-letsencrypt.sh to get a real certificate."
fi

# Run the default nginx entrypoint
exec /docker-entrypoint.sh "$@"
