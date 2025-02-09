FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/

# Install dependencies
RUN npm install
RUN cd packages/backend && npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN cd packages/backend && npm run build

EXPOSE 3000

# Add command to start the application
CMD ["npm", "run", "--prefix", "packages/backend", "start:prod"]
