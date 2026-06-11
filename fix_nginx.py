import re

with open('nginx/conf.d/default.conf.template', 'r') as f:
    content = f.read()

# Replace proxy_pass http://backend:4000/api/;
content = content.replace(
    'proxy_pass http://backend:4000/api/;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_backend http://backend:4000;\n        proxy_pass $upstream_backend/api/;'
)

# Replace proxy_pass http://frontend:3000;
content = content.replace(
    'proxy_pass http://frontend:3000;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_frontend http://frontend:3000;\n        proxy_pass $upstream_frontend;'
)

# Replace proxy_pass http://logto:3001;
content = content.replace(
    'proxy_pass http://logto:3001;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_logto http://logto:3001;\n        proxy_pass $upstream_logto;'
)

# Replace proxy_pass http://logto:3002;
content = content.replace(
    'proxy_pass http://logto:3002;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_logto_admin http://logto:3002;\n        proxy_pass $upstream_logto_admin;'
)

# Replace proxy_pass http://mailpit:8025;
content = content.replace(
    'proxy_pass http://mailpit:8025;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_mailpit http://mailpit:8025;\n        proxy_pass $upstream_mailpit;'
)

# Replace proxy_pass http://semaphore:3000/api/ws;
content = content.replace(
    'proxy_pass http://semaphore:3000/api/ws;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_sem_ws http://semaphore:3000;\n        proxy_pass $upstream_sem_ws/api/ws;'
)

# Replace proxy_pass http://semaphore:3000;
content = content.replace(
    'proxy_pass http://semaphore:3000;',
    'resolver 127.0.0.11 valid=30s ipv6=off;\n        set $upstream_sem http://semaphore:3000;\n        proxy_pass $upstream_sem;'
)

with open('nginx/conf.d/default.conf.template', 'w') as f:
    f.write(content)

