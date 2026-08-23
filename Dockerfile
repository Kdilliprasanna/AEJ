# ========================================================
# CAREER AI (ARJ) — PRODUCTION DOCKERFILE
# ========================================================

# Stage 1: Build Frontend & Install Dependencies
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build Vite Frontend Client
RUN npm run build

# Stage 2: Production Execution Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Copy package files & install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built frontend asset dist directory & backend application source
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/supabase ./supabase

# Expose backend port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/health || exit 1

# Start the application server
CMD ["node", "server/index.js"]
