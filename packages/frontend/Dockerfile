# Build stage
FROM node:20-slim as builder

WORKDIR /usr/src/app

# Copy root package.json and workspace files
COPY package*.json ./
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm install

# Copy frontend source code
COPY packages/frontend/ ./packages/frontend/

# Set working directory to frontend package
WORKDIR /usr/src/app/packages/frontend

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy nginx configuration
COPY packages/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /usr/src/app/packages/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
