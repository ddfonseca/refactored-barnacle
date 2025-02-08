# Inventory Management System Backend

A RESTful API backend for managing product inventory, built with Node.js, Express, TypeScript, and MongoDB.

## Features

- Product CRUD operations with JWT authentication
- Pagination, filtering, and sorting for product listing
- Search functionality for products
- Soft delete implementation
- MongoDB database integration
- Docker Compose setup for easy deployment

## Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB (handled by Docker Compose)

## Setup

1. Clone the repository
2. Create a .env file with the following variables:
   ```
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/inventory
   JWT_SECRET=your_jwt_secret_here
   ```
3. Run with Docker Compose:
   ```bash
   docker-compose up --build
   ```

4. Or run locally:
   ```bash
   npm install
   npm run dev
   ```

## API Endpoints

- `GET /api/products` - Get all products (with pagination, filtering, and sorting)
- `POST /api/products` - Create a new product (requires authentication)
- `PUT /api/products/:id` - Update a product (requires authentication)
- `DELETE /api/products/:id` - Soft delete a product (requires authentication)
- `GET /api/products/search?q=searchterm` - Search products

## Testing

Run the test suite:
```bash
npm test
```
