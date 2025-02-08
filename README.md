# Inventory Management System

A modern full-stack application for managing product inventory. Built with React, Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 User Authentication (JWT)
- 📦 Product Management (CRUD operations)
- 🔍 Advanced Search & Filtering
- 📱 Responsive Design
- 🔄 Real-time Updates

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start with Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/full-stack-test.git
   cd full-stack-test
   ```

2. Create environment files:

   For backend (`packages/backend/.env`):

   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

   For frontend (`packages/frontend/.env`):

   ```bash
   cp packages/frontend/.env.example packages/frontend/.env
   ```

3. Start the application:

   ```bash
   docker-compose up
   ```

   The services will be available at:

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MongoDB: mongodb://localhost:27017

## Manual Setup (Development)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd packages/backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd packages/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
   ```

### Database Setup

For local development without Docker:

1. Install MongoDB Community Edition:

   - [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. Start MongoDB service:
   ```bash
   sudo systemctl start mongod    # Linux
   brew services start mongodb     # macOS
   ```

## Running Tests

### Backend Tests

```bash
cd packages/backend
npm test
```

## API Documentation

The API documentation is available at `/api/docs` when running the backend server.

## Project Structure

```
├── packages/
│   ├── backend/              # Node.js + Express backend
│   │   ├── src/
│   │   ├── tests/
│   │   └── package.json
│   └── frontend/             # React frontend
│       ├── src/
│       ├── public/
│       └── package.json
├── docker-compose.yml        # Docker composition
└── README.md
```
