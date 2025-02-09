FROM node:18-alpine

WORKDIR /usr/src/app

# Install NestJS CLI globally
RUN npm install -g @nestjs/cli

# Copy root package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm install
RUN cd packages/backend && npm install

# Copy backend source code
COPY packages/backend ./packages/backend

# Build TypeScript code
WORKDIR /usr/src/app/packages/backend
RUN npm run build

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]
