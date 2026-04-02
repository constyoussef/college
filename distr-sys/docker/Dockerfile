# ─── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for better Docker layer caching
COPY package.json package-lock.json* ./

# Install ALL dependencies (including devDependencies for TypeScript)
RUN npm install

# Copy TypeScript config and source
COPY tsconfig.json ./
COPY src/ ./src/

# Compile TypeScript → JavaScript
RUN npm run build

# ─── Runtime stage ────────────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production-only deps
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy compiled JavaScript from builder
COPY --from=builder /app/dist ./dist

# The app listens on port 3000
EXPOSE 3000

# Environment variables are set in docker-compose.yml:
#   NODE_ID   — Unique integer ID for this node (1-5)
#   NODE_LIST — Comma-separated list of all node addresses
#   PORT      — HTTP port (default 3000)

CMD ["node", "dist/index.js"]
