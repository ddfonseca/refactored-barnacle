FROM node:18-alpine

WORKDIR /usr/src/app

# Copy root package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm install

# Copy backend source code
COPY packages/backend ./packages/backend

# Build TypeScript code
RUN cd packages/backend && npm run build

WORKDIR /usr/src/app/packages/backend

EXPOSE 3000

# Start the application
CMD ["npm", "start"]
