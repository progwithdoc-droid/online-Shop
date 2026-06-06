# SparkIT- Ecommerce Application

A full-stack ecommerce application built with a Node.js backend and a React frontend. The project demonstrates a production-oriented architecture featuring authentication, role-based access control, product catalog management, shopping cart workflows, order processing, complaint handling, and vendor administration.

## Key Features

- Modular backend architecture with separate controllers, services, middleware, and routes
- RESTful API built on Express and Drizzle ORM for PostgreSQL/NeonDB
- Role-based authentication and authorization for customers, vendors, and administrators
- File upload integration using Cloudinary for product media management
- Frontend built with React, Vite, Tailwind CSS, and React Router
- Client-side state management with React Query and Zustand
- Validation using Zod for request payloads and form handling

## Architecture Overview

The repository is divided into two primary folders:

- `backend`: Node.js API server and database integration
- `frontend`: React application with role-based route protection and dashboard views

The backend handles all core business logic, authentication, data persistence, and third-party integrations. The frontend consumes the API and provides separate interfaces for customers, vendors, and administrators.

## Technology Stack

- Backend: Node.js, Express 5, Drizzle ORM, PostgreSQL, Cloudinary, JWT
- Frontend: React, Vite, Tailwind CSS, React Router, React Hook Form, Recharts
- Utilities: Axios, Zod, bcryptjs, dotenv, helmet, cors, compression

## Repository Layout

- `backend/app.js` / `backend/server.js` - API application entry points
- `backend/controllers/` - request handlers for each domain
- `backend/services/` - business logic and data operations
- `backend/routes/` - route definitions for public and protected endpoints
- `backend/middleware/` - authentication, role checks, validation, and uploads
- `backend/models/schema.js` - schema definitions for Drizzle ORM
- `frontend/src/` - React application source files
- `frontend/src/pages/` - page views organized by user roles
- `frontend/src/components/` - reusable UI and layout components
- `frontend/src/api/axios.js` - configured Axios instance for API requests
- `frontend/src/store/` - client-side state management stores

## Prerequisites

- Node.js 18 or later
- npm 10 or later
- PostgreSQL compatible database or NeonDB
- Cloudinary account for media uploads

## Setup and Installation

### Backend

1. Open a terminal in `project/backend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your values, including `DATABASE_URL`, `JWT_SECRET`, and Cloudinary credentials.
5. Start the backend in development mode:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `project/frontend`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment template:
   ```bash
   cp .env.sample .env
   ```
4. Update `.env` if necessary. The default points to `http://localhost:5000/api`.
5. Start the frontend development server:
   ```bash
   npm run dev
   ```

## Environment Variables

### Backend

- `PORT` - backend server port
- `NODE_ENV` - application environment
- `DATABASE_URL` - PostgreSQL database connection string
- `JWT_SECRET` - secret key for signing access tokens
- `JWT_EXPIRES_IN` - access token expiration
- `REFRESH_TOKEN_SECRET` - secret for refresh tokens
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `CLIENT_URL` - allowed frontend URL for CORS

### Frontend

- `VITE_API_URL` - base URL for API requests

## Development Commands

### Backend

- `npm run dev` - start the backend with Nodemon
- `npm start` - run the backend in production mode
- `npm run seed` - populate the database with seed data
- `npm run db:generate` - generate Drizzle migrations/schema
- `npm run db:push` - push schema changes to the database
- `npm run db:studio` - open Drizzle Studio

### Frontend

- `npm run dev` - start Vite development server
- `npm run build` - build production assets
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint checks

## Notes and Best Practices

- Keep secret keys and credentials out of source control by using `.env` files only in local development.
- Use strong, unique values for JWT secrets and avoid short or predictable strings.
- For production deployments, configure HTTPS, secure CORS origins, and database connection pooling.
- Validate API requests consistently in the backend and handle errors centrally for predictable responses.

## Extending the Project

This project is designed for extensibility and can be enhanced with:

- payment gateway support (e.g., Stripe or Razorpay)
- email notifications and OTP workflows
- Redis caching or session storage
- multi-tenancy for vendor isolation
- analytics dashboards and sales reporting

## Contact

For implementation details, refer to the source files under `backend/` and `frontend/src/`, or use the existing route and service structure as a reference for adding new features.
