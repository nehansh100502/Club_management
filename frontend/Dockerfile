# Stage 1: Build React SPA
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency definition
COPY package.json package-lock.json ./

# Install packages
RUN npm ci

# Copy frontend source code
COPY . .

# Build application for production
ENV VITE_API_URL=""
RUN npm run build

# Stage 2: Serve using Nginx
FROM nginx:alpine

# Remove default configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build artifacts to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
