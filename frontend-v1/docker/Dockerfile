# ---- Builder (Bun) ----
FROM oven/bun:1-alpine AS build
WORKDIR /app

COPY package.json ./
COPY bun.lockb* package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN bun install --frozen-lockfile

COPY . .
ENV NUXT_TELEMETRY_DISABLED=1

# Build: Nuxt (generate) -> .output/public ; else Vite -> dist
RUN if [ -f nuxt.config.ts ] || [ -f nuxt.config.js ]; then \
      bunx nuxt generate && mkdir -p /out && cp -a .output/public/. /out/ ; \
    else \
      (bun run build || bunx vite build) && mkdir -p /out && cp -a dist/. /out/ ; \
    fi

# ---- Runtime (NGINX + /api proxy) ----
FROM nginx:1.27-alpine AS runtime
WORKDIR /usr/share/nginx/html

# Put your built files exactly where NGINX serves from
COPY --from=build /out/ ./

ENV API_ORIGIN=http://backend:3000

# Replace the default site with SPA + /api proxy
COPY <<'NGINXCONF' /etc/nginx/conf.d/default.conf
map $http_upgrade $connection_upgrade { default upgrade; '' close; }

server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri $uri/ /index.html;
  }

  location /api/ {
    proxy_http_version 1.1;
    proxy_pass http://backend:3000;  # replaced at runtime if using API_ORIGIN
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;
    proxy_read_timeout 300;
    proxy_send_timeout 300;
  }
}
NGINXCONF

# Optional: env override for proxy target
ENV API_ORIGIN=http://backend:3000
RUN apk add --no-cache bash gettext && \
  printf '%s\n' '#!/bin/sh' \
  'envsubst '\''$API_ORIGIN'\'' < /etc/nginx/conf.d/default.conf > /tmp/nginx.conf && mv /tmp/nginx.conf /etc/nginx/conf.d/default.conf' \
  'exec nginx -g "daemon off;"' > /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
