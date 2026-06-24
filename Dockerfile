# Stage 1: Build stage
FROM node:18 AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY . .

# Build with legacy OpenSSL provider for Node.js 17+
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm build

# Stage 2: Production stage with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY docker/nginx.conf /etc/nginx/conf.d/

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 5910
EXPOSE 5910

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
