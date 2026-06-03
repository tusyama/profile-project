# Build from repository root: docker build -f server/Dockerfile .
FROM node:22-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci

COPY server ./server
RUN npm run build -w server

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

COPY package.json package-lock.json ./
COPY server/package.json ./server/
RUN npm ci --omit=dev --ignore-scripts

COPY --from=builder /app/server/dist ./server/dist

WORKDIR /app/server
EXPOSE 3001
CMD ["node", "dist/index.js"]
