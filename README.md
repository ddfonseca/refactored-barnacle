# Inventory Management System

A modern full-stack application for managing product inventory. Built with **React, Node.js, Express/NestJS, TypeScript, and MongoDB**.

🚀 **Live Demo**: [Click here](https://srv719810.hstgr.cloud/)

## Features

- 🔐 **User Authentication** (JWT)
- 📦 **Product Management** (CRUD operations)
- 🔍 **Advanced Search & Filtering**
- 📱 **Responsive Design**
- 📜 **Interactive API Documentation** [Swagger 📖](https://srv719810.hstgr.cloud/api/docs)
- 📊 **Observability & Tracing** [OpenTelemetry 🔎](http://srv719810.hstgr.cloud:16686)

## ⏳ Development Time & Tools

- 🛠 **Editor**: Windsurf Editor + Claude 3.5 [(link)](https://codeium.com/windsurf)
- ⚙️ **Backend**: 50 min
- 🎨 **Frontend**: 95 min
- 🔄 **Refactoring**: 80 min
- Total: 3h45min (time spend until commit #8878de58)

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- npm or yarn

## Quick Start with Docker

1. Clone the repository.

2. Create environment files:

   For backend (`packages/backend/.env`):

   ```bash
   cp packages/backend/.env.example packages/backend/.env
   ```

   For frontend (`packages/frontend/.env`):

   ```bash
   cp packages/frontend/.env.example packages/frontend/.env.development
   ```

3. Start the application:

   ```bash
   docker-compose -f docker-compose-dev.yml up
   ```

   The services will be available at:

   - Frontend: http://localhost:80
   - Backend API: http://localhost:3000
   - Backend API Docs: http://localhost:3000/api
   - Backend Observability: http://localhost:16686
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
   cp .env.example .env.development
   ```

   Edit `.env` with your configuration.

4. Start the development server:
   ```bash
   npm run dev
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
