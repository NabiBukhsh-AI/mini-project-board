# =============================================================
# Backend Dockerfile
# Multi-stage build: install deps in builder, copy to lean image
# =============================================================

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
RUN npx prisma generate

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/prisma ./prisma
COPY package.json ./

EXPOSE 4000
CMD ["node", "src/server.js"]
