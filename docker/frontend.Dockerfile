ok # ============================================================
# INKA Frontend — Multi-Stage Dockerfile
# ============================================================
# STAGE 1: BUILD
#   Node.js compiles the React app into static HTML/JS/CSS files.
#   This stage is large (~500MB) and is never shipped.
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first — Docker caches this layer
# so npm install only re-runs when package.json changes
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --silent

# Copy source code and build the production bundle
COPY frontend/public/ public/
COPY frontend/src/ src/

# CI=false prevents treating ESLint warnings as errors during build
ENV CI=false
RUN npm run build

# ============================================================
# STAGE 2: RUNTIME
#   Tiny Nginx image serves the static files.
#   Final image is only ~25MB (vs ~500MB Node image).
# ============================================================
FROM nginx:alpine AS runtime

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy our custom Nginx config (handles React Router + API proxy)
COPY --from=builder /app/build /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1/health || exit 1
