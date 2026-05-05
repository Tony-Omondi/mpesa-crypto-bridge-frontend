# ─── Stage 1: Builder ────────────────────────────────────────────────────────
# Installs all dependencies inside the container
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer cache — only re-installs if these change)
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# ─── Stage 2: Dev Server ─────────────────────────────────────────────────────
FROM node:20-alpine AS dev

WORKDIR /app

# Install expo-cli globally so `expo start` works
RUN npm install -g expo-cli eas-cli

# Copy node_modules from builder stage (avoids reinstalling)
COPY --from=builder /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Metro bundler port
EXPOSE 8081

# Expo dev tools port
EXPOSE 19000

# Expo go port
EXPOSE 19001

# Start Metro bundler
# --host 0.0.0.0 makes it accessible from outside the container (your phone)
CMD ["npx", "expo", "start", "--host", "tunnel"]