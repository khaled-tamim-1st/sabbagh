# ==============================================================================
# Kuwait Painters Platform - Production API Server Dockerfile
# Base: Node 24 Alpine
# Context: Expected to build from repository root (or via docker-compose)
# ==============================================================================

FROM node:24-alpine AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat python3 make g++ git
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json tsconfig.json ./
COPY lib/ ./lib/
COPY artifacts/api-server/ ./artifacts/api-server/

RUN pnpm install --frozen-lockfile || pnpm install
RUN pnpm --filter @workspace/api-server run build
RUN pnpm --filter @workspace/api-server --legacy --prod deploy /app/prod-deploy

FROM node:24-alpine AS runner

RUN apk add --no-cache curl tzdata \
    && cp /usr/share/zoneinfo/Asia/Kuwait /etc/localtime \
    && echo "Asia/Kuwait" > /etc/timezone

WORKDIR /app

ENV NODE_ENV=production \
    PORT=5000 \
    TZ=Asia/Kuwait \
    NODE_OPTIONS="--max-old-space-size=384"

RUN chown -R node:node /app

COPY --chown=node:node --from=builder /app/prod-deploy/node_modules /app/node_modules
COPY --chown=node:node --from=builder /app/artifacts/api-server/dist /app/dist
COPY --chown=node:node --from=builder /app/artifacts/api-server/package.json /app/package.json

USER node

EXPOSE 5000

HEALTHCHECK --interval=20s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://127.0.0.1:5000/api/healthz || exit 1

CMD ["node", "--enable-source-maps", "dist/index.mjs"]
