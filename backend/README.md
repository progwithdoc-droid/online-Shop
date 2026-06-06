# Backend Service

Professional ecommerce backend built with Node.js, Express, and Drizzle ORM. This service provides the API, authentication, authorization, data persistence, and media upload support that powers the ecommerce application.

## Overview

The backend is designed to separate concerns cleanly across controllers, services, routes, middleware, and models. It supports role-based access control for customers, vendors, and administrators, secure JWT authentication, Cloudinary file uploads, and PostgreSQL-compatible database persistence.

## Key Capabilities

- RESTful API endpoints for products, carts, orders, reviews, complaints, users, vendors, and administration
- JWT-based authentication and refresh token handling
- Role-based authorization middleware for restricted routes
- Request validation using Zod
- Cloudinary integration for image uploads
- Drizzle ORM schema and database utilities
- Structured error handling and response formatting

## Technology Stack

- Node.js 20+ compatible runtime
- Express 5
- Drizzle ORM
- PostgreSQL / NeonDB
- Cloudinary for media uploads
- JSON Web Tokens for authentication
- Zod for input validation
- bcryptjs for password hashing

## Repository Layout

- `app.js` / `server.js` - application bootstrap and server startup
- `config/` - database and Cloudinary configuration
- `controllers/` - HTTP request handlers
- `services/` - business logic and data operations
- `routes/` - route definitions for each domain
- `middleware/` - authentication, authorization, validation, and upload handling
- `models/schema.js` - Drizzle ORM schema definitions
- `utils/` - reusable helpers and API response formatters
- `uploads/` - local upload artifacts and temp resources

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- PostgreSQL-compatible database or NeonDB instance
- Cloudinary account for image uploads

## Installation

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create the environment file:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your database connection string, JWT secrets, Cloudinary credentials, and client URL.

## Running Locally

- Start in development mode:
  ```bash
  npm run dev
  ```
- Start in production mode:
  ```bash
  npm start
  ```

## Database and Seeding

- Generate Drizzle schema or migrations:
  ```bash
  npm run db:generate
  ```
- Push schema changes to the database:
  ```bash
  npm run db:push
  ```
- Seed demo data:
  ```bash
  npm run seed
  ```
- Open Drizzle Studio:
  ```bash
  npm run db:studio
  ```

## Environment Variables

- `PORT` - server port
- `NODE_ENV` - application environment
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - access token secret
- `JWT_EXPIRES_IN` - access token lifespan
- `REFRESH_TOKEN_SECRET` - refresh token secret
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLIENT_URL` - allowed frontend origin for CORS

## Best Practices

- Keep `.env` files local and do not commit them to source control
- Use strong, unique secrets for JWT and refresh tokens
- Configure HTTPS and secure headers for production deployments
- Apply database connection pooling and proper error handling in production
- Keep the service stateless so it can scale behind a load balancer

## Extending the Backend

This backend is structured for growth. Consider adding:

- payment gateway integration (Stripe, Razorpay, etc.)
- email notifications and transactional messaging
- audit logging and analytics endpoints
- caching with Redis or another in-memory store
- role-specific dashboards and advanced admin workflows
