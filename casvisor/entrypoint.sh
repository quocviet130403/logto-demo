#!/bin/sh
# Replace hardcoded frontend config values in the built JS bundle
# before starting the Casvisor server

echo "Patching frontend config..."

# Replace Casdoor endpoint URL
find /home/casvisor/web/build/static/js -name '*.js' -exec sed -i \
  "s|http://casdoor:8000|${CASDOOR_PUBLIC_URL}|g" {} \;

# Replace placeholder client ID
find /home/casvisor/web/build/static/js -name '*.js' -exec sed -i \
  "s|<FILL_AFTER_CASDOOR_SETUP>|${CASVISOR_CLIENT_ID}|g" {} \;

echo "Frontend config patched:"
echo "  CASDOOR_PUBLIC_URL=${CASDOOR_PUBLIC_URL}"
echo "  CASVISOR_CLIENT_ID=${CASVISOR_CLIENT_ID}"

# Start the server
exec /home/casvisor/server --createDatabase=true
