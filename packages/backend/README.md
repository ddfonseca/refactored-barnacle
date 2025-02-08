# Inventory Management System Backend

A RESTful API backend for managing product inventory, built with Node.js, Express, TypeScript, and MongoDB.

## API Endpoints

- `GET /api/products` - Get all products (with pagination, filtering, and sorting)
- `POST /api/products` - Create a new product (requires authentication)
- `PUT /api/products/:id` - Update a product (requires authentication)
- `DELETE /api/products/:id` - Soft delete a product (requires authentication)
- `GET /api/products/search?q=searchterm` - Search products

## Environment Variables

Create a `.env` file with the following variables:
```
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inventory
JWT_SECRET=your_jwt_secret_here
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```
