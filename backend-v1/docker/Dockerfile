FROM oven/bun:1 AS base
WORKDIR /app

COPY bun.lock package.json ./
COPY tsconfig.json ./
RUN bun install --frozen-lockfile
COPY . .


FROM base AS build-binary
RUN bun build \
  --compile \
  --minify-whitespace \
  --minify-syntax \
  --target bun \
  --outfile server \
  ./src/index.ts


FROM gcr.io/distroless/base-debian12 AS binary
WORKDIR /app
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

COPY --from=build-binary /app/server /usr/local/bin/server

EXPOSE 8080
USER 65532:65532

ENTRYPOINT ["/usr/local/bin/server"]
