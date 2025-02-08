# Inventory Management System

A full-stack inventory management system built with Node.js, Express, TypeScript, and MongoDB for the backend, and a modern frontend (to be implemented).

## Project Structure

This is a monorepo containing both the frontend and backend applications:

```
├── packages/
│   ├── backend/     # Node.js + Express + TypeScript backend
│   └── frontend/    # Frontend application (to be implemented)
```

## Features

### Backend
- Product CRUD operations with JWT authentication
- Pagination, filtering, and sorting for product listing
- Search functionality for products
- Soft delete implementation
- MongoDB database integration
- Docker Compose setup for easy deployment

### Frontend (Coming Soon)
- Modern and responsive UI
- Real-time inventory updates
- Advanced search and filtering
- User authentication and authorization

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (handled by Docker Compose)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the backend package
   - Configure the variables as needed

4. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev

   # Or start them individually
   npm run dev:backend
   npm run dev:frontend
   ```

5. Or use Docker Compose:
   ```bash
   docker-compose up --build
   ```

## Testing

Run all tests:
```bash
npm test
```

Or test specific packages:
```bash
npm run test:backend
npm run test:frontend
```

## API Documentation

API documentation can be found in the backend package's README at `packages/backend/README.md`.

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run tests and ensure they pass
4. Submit a pull request

## License

MIT
```bash
npm test
```
