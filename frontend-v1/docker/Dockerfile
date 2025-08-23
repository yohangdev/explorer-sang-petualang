# ---- Builder (Bun) ----
FROM oven/bun:1 AS build
WORKDIR /app

# Accept API_BASE_URL as build argument
ARG API_BASE_URL=http://localhost:8080
ENV API_BASE_URL=$API_BASE_URL

COPY bun.lock package.json ./
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

# Set your backend origin here (container name or URL)
# Example: docker network service "backend" exposing port 3000
ENV API_ORIGIN=http://backend:3000

# Replace the default site with SPA + /api proxy
COPY <<'NGINXCONF' /etc/nginx/conf.d/default.conf
map $http_upgrade $connection_upgrade {
  default upgrade;
  ''      close;
}

server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  # --------- Static SPA ----------
  location / {
    try_files $uri $uri/ /index.html;
  }

  # --------- /api reverse proxy ----------
  location /api/ {
    proxy_http_version 1.1;
    proxy_pass http://backend:3000;   # overwritten below by envsubst at start

    # Forward client info to backend
    proxy_set_header Host              $host;
    proxy_set_header X-Real-IP         $remote_addr;
    proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;

    # WebSocket / HTTP Upgrade
    proxy_set_header Upgrade           $http_upgrade;
    proxy_set_header Connection        $connection_upgrade;

    # Reasonable timeouts for APIs/WS
    proxy_read_timeout  300;
    proxy_send_timeout  300;

    # Optional: disable buffering for streaming APIs
    # proxy_buffering off;
  }
}
NGINXCONF

# Replace proxy_pass target with $API_ORIGIN at container start
# (nginx doesn't read envs in config by default; envsubst injects it)
RUN apk add --no-cache bash && \
    printf '%s\n' '#!/bin/sh' \
      'envsubst '\''$API_ORIGIN'\'' < /etc/nginx/conf.d/default.conf > /etc/nginx/conf.d/default.conf.tmp' \
      'sed -i "s|http://backend:3000|$API_ORIGIN|g" /etc/nginx/conf.d/default.conf.tmp' \
      'mv /etc/nginx/conf.d/default.conf.tmp /etc/nginx/conf.d/default.conf' \
      'exec nginx -g "daemon off;"' > /docker-entrypoint.sh && \
    chmod +x /docker-entrypoint.sh

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
